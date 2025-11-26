import { useState, useEffect } from 'react';
import axios from 'axios';
import ItemsList from './components/ItemsList';
import OrdersList from './components/OrdersList';
import AddItemForm from './components/AddItemForm';
import AddOrderForm from './components/AddOrderForm';
import SummaryCard from './components/SummaryCard';
import FilamentsManager from './components/FilamentsManager';
import SettingsPage from './components/SettingsPage';

const API_URL = '/api';

function App() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filaments, setFilaments] = useState([]);
  const [settings, setSettings] = useState({});
  const [summary, setSummary] = useState({
    total_profit: 0,
    total_revenue: 0,
    revenue_without_labor: 0,
    total_cost: 0,
    total_material_cost: 0,
    total_labor_cost: 0,
    total_electricity_cost: 0,
    total_orders: 0,
    total_items_sold: 0
  });
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    fetchItems();
    fetchOrders();
    fetchSummary();
    fetchFilaments();
    fetchSettings();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      if (error.code === 'ERR_NETWORK' || error.response?.status === 500) {
        console.error('Database connection issue:', error.response?.data?.error);
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/summary`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchFilaments = async () => {
    try {
      const response = await axios.get(`${API_URL}/filaments`);
      setFilaments(response.data || []);
    } catch (error) {
      console.error('Error fetching filaments:', error);
      // Set empty array on error to prevent crashes
      setFilaments([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      setSettings(response.data || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default settings on error to prevent crashes
      setSettings({
        default_hourly_rate: 1.0,
        electricity_cost_per_kwh: 0.25,
        default_profit_margin: 50.0
      });
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      await axios.post(`${API_URL}/items`, itemData);
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      await fetchItems();
      await fetchOrders();
      await fetchSummary();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddOrder = async (orderData) => {
    try {
      await axios.post(`${API_URL}/orders`, orderData);
      await fetchOrders();
      await fetchSummary();
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`${API_URL}/orders/${id}`);
      await fetchOrders();
      await fetchSummary();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleUpdateOrder = async (id, orderData) => {
    try {
      await axios.put(`${API_URL}/orders/${id}`, orderData);
      await fetchOrders();
      await fetchSummary();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <header className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-1 sm:mb-2">Sales Tracker</h1>
          <p className="text-sm sm:text-base text-slate-600">Track your items, orders, and profits</p>
        </header>

        <SummaryCard summary={summary} />

        <div className="mt-4 sm:mt-8">
          <div className="overflow-x-auto -mx-3 sm:mx-0 mb-4 sm:mb-6 border-b border-slate-200">
            <div className="flex space-x-1 sm:space-x-2 min-w-max px-3 sm:px-0">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                  activeTab === 'summary'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                  activeTab === 'items'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Items
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('filaments')}
                className={`px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                  activeTab === 'filaments'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Filaments
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {activeTab === 'summary' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    €{parseFloat(summary.total_profit || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Total Profit</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    €{parseFloat(summary.total_revenue || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Total Revenue</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    €{parseFloat(summary.total_cost || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Total Cost</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {summary.total_orders || 0}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Total Orders</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6">
              <AddItemForm 
                onAdd={handleAddItem} 
                filaments={filaments}
                settings={settings}
              />
              <ItemsList items={items} onDelete={handleDeleteItem} />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <AddOrderForm items={items} onAdd={handleAddOrder} />
              <OrdersList 
                orders={orders} 
                items={items}
                onDelete={handleDeleteOrder}
                onUpdate={handleUpdateOrder}
              />
            </div>
          )}

          {activeTab === 'filaments' && (
            <FilamentsManager 
              filaments={filaments} 
              onUpdate={() => {
                fetchFilaments();
                fetchItems(); // Refresh items to update filament names
              }} 
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage 
              settings={settings}
              onUpdate={() => {
                fetchSettings();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
