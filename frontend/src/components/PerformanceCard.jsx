import React from 'react'

const PerformanceCard = ({
  teams = [
    { name: 'Design Team', percentage: 35, barColor: 'bg-[#315C7D]' },
    { name: 'Developer Team', percentage: 25, barColor: 'bg-[#34766F]' },
    { name: 'Management', percentage: 75, barColor: 'bg-emerald-600' },
    { name: 'Marketing', percentage: 15, barColor: 'bg-amber-500' },
    { name: 'Others', percentage: 11, barColor: 'bg-[#715D78]' },
  ]
}) => {
  return (
    <div className="rounded-lg bg-white dark:bg-[#151d2e] p-5 shadow-subtle border border-[#E3E7EB] dark:border-gray-800 transition-colors">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#687482] dark:text-gray-400 mb-4">
        Department Performance
      </h3>

      <div className="space-y-3.5">
        {teams.map((team, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#202A35] dark:text-gray-300">
                {team.name}
              </span>
              <span className="font-semibold text-[#687482] dark:text-gray-200">
                {team.percentage}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#F0F2F4] dark:bg-gray-800 overflow-hidden">
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

