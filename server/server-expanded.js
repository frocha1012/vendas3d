import express from 'express';
import cors from 'cors';
import pool from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ============ BUSINESS SETTINGS ============
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT setting_key, setting_value FROM business_settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = parseFloat(row.setting_value) || row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await pool.execute(
        'INSERT INTO business_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value.toString(), value.toString()]
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ============ FILAMENTS ============
app.get('/api/filaments', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM filaments ORDER BY color_name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching filaments:', error);
    res.status(500).json({ error: 'Failed to fetch filaments' });
  }
});

app.post('/api/filaments', async (req, res) => {
  try {
    const { color_name, brand, material, diameter_mm, price_per_kg, cost_per_gram, notes } = req.body;
    if (!color_name || !price_per_kg || cost_per_gram === undefined) {
      return res.status(400).json({ error: 'Color name, price per kg, and cost per gram are required' });
    }
    const [result] = await pool.execute(
      'INSERT INTO filaments (color_name, brand, material, diameter_mm, price_per_kg, cost_per_gram, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [color_name, brand || 'Bambu Lab', material || 'PLA', diameter_mm || 1.75, price_per_kg, cost_per_gram, notes || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error adding filament:', error);
    res.status(500).json({ error: 'Failed to add filament' });
  }
});

app.delete('/api/filaments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM filaments WHERE id = ?', [id]);
    res.json({ message: 'Filament deleted successfully' });
  } catch (error) {
    console.error('Error deleting filament:', error);
    res.status(500).json({ error: 'Failed to delete filament' });
  }
});

// ============ ITEMS (EXPANDED) ============
app.get('/api/items', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        i.*,
        f.color_name as filament_color,
        f.brand as filament_brand,
        f.cost_per_gram as filament_cost_per_gram
      FROM items i
      LEFT JOIN filaments f ON i.filament_id = f.id
      ORDER BY i.name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const {
      name, color, filament_id, grams_used, print_time_hours,
      hourly_rate, profit_margin, electricity_kw, notes
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    // Get business settings for defaults
    const [settingsRows] = await pool.execute('SELECT setting_key, setting_value FROM business_settings');
    const settings = {};
    settingsRows.forEach(row => {
      settings[row.setting_key] = parseFloat(row.setting_value) || row.setting_value;
    });

    // Get filament cost if filament_id provided
    let material_cost = 0;
    if (filament_id && grams_used) {
      const [filamentRows] = await pool.execute('SELECT cost_per_gram FROM filaments WHERE id = ?', [filament_id]);
      if (filamentRows.length > 0) {
        material_cost = parseFloat(filamentRows[0].cost_per_gram) * parseFloat(grams_used);
      }
    }

    // Calculate costs
    const finalHourlyRate = hourly_rate || settings.default_hourly_rate || 1.0;
    const finalPrintTime = parseFloat(print_time_hours) || 0;
    const labor_cost = finalHourlyRate * finalPrintTime;

    const finalElectricityKw = parseFloat(electricity_kw) || 0;
    const electricityCostPerKwh = settings.electricity_cost_per_kwh || 0.25;
    const electricity_cost = finalElectricityKw * electricityCostPerKwh;

    const total_cost_no_labor = material_cost + electricity_cost;
    const total_cost_no_profit = total_cost_no_labor + labor_cost;

    const finalProfitMargin = profit_margin || settings.default_profit_margin || 50;
    const final_price = total_cost_no_profit * (1 + finalProfitMargin / 100);

    // For backward compatibility, also set build_price
    const build_price = total_cost_no_profit;

    const [result] = await pool.execute(
      `INSERT INTO items (
        name, color, filament_id, grams_used, material_cost,
        print_time_hours, hourly_rate, labor_cost,
        electricity_kw, electricity_cost, total_cost_no_labor,
        profit_margin, final_price, build_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, color || null, filament_id || null, grams_used || null, material_cost,
        finalPrintTime, finalHourlyRate, labor_cost,
        finalElectricityKw, electricity_cost, total_cost_no_labor,
        finalProfitMargin, final_price, build_price
      ]
    );

    res.status(201).json({ 
      id: result.insertId,
      material_cost,
      labor_cost,
      electricity_cost,
      total_cost_no_labor,
      total_cost_no_profit: build_price,
      final_price
    });
  } catch (error) {
    console.error('Error adding item:', error);
    let errorMessage = 'Failed to add item';
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Database access denied. Please check Remote MySQL settings.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage, code: error.code });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM items WHERE id = ?', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ============ ORDERS ============
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        o.id,
        o.item_id,
        o.quantity,
        o.sale_price,
        o.sale_date,
        o.notes,
        o.created_at,
        i.name as item_name,
        i.color,
        i.material_cost,
        i.labor_cost,
        i.electricity_cost,
        i.final_price,
        (o.sale_price - i.final_price) * o.quantity as profit,
        (o.sale_price - i.build_price) * o.quantity as profit_legacy
      FROM orders o
      JOIN items i ON o.item_id = i.id
      ORDER BY o.sale_date DESC, o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { item_id, quantity, sale_price, sale_date, notes } = req.body;
    if (!item_id || !quantity || sale_price === undefined || !sale_date) {
      return res.status(400).json({ error: 'item_id, quantity, sale_price, and sale_date are required' });
    }
    const [result] = await pool.execute(
      'INSERT INTO orders (item_id, quantity, sale_price, sale_date, notes) VALUES (?, ?, ?, ?, ?)',
      [item_id, quantity, sale_price, sale_date, notes || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Failed to add order' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// ============ SUMMARY ============
app.get('/api/summary', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        SUM((o.sale_price - COALESCE(i.final_price, i.build_price)) * o.quantity) as total_profit,
        SUM(o.sale_price * o.quantity) as total_revenue,
        SUM((COALESCE(i.material_cost, 0) + COALESCE(i.labor_cost, 0) + COALESCE(i.electricity_cost, 0)) * o.quantity) as total_cost,
        SUM((COALESCE(i.material_cost, 0) * o.quantity)) as total_material_cost,
        SUM((COALESCE(i.labor_cost, 0) * o.quantity)) as total_labor_cost,
        SUM((COALESCE(i.electricity_cost, 0) * o.quantity)) as total_electricity_cost,
        COUNT(o.id) as total_orders,
        SUM(o.quantity) as total_items_sold
      FROM orders o
      JOIN items i ON o.item_id = i.id
    `);
    res.json(rows[0] || {
      total_profit: 0, total_revenue: 0, total_cost: 0,
      total_material_cost: 0, total_labor_cost: 0, total_electricity_cost: 0,
      total_orders: 0, total_items_sold: 0
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
