function ItemsList({ items, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center transition-colors">
        <p className="text-slate-500 dark:text-slate-400">No items yet. Add your first item to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-colors">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">Items List</h2>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[700px]">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Color
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Filament
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Grams
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Print Time
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Costs
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Final Price
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</div>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{item.color || '-'}</div>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {item.filament_color || '-'}
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {item.grams_used ? `${item.grams_used}g` : '-'}
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {item.print_time_hours ? `${item.print_time_hours}h` : '-'}
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                    {item.material_cost && (
                      <div>Mat: €{parseFloat(item.material_cost).toFixed(2)}</div>
                    )}
                    {item.labor_cost && (
                      <div>Lab: €{parseFloat(item.labor_cost).toFixed(2)}</div>
                    )}
                    {item.electricity_cost && (
                      <div>Elec: €{parseFloat(item.electricity_cost).toFixed(2)}</div>
                    )}
                    {!item.material_cost && !item.labor_cost && !item.electricity_cost && (
                      <div className="text-slate-400 dark:text-slate-500">
                        {item.build_price ? `€${parseFloat(item.build_price).toFixed(2)}` : '-'}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                    {item.final_price 
                      ? `€${parseFloat(item.final_price).toFixed(2)}`
                      : item.build_price
                      ? `€${parseFloat(item.build_price).toFixed(2)}`
                      : '-'
                    }
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${item.name}"? This will also delete all related orders.`)) {
                        onDelete(item.id);
                      }
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors py-1 touch-manipulation"
                    aria-label="Delete item"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ItemsList;