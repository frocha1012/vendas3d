function ItemsList({ items, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-slate-500">No items yet. Add your first item to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-800">Items List</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Color
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Filament
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Grams
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Print Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Costs
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Final Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{item.name}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">{item.color || '-'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">
                    {item.filament_color || '-'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">
                    {item.grams_used ? `${item.grams_used}g` : '-'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">
                    {item.print_time_hours ? `${item.print_time_hours}h` : '-'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-xs text-slate-600 space-y-0.5">
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
                      <div className="text-slate-400">
                        {item.build_price ? `€${parseFloat(item.build_price).toFixed(2)}` : '-'}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {item.final_price 
                      ? `€${parseFloat(item.final_price).toFixed(2)}`
                      : item.build_price
                      ? `€${parseFloat(item.build_price).toFixed(2)}`
                      : '-'
                    }
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${item.name}"? This will also delete all related orders.`)) {
                        onDelete(item.id);
                      }
                    }}
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
    </div>
  );
}

export default ItemsList;