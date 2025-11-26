import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api';

function SettingsPage({ settings, onUpdate }) {
  const [formData, setFormData] = useState({
    default_hourly_rate: '',
    electricity_cost_per_kwh: '',
    average_printer_power_w: '',
    default_profit_margin: '',
    currency: 'EUR'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        default_hourly_rate: settings.default_hourly_rate?.toString() || '1.00',
        electricity_cost_per_kwh: settings.electricity_cost_per_kwh?.toString() || '0.25',
        average_printer_power_w: settings.average_printer_power_w?.toString() || '250',
        default_profit_margin: settings.default_profit_margin?.toString() || '50.00',
        currency: settings.currency || 'EUR'
      });
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.put(`${API_URL}/settings`, {
        default_hourly_rate: parseFloat(formData.default_hourly_rate),
        electricity_cost_per_kwh: parseFloat(formData.electricity_cost_per_kwh),
        average_printer_power_w: parseFloat(formData.average_printer_power_w),
        default_profit_margin: parseFloat(formData.default_profit_margin),
        currency: formData.currency
      });
      
      setIsEditing(false);
      onUpdate();
      alert('Settings saved successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error saving settings';
      alert(errorMsg);
      console.error('Error saving settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        default_hourly_rate: settings.default_hourly_rate?.toString() || '1.00',
        electricity_cost_per_kwh: settings.electricity_cost_per_kwh?.toString() || '0.25',
        average_printer_power_w: settings.average_printer_power_w?.toString() || '250',
        default_profit_margin: settings.default_profit_margin?.toString() || '50.00',
        currency: settings.currency || 'EUR'
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">3D Print Business Settings</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Settings
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Default Hourly Rate (€)
            </label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                min="0"
                name="default_hourly_rate"
                value={formData.default_hourly_rate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                disabled={isSubmitting}
              />
            ) : (
              <div className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                {formData.default_hourly_rate || '1.00'} €/hour
              </div>
            )}
            <p className="text-xs text-slate-500">Hourly rate used for labor cost calculation</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Electricity Cost per kWh (€)
            </label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                min="0"
                name="electricity_cost_per_kwh"
                value={formData.electricity_cost_per_kwh}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                disabled={isSubmitting}
              />
            ) : (
              <div className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                {formData.electricity_cost_per_kwh || '0.25'} €/kWh
              </div>
            )}
            <p className="text-xs text-slate-500">Cost per kilowatt-hour of electricity</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Average Printer Power (W)
            </label>
            {isEditing ? (
              <input
                type="number"
                step="1"
                min="0"
                name="average_printer_power_w"
                value={formData.average_printer_power_w}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                disabled={isSubmitting}
              />
            ) : (
              <div className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                {formData.average_printer_power_w || '250'} W
              </div>
            )}
            <p className="text-xs text-slate-500">Average power consumption of your printer</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Default Profit Margin (%)
            </label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                min="0"
                name="default_profit_margin"
                value={formData.default_profit_margin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                disabled={isSubmitting}
              />
            ) : (
              <div className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                {formData.default_profit_margin || '50.00'}%
              </div>
            )}
            <p className="text-xs text-slate-500">Default profit margin applied to items</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Currency
            </label>
            {isEditing ? (
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isSubmitting}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BRL">BRL (R$)</option>
              </select>
            ) : (
              <div className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                {formData.currency || 'EUR'}
              </div>
            )}
            <p className="text-xs text-slate-500">Currency used throughout the app</p>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-400 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default SettingsPage;
