import { useState, useEffect } from 'react';

function EditOrderModal({ order, items, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    item_id: '',
    quantity: '',
    sale_price: '',
    sale_date: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        item_id: order.item_id?.toString() || '',
        quantity: order.quantity?.toString() || '1',
        sale_price: order.sale_price?.toString() || '',
        sale_date: order.sale_date || '',
        notes: order.notes || ''
      });
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const selectedItem = items.find(item => item.id === parseInt(formData.item_id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(order.id, {
        item_id: parseInt(formData.item_id),
        quantity: parseInt(formData.quantity),
        sale_price: parseFloat(formData.sale_price),
        sale_date: formData.sale_date,
        notes: formData.notes.trim() || null
      });
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Edit Order</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-item" className="block text-sm font-medium text-slate-700 mb-1">
              Item *
            </label>
            <select
              id="edit-item"
              name="item_id"
              value={formData.item_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
              disabled={isSubmitting}
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} {item.color ? `(${item.color})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-quantity" className="block text-sm font-medium text-slate-700 mb-1">
                Quantity *
              </label>
              <input
                id="edit-quantity"
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="edit-sale-date" className="block text-sm font-medium text-slate-700 mb-1">
                Sale Date *
              </label>
              <input
                id="edit-sale-date"
                type="date"
                name="sale_date"
                value={formData.sale_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-sale-price" className="block text-sm font-medium text-slate-700 mb-1">
              Sale Price (per item) *
            </label>
            <input
              id="edit-sale-price"
              type="number"
              step="0.01"
              min="0"
              name="sale_price"
              value={formData.sale_price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0.00"
              required
              disabled={isSubmitting}
            />
            {selectedItem && formData.sale_price && (
              <div className="mt-2 space-y-1 text-sm">
                <div className="text-slate-600">
                  Build cost: €{selectedItem.build_price 
                    ? parseFloat(selectedItem.build_price).toFixed(2)
                    : (parseFloat(selectedItem.material_cost || 0) + parseFloat(selectedItem.labor_cost || 0) + parseFloat(selectedItem.electricity_cost || 0)).toFixed(2)
                  }
                </div>
                <div className="text-green-600 font-medium">
                  Profit per item: €{(parseFloat(formData.sale_price) - (selectedItem.build_price 
                    ? parseFloat(selectedItem.build_price)
                    : (parseFloat(selectedItem.material_cost || 0) + parseFloat(selectedItem.labor_cost || 0) + parseFloat(selectedItem.electricity_cost || 0))
                  )).toFixed(2)}
                </div>
                <div className="text-blue-600 font-medium">
                  Profit (w/o labor): €{(parseFloat(formData.sale_price) - (parseFloat(selectedItem.material_cost || 0) + parseFloat(selectedItem.electricity_cost || 0))).toFixed(2)}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="edit-notes" className="block text-sm font-medium text-slate-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="edit-notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              rows="3"
              placeholder="Additional notes..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-lg font-medium hover:bg-slate-400 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditOrderModal;
