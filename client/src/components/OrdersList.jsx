import { useState } from 'react';
import EditOrderModal from './EditOrderModal';

function OrdersList({ orders, items, onDelete, onUpdate }) {
  const [editingOrder, setEditingOrder] = useState(null);
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-slate-500">No orders yet. Add your first order to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">Orders List</h2>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Item
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Build Price
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Profit (w/o)
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                Delivered
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-slate-900">
                    {new Date(order.sale_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-slate-900">{order.item_name}</div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-slate-600">{order.quantity}</div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-slate-600">
                    {order.build_price !== null && order.build_price !== undefined 
                      ? `€${parseFloat(order.build_price).toFixed(2)}`
                      : order.material_cost !== null || order.labor_cost !== null || order.electricity_cost !== null
                        ? `€${((parseFloat(order.material_cost || 0) + parseFloat(order.labor_cost || 0) + parseFloat(order.electricity_cost || 0))).toFixed(2)}`
                        : '-'
                    }
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-slate-600">
                    €{parseFloat(order.sale_price).toFixed(2)}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className={`text-xs sm:text-sm font-medium ${
                    parseFloat(order.profit_with_labor || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    €{parseFloat(order.profit_with_labor || 0).toFixed(2)}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className={`text-xs sm:text-sm font-medium ${
                    parseFloat(order.profit_without_labor || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    €{parseFloat(order.profit_without_labor || 0).toFixed(2)}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="text-xs sm:text-sm text-slate-600 max-w-xs truncate">
                    {order.notes || '-'}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center">
                    {order.paid ? (
                      <span className="text-green-600 text-lg">✓</span>
                    ) : (
                      <span className="text-slate-300 text-lg">○</span>
                    )}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center">
                    {order.delivered ? (
                      <span className="text-green-600 text-lg">✓</span>
                    ) : (
                      <span className="text-slate-300 text-lg">○</span>
                    )}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors py-1 px-1 sm:px-0 touch-manipulation"
                      aria-label="Edit order"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this order?')) {
                          onDelete(order.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors py-1 px-1 sm:px-0 touch-manipulation"
                      aria-label="Delete order"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditOrderModal
        order={editingOrder}
        items={items}
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={onUpdate}
      />
    </div>
  );
}

export default OrdersList;
