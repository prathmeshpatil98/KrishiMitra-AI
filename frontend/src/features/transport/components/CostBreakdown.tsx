import { motion } from 'framer-motion'
import { Fuel, Coins, CloudSun, Leaf, Route, Info } from 'lucide-react'
import { ComputedRouteItem } from '@/pages/Transport'
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell 
} from 'recharts'

interface CostBreakdownProps {
  active: ComputedRouteItem
  riskColor: string
  quantity: number
  vehicleType: string
  fuelPrice: number
  fuelEfficiency: number
  cargoType: string
  derivedCost: { fuel: number; toll: number; total: number }
  routes: ComputedRouteItem[]
}

export function CostBreakdown({ 
  active, 
  riskColor, 
  quantity, 
  vehicleType, 
  fuelEfficiency, 
  derivedCost,
  routes
}: CostBreakdownProps) {
  
  // Base calculations read directly from synchronized computed engine
  const fuelCost = Math.round(derivedCost.fuel)
  const tollCost = Math.round(derivedCost.toll)
  const otherCosts = Math.round(active.otherCostCalculated)
  const totalCost = fuelCost + tollCost + otherCosts

  const fuelPct = (fuelCost / Math.max(totalCost, 1)) * 100
  const tollPct = (tollCost / Math.max(totalCost, 1)) * 100
  const otherPct = (otherCosts / Math.max(totalCost, 1)) * 100

  // 1. Cost Distribution Data for Recharts Pie
  const costDistributionData = [
    { name: 'Fuel Expense', value: fuelCost, color: '#3B82F6' },
    { name: 'Toll Charges', value: tollCost, color: '#F59E0B' },
    { name: 'Driver/Load Fees', value: otherCosts, color: '#A8B4AF' },
  ]

  // 2. Route Profit Comparison Data
  const routeComparisonData = routes.map((r) => {
    return {
      name: r.name.split(',')[0], // Shorter name
      Profit: Math.round(r.profitCalculated),
      Cost: Math.round(r.totalCostCalculated),
      isSelected: r.id === active.id
    }
  })

  // 3. Carbon Footprint Estimate
  let co2PerKm = 0.5
  if (vehicleType === 'heavytruck') co2PerKm = 0.95
  if (vehicleType === 'pickup') co2PerKm = 0.45
  if (vehicleType === 'mini') co2PerKm = 0.28
  const carbonFootprint = Math.round(active.distance * co2PerKm * (1 + (quantity - 50) * 0.0008))

  return (
    <div className="flex flex-col gap-8 w-full mt-2">
      
      {/* Aligned Cards Row: Symmetric 3-column equal-height layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch w-full">
        
        {/* Card 1: Cost Breakdown */}
        <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] shadow-xl p-6 flex flex-col justify-between h-full">
          <div>
            <p className="text-[12px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-6 flex items-center gap-1.5 font-mono-jb">
              <Coins size={14} className="text-[#3B82F6]" /> Cost Breakdown
            </p>
            
            <div className="flex flex-col gap-3">
              {[
                { label: 'Fuel Expense', val: `₹${fuelCost.toLocaleString('en-IN')}`, icon: <Fuel size={13} />, pct: fuelPct, color: 'bg-[#3B82F6]' },
                { label: 'Toll Charges', val: `₹${tollCost.toLocaleString('en-IN')}`, icon: <Coins size={13} />, pct: tollPct, color: 'bg-[#F59E0B]' },
                { label: 'Other Surcharges', val: `₹${otherCosts.toLocaleString('en-IN')}`, icon: <Info size={13} />, pct: otherPct, color: 'bg-[#A8B4AF]' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-3.5 rounded-2xl bg-[#121D18] border border-white/[0.04] transition-all hover:bg-[#121D18]/80"
                >
                  <div className="flex justify-between items-center mb-2 font-mono-jb">
                    <span className="text-[11.5px] font-semibold text-[#A8B4AF] flex items-center gap-1.5 font-sans">
                      {s.icon} {s.label}
                    </span>
                    <span className="text-[13px] font-bold text-[#F5F7F6]">
                      {s.val}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${s.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.04] flex justify-between items-center shrink-0">
            <span className="text-[10px] text-[#A8B4AF]/60 uppercase tracking-wider font-semibold font-mono-jb">Total Cost</span>
            <span className="text-[20px] font-mono-jb font-black text-[#43F59A]">₹{totalCost.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Card 2: Weather Risk */}
        <div className={`rounded-[24px] border p-6 shadow-xl flex flex-col justify-between h-full transition-colors ${riskColor}`}>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wider mb-6 flex items-center gap-1.5 font-mono-jb">
              <CloudSun size={14} /> Weather & Transit Risk
            </p>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[44px]">
                {active.weather.rainProb > 50 ? '⛈️' : active.weather.rainProb > 25 ? '🌧️' : '☀️'}
              </span>
              <div>
                <p className="font-mono-jb text-[24px] font-bold leading-none tracking-tight">{active.weather.temp}°C</p>
                <p className="text-[12px] font-semibold mt-1.5 opacity-80">{active.weather.desc}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-[11.5px] border-t border-white/[0.08] pt-4 font-mono-jb">
              <div className="flex justify-between font-medium">
                <span className="opacity-70 font-sans">Precipitation Probability</span>
                <span className="font-bold">{active.weather.rainProb}%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="opacity-70 font-sans">Road Slickness Index</span>
                <span className="font-bold font-sans">
                  {active.weather.rainProb > 50 ? 'High Danger' : active.weather.rainProb > 25 ? 'Moderate Caution' : 'Dry / Optimal'}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="opacity-70 font-sans">Waterproof Tarp Needed</span>
                <span className="font-bold font-sans">{active.weather.rainProb > 25 ? 'Yes (Mandatory)' : 'Optional'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Carbon Analytics */}
        <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-6 shadow-xl flex flex-col justify-between h-full">
          <div>
            <p className="text-[12px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-6 flex items-center gap-1.5 font-mono-jb">
              <Leaf size={14} className="text-[#2ECC71]" /> Carbon Analytics
            </p>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-mono-jb text-[32px] font-bold text-[#43F59A] tracking-tight leading-none">{carbonFootprint}</span>
              <span className="text-[11px] text-[#A8B4AF] font-bold">kg CO2</span>
            </div>
            <p className="text-[11px] text-[#A8B4AF]/60 leading-relaxed mb-6 font-light">
              Estimated greenhouse emissions based on weight ({quantity} Qtl) and engine load factor.
            </p>

            <div className="space-y-2.5 text-[11.5px] border-t border-white/[0.04] pt-4 font-mono-jb">
              <div className="flex justify-between font-medium">
                <span className="text-[#A8B4AF] font-sans">Transit Type:</span>
                <span className="text-[#F5F7F6] font-semibold uppercase">{vehicleType}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#A8B4AF] font-sans">Emission Class:</span>
                <span className="text-[#43F59A] font-semibold font-sans">Euro VI Compliant</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#A8B4AF] font-sans">Fuel Burn Rate:</span>
                <span className="text-[#F5F7F6] font-semibold">
                  {Math.round(active.distance / Math.max(fuelEfficiency, 1))} L total
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Interactive Recharts Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-2">
        
        {/* Cost vs Profit Comparison Chart (7 columns) */}
        <div className="lg:col-span-7 bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
            <h4 className="text-[13px] font-bold text-[#F5F7F6] uppercase tracking-wider flex items-center gap-1.5 font-mono-jb">
              <Route size={14} className="text-[#2ECC71]" /> Mandi Profit vs Cost Analysis
            </h4>
            <span className="text-[9px] text-[#A8B4AF]/50 font-mono-jb">All Available Routes</span>
          </div>

          <div className="h-[210px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#A8B4AF" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#A8B4AF" 
                  fontSize={8} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F1714', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    fontSize: '11px',
                    color: '#F5F7F6'
                  }}
                  itemStyle={{ color: '#43F59A' }}
                  labelStyle={{ color: '#A8B4AF', fontWeight: 'bold' }}
                />
                <Bar dataKey="Profit" fill="#2ECC71" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Cost" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 justify-center mt-4 text-[10px] shrink-0 font-mono-jb">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-[#2ECC71]" />
              <span className="text-[#A8B4AF] font-sans">Estimated Net Profit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-[#3B82F6]" />
              <span className="text-[#A8B4AF] font-sans">Total Logistics Cost</span>
            </div>
          </div>
        </div>

        {/* Cost Distribution Ratio (5 columns) */}
        <div className="lg:col-span-5 bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
            <h4 className="text-[13px] font-bold text-[#F5F7F6] uppercase tracking-wider flex items-center gap-1.5 font-mono-jb">
              <Fuel size={14} className="text-[#3B82F6]" /> Cost Distribution Ratio
            </h4>
            <span className="text-[9px] text-[#A8B4AF]/50 font-mono-jb">Current Active Route</span>
          </div>

          <div className="flex items-center gap-6 justify-between flex-1">
            {/* Pie Chart */}
            <div className="h-[140px] w-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {costDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F1714', 
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      fontSize: '11px' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend info panel */}
            <div className="flex flex-col gap-3.5 flex-grow">
              {costDistributionData.map((d, idx) => (
                <div key={d.name} className="flex flex-col font-mono-jb">
                  <div className="flex items-center gap-2 text-[11px] text-[#A8B4AF] font-sans">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="font-medium">{d.name}</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#F5F7F6] pl-4">
                    ₹{d.value.toLocaleString('en-IN')} ({(idx === 0 ? fuelPct : idx === 1 ? tollPct : otherPct).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Route Comparison matrix table */}
      <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-6 shadow-xl w-full mt-6">
        <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
          <h4 className="text-[13px] font-bold text-[#F5F7F6] uppercase tracking-wider flex items-center gap-1.5 font-mono-jb">
            <Info size={14} className="text-[#3B82F6]" /> Route Comparison Matrix
          </h4>
          <span className="text-[9px] text-[#A8B4AF]/50 font-mono-jb">Real-time parameters</span>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-[12px] border-collapse font-mono-jb">
            <thead>
              <tr className="border-b border-white/5 text-[#A8B4AF]/60 uppercase tracking-wider font-semibold text-[10px]">
                <th className="pb-3 pl-4 font-sans">Mandi Name</th>
                <th className="pb-3">Distance</th>
                <th className="pb-3 font-sans">ETA</th>
                <th className="pb-3">Fuel Cost</th>
                <th className="pb-3">Tolls</th>
                <th className="pb-3">Logistics Cost</th>
                <th className="pb-3 font-sans">Risk Rating</th>
                <th className="pb-3 pr-4 text-right font-sans">Mandi Score</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => {
                const f = Math.round(r.fuelCostCalculated)
                const t = Math.round(r.tollCostCalculated)
                const c = Math.round(r.totalCostCalculated)
                const score = r.profitScoreCalculated

                return (
                  <tr 
                    key={r.id} 
                    className={`border-b border-white/[0.03] transition-all hover:bg-white/[0.01] ${r.id === active.id ? 'bg-[#2ECC71]/5 text-[#43F59A]' : 'text-[#A8B4AF]'}`}
                  >
                    <td className="py-3.5 pl-4 font-semibold text-[#F5F7F6] font-sans">{r.name}</td>
                    <td className="py-3.5">{r.distance} km</td>
                    <td className="py-3.5 font-sans">{r.eta}</td>
                    <td className="py-3.5">₹{f.toLocaleString()}</td>
                    <td className="py-3.5">₹{t.toLocaleString()}</td>
                    <td className="py-3.5">₹{c.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border font-sans ${
                        r.weather.rainProb > 40 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                          : r.weather.rainProb > 20 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {r.weather.rainProb}% rain risk
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-right font-bold text-white">{score}/100</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default CostBreakdown
