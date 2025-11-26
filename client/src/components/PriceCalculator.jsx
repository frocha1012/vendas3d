function PriceCalculator({ formData, settings, selectedFilament }) {
  // Calculate material cost
  const materialCost = selectedFilament && formData?.grams_used
    ? (selectedFilament.cost_per_gram || 0) * parseFloat(formData.grams_used || 0)
    : 0;

  // Calculate labor cost
  const hourlyRate = parseFloat(formData?.hourly_rate) || parseFloat(settings?.default_hourly_rate) || 1.0;
  const printTime = parseFloat(formData?.print_time_hours) || 0;
  const laborCost = hourlyRate * printTime;

  // Calculate electricity cost
  const electricityKw = parseFloat(formData?.electricity_kw) || 0;
  const electricityCostPerKwh = parseFloat(settings?.electricity_cost_per_kwh) || 0.25;
  const electricityCost = electricityKw * electricityCostPerKwh;

  // Calculate totals
  const totalCostNoLabor = materialCost + electricityCost;
  const totalCostNoProfit = totalCostNoLabor + laborCost;

  // Calculate final price
  const profitMargin = parseFloat(formData?.profit_margin) || parseFloat(settings?.default_profit_margin) || 50;
  const finalPrice = totalCostNoProfit * (1 + profitMargin / 100);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5 space-y-3">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Price Calculator</h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-white rounded p-2">
          <div className="text-xs text-slate-600">Material Cost</div>
          <div className="font-bold text-blue-600">€{materialCost.toFixed(2)}</div>
        </div>
        
        <div className="bg-white rounded p-2">
          <div className="text-xs text-slate-600">Labor Cost</div>
          <div className="font-bold text-green-600">€{laborCost.toFixed(2)}</div>
        </div>
        
        <div className="bg-white rounded p-2">
          <div className="text-xs text-slate-600">Electricity Cost</div>
          <div className="font-bold text-orange-600">€{electricityCost.toFixed(2)}</div>
        </div>
        
        <div className="bg-white rounded p-2">
          <div className="text-xs text-slate-600">Total Cost</div>
          <div className="font-bold text-slate-700">€{totalCostNoProfit.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 text-center">
        <div className="text-xs opacity-90 mb-1">Final Price ({profitMargin}% margin)</div>
        <div className="text-3xl font-bold">€{finalPrice.toFixed(2)}</div>
      </div>

      {(formData?.grams_used && !selectedFilament) && (
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
          ⚠️ Select a filament to calculate material cost
        </div>
      )}
    </div>
  );
}

export default PriceCalculator;
