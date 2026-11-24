import React from 'react'

const PerformanceCard = ({
  teams = []
}) => {
  return (
    <div className="rounded-xl bg-white p-4 sm:p-5 shadow-xs border border-[#E2E8E5] transition-colors dark:bg-[#151d2e] dark:border-gray-800">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#647572] mb-4 dark:text-gray-300">
        Department Performance
      </h3>

      <div className="space-y-3.5">
        {teams.length === 0 ? (
          <p className="text-xs text-[#647572] dark:text-gray-400">No department performance data available.</p>
        ) : teams.map((team, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#172B2A] dark:text-gray-100">
                {team.name}
              </span>
              <span className="font-semibold text-[#647572] dark:text-gray-400">
                {team.percentage}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#F8FAF9] overflow-hidden dark:bg-[#0f172a]">
              <div
                className={`h-full rounded-full ${team.barColor} transition-all duration-300`}
                style={{ width: `${team.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PerformanceCard

