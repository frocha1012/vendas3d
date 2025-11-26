import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api';

function FilamentsManager({ filaments, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    color_name: '',
    brand: 'Bambu Lab',
    material: 'PLA',
    diameter_mm: 1.75,
    price_per_kg: '',
    cost_per_gram: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate cost per gram when price per kg changes
  useEffect(() => {
    if (formData.price_per_kg) {
      const price = parseFloat(formData.price_per_kg);
      if (!isNaN(price)) {
        const costPerGram = price / 1000;
        setFormData(prev => ({ ...prev, cost_per_gram: costPerGram.toFixed(6) }));
      }
    }
  }, [formData.price_per_kg]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update existing filament
        await axios.put(`${API_URL}/filaments/${editingId}`, {
          ...formData,
          price_per_kg: parseFloat(formData.price_per_kg),
          cost_per_gram: parseFloat(formData.cost_per_gram),
          diameter_mm: parseFloat(formData.diameter_mm)
        });
      } else {
        // Add new filament
        await axios.post(`${API_URL}/filaments`, {
          ...formData,
          price_per_kg: parseFloat(formData.price_per_kg),
          cost_per_gram: parseFloat(formData.cost_per_gram),
          diameter_mm: parseFloat(formData.diameter_mm)
        });
      }
      
      // Reset form
      setFormData({
        color_name: '',
        brand: 'Bambu Lab',
        material: 'PLA',
        diameter_mm: 1.75,
        price_per_kg: '',
        cost_per_gram: ''
      });
      setIsAdding(false);
      setEditingId(null);
      onUpdate();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error saving filament';
      alert(errorMsg);
      console.error('Error saving filament:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (filament) => {
    setEditingId(filament.id);
    setFormData({
      color_name: filament.color_name,
      brand: filament.brand,
      material: filament.material,
      diameter_mm: filament.diameter_mm,
      price_per_kg: filament.price_per_kg.toString(),
      cost_per_gram: filament.cost_per_gram.toString()
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      color_name: '',
      brand: 'Bambu Lab',
      material: 'PLA',
      diameter_mm: 1.75,
      price_per_kg: '',
      cost_per_gram: ''
    });
  };

  const handleDelete = async (id, colorName) => {
    if (!window.confirm(`Are you sure you want to delete "${colorName}" filament?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/filaments/${id}`);
      onUpdate();
    } catch (error) {
      alert('Error deleting filament. It might be in use by existing items.');
      console.error('Error deleting filament:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            {editingId ? 'Edit Filament' : 'Add New Filament'}
          </h2>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Filament
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Color Name *
                </label>
                <input
                  type="text"
                  name="color_name"
                  value={formData.color_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Material *
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Diameter (mm) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="diameter_mm"
                  value={formData.diameter_mm}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price per kg (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price_per_kg"
                  value={formData.price_per_kg}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                  disabled={isSubmitting}
                  placeholder="12.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cost per gram (€) *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  name="cost_per_gram"
                  value={formData.cost_per_gram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                  required
                  disabled={isSubmitting}
                  readOnly
                />
                <p className="text-xs text-slate-500 mt-1">Auto-calculated from price/kg</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Add'} Filament
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
          </form>
        )}
      </div>

      {/* Filaments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800">Filaments List</h2>
        </div>
        {filaments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No filaments yet. Add your first filament to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Diameter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Price/kg</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Cost/gram</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filaments.map((filament) => (
                  <tr key={filament.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{filament.color_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{filament.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{filament.material}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{filament.diameter_mm} mm</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">€{parseFloat(filament.price_per_kg || 0).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        €{parseFloat(filament.cost_per_gram || 0).toFixed(6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(filament)}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(filament.id, filament.color_name)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilamentsManager;
