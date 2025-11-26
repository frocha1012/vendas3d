import { useState } from 'react';

function AddOrderForm({ items, onAdd }) {
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [salePrice, setSalePrice] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [paid, setPaid] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = items.find(item => item.id === parseInt(itemId));
  const profit = selectedItem && salePrice && quantity
    ? (parseFloat(salePrice) - parseFloat(selectedItem.build_price)) * parseFloat(quantity)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemId || !quantity || !salePrice || !saleDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        item_id: parseInt(itemId),
        quantity: parseInt(quantity),
        sale_price: parseFloat(salePrice),
        sale_date: saleDate,
        notes: notes.trim() || null,
        paid: paid,
        delivered: delivered
      });
      setItemId('');
      setQuantity('1');
      setSalePrice('');
      setSaleDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setPaid(false);
      setDelivered(false);
    } catch (error) {
      alert('Error adding order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-slate-500">Please add at least one item before adding orders.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4">Add New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="order-item" className="block text-sm font-medium text-slate-700 mb-1">
            Item *
          </label>
          <select
            id="order-item"
            value={itemId}
            onChange={(e) => {
              setItemId(e.target.value);
              if (e.target.value) {
                const item = items.find(i => i.id === parseInt(e.target.value));
                if (item && !salePrice) {
                  setSalePrice(item.build_price.toString());
                }
              }
            }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            disabled={isSubmitting}
            required
          >
            <option value="">Select an item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (Build: ${parseFloat(item.build_price).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">
              Quantity *
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="sale-date" className="block text-sm font-medium text-slate-700 mb-1">
              Sale Date *
            </label>
            <input
              id="sale-date"
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="sale-price" className="block text-sm font-medium text-slate-700 mb-1">
            Sale Price (per item) *
          </label>
          <input
            id="sale-price"
            type="number"
            step="0.01"
            min="0"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="0.00"
            required
            disabled={isSubmitting}
          />
          {selectedItem && salePrice && (
            <p className="text-sm text-slate-600 mt-1">
              Build cost: ${parseFloat(selectedItem.build_price).toFixed(2)} | 
              Profit per item: ${(parseFloat(salePrice) - parseFloat(selectedItem.build_price)).toFixed(2)}
            </p>
          )}
        </div>

        {selectedItem && salePrice && quantity && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">Estimated Profit:</span>
              <span className="text-lg font-bold text-green-600">
                ${profit.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-green-700 mt-1">
              ({quantity} × ${parseFloat(salePrice).toFixed(2)}) - ({quantity} × ${parseFloat(selectedItem.build_price).toFixed(2)})
            </div>
          </div>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            rows="3"
            placeholder="Additional notes about this order..."
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={paid}
              onChange={(e) => setPaid(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="text-sm font-medium text-slate-700">Paid</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={delivered}
              onChange={(e) => setDelivered(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="text-sm font-medium text-slate-700">Delivered</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px]"
        >
          {isSubmitting ? 'Adding...' : 'Add Order'}
        </button>
      </form>
    </div>
  );
}

export default AddOrderForm;
