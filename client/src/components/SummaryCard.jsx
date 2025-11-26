function SummaryCard({ summary }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4">Overview</h2>
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 sm:p-5 rounded-lg">
          <div className="text-xs sm:text-sm opacity-90 mb-1">Total Revenue</div>
          <div className="text-2xl sm:text-3xl font-bold">
            €{parseFloat(summary.total_revenue || 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 sm:p-5 rounded-lg">
          <div className="text-xs sm:text-sm opacity-90 mb-1">Total Cost</div>
          <div className="text-2xl sm:text-3xl font-bold">
            €{parseFloat(summary.total_cost || 0).toFixed(2)}
          </div>
          <div className="text-xs opacity-75 mt-1">Material + Electricity</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 sm:p-5 rounded-lg sm:col-span-2 md:col-span-1">
          <div className="text-xs sm:text-sm opacity-90 mb-1">Total Orders</div>
          <div className="text-2xl sm:text-3xl font-bold">{summary.total_orders || 0}</div>
          <div className="text-xs opacity-75 mt-1">{summary.total_items_sold || 0} items sold</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-emerald-50 border-2 border-emerald-300 p-3 sm:p-4 rounded-lg">
          <div className="text-xs text-emerald-700 font-medium mb-1">Revenue (without expenses)</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-800">
            €{parseFloat(summary.revenue_without_labor || 0).toFixed(2)}
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            Revenue - (Material + Electricity)
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 border border-blue-200 p-3 sm:p-4 rounded-lg">
          <div className="text-xs text-blue-600 font-medium mb-1">Material Cost</div>
          <div className="text-lg sm:text-xl font-bold text-blue-700">
            €{parseFloat(summary.total_material_cost || 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 p-3 sm:p-4 rounded-lg">
          <div className="text-xs text-orange-600 font-medium mb-1">Electricity Cost</div>
          <div className="text-lg sm:text-xl font-bold text-orange-700">
            €{parseFloat(summary.total_electricity_cost || 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 p-3 sm:p-4 rounded-lg sm:col-span-2 md:col-span-1">
          <div className="text-xs text-indigo-600 font-medium mb-1">Total Labor Cost</div>
          <div className="text-lg sm:text-xl font-bold text-indigo-700">
            €{parseFloat(summary.total_labor_cost || 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
