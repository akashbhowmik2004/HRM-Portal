import React from 'react'

const PerformanceCard = ({
  teams = [
    { name: 'Design Team', percentage: 35, barColor: 'bg-indigo-400' },
    { name: 'Developer Team', percentage: 25, barColor: 'bg-amber-400' },
    { name: 'Management', percentage: 75, barColor: 'bg-emerald-400' },
    { name: 'Marketing', percentage: 15, barColor: 'bg-rose-400' },
    { name: 'Others', percentage: 11, barColor: 'bg-teal-400' },
  ]
}) => {
  return (
    <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 shadow-soft border border-gray-100/80 dark:border-gray-800/50 transition-colors">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-5">
        Performance
      </h3>

      <div className="space-y-4">
        {teams.map((team, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {team.name}
              </span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {team.percentage}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${team.barColor} transition-all duration-500`}
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
