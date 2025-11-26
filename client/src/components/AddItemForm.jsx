import { useState, useEffect } from 'react';
import PriceCalculator from './PriceCalculator';

function AddItemForm({ onAdd, filaments = [], settings = {} }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [filamentId, setFilamentId] = useState('');
  const [gramsUsed, setGramsUsed] = useState('');
  const [printTimeHours, setPrintTimeHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [electricityKw, setElectricityKw] = useState('');
  const [profitMargin, setProfitMargin] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedFilament = Array.isArray(filaments) 
    ? filaments.find(f => f && f.id === parseInt(filamentId))
    : null;
  
  const formData = {
    grams_used: gramsUsed,
    print_time_hours: printTimeHours,
    hourly_rate: hourlyRate,
    electricity_kw: electricityKw,
    profit_margin: profitMargin
  };

  // Load default values from settings on mount
  useEffect(() => {
    if (settings.default_hourly_rate && !hourlyRate) {
      setHourlyRate(settings.default_hourly_rate.toString());
    }
    if (settings.default_profit_margin && !profitMargin) {
      setProfitMargin(settings.default_profit_margin.toString());
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Item name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        color: color.trim() || null,
        filament_id: filamentId ? parseInt(filamentId) : null,
        grams_used: gramsUsed ? parseFloat(gramsUsed) : null,
        print_time_hours: printTimeHours ? parseFloat(printTimeHours) : null,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        electricity_kw: electricityKw ? parseFloat(electricityKw) : null,
        profit_margin: profitMargin ? parseFloat(profitMargin) : null,
        notes: notes.trim() || null
      });
      
      // Reset form
      setName('');
      setColor('');
      setFilamentId('');
      setGramsUsed('');
      setPrintTimeHours('');
      setHourlyRate(settings.default_hourly_rate?.toString() || '');
      setElectricityKw('');
      setProfitMargin(settings.default_profit_margin?.toString() || '');
      setNotes('');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error adding item. Please try again.';
      alert(errorMsg);
      console.error('Error details:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-calculate electricity based on print time if not provided
  const handlePrintTimeChange = (value) => {
    setPrintTimeHours(value);
    if (!electricityKw && value && settings.average_printer_power_w) {
      // Calculate: (power in kW) * (hours)
      const powerKw = (settings.average_printer_power_w / 1000);
      const calculatedKw = powerKw * parseFloat(value);
      setElectricityKw(calculatedKw.toFixed(4));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4">Add New Item</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-name" className="block text-sm font-medium text-slate-700 mb-1">
              Item Name *
            </label>
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., Boneco (Corpo)"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div>
            <label htmlFor="item-color" className="block text-sm font-medium text-slate-700 mb-1">
              Color
            </label>
            <input
              id="item-color"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., White, Black"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Material Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="filament" className="block text-sm font-medium text-slate-700 mb-1">
              Filament
            </label>
            <select
              id="filament"
              value={filamentId}
              onChange={(e) => setFilamentId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              disabled={isSubmitting}
            >
              <option value="">Select filament...</option>
              {Array.isArray(filaments) && filaments.map((filament) => (
                filament && (
                  <option key={filament.id} value={filament.id}>
                    {filament.color_name} - {filament.brand} ({parseFloat(filament.cost_per_gram || 0).toFixed(4)} €/g)
                  </option>
                )
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="grams-used" className="block text-sm font-medium text-slate-700 mb-1">
              Grams Used
            </label>
            <input
              id="grams-used"
              type="number"
              step="0.01"
              min="0"
              value={gramsUsed}
              onChange={(e) => setGramsUsed(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Labor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="print-time" className="block text-sm font-medium text-slate-700 mb-1">
              Print Time (hours)
            </label>
            <input
              id="print-time"
              type="number"
              step="0.01"
              min="0"
              value={printTimeHours}
              onChange={(e) => handlePrintTimeChange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="hourly-rate" className="block text-sm font-medium text-slate-700 mb-1">
              Hourly Rate (€)
            </label>
            <input
              id="hourly-rate"
              type="number"
              step="0.01"
              min="0"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={settings.default_hourly_rate || "1.00"}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Electricity & Profit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="electricity-kw" className="block text-sm font-medium text-slate-700 mb-1">
              Electricity (kW)
            </label>
            <input
              id="electricity-kw"
              type="number"
              step="0.0001"
              min="0"
              value={electricityKw}
              onChange={(e) => setElectricityKw(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Auto-calculated"
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-500 mt-1">
              Cost: €{(electricityKw ? parseFloat(electricityKw) * (settings.electricity_cost_per_kwh || 0.25) : 0).toFixed(4)}/kWh
            </p>
          </div>
          
          <div>
            <label htmlFor="profit-margin" className="block text-sm font-medium text-slate-700 mb-1">
              Profit Margin (%)
            </label>
            <input
              id="profit-margin"
              type="number"
              step="0.01"
              min="0"
              value={profitMargin}
              onChange={(e) => setProfitMargin(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={settings.default_profit_margin || "50"}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            rows="2"
            placeholder="Additional notes..."
            disabled={isSubmitting}
          />
        </div>

        {/* Price Calculator */}
        {(name || filamentId || printTimeHours) && (
          <PriceCalculator 
            formData={formData}
            settings={settings}
            selectedFilament={selectedFilament}
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px]"
        >
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}

export default AddItemForm;