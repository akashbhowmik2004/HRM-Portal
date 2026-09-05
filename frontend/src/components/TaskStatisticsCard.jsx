import React from 'react'

const TaskStatisticsCard = ({
  totalTask = 245,
  overdueTask = 17,
  segments = [
    { label: 'Completed Tasks', count: 142, percentage: 30, color: 'bg-indigo-400', dot: 'bg-indigo-400' },
    { label: 'In-progress Task', count: 115, percentage: 25, color: 'bg-amber-400', dot: 'bg-amber-400' },
    { label: 'On Hold Task', count: 22, percentage: 10, color: 'bg-emerald-400', dot: 'bg-emerald-400' },
    { label: 'Pending Task', count: 16, percentage: 21, color: 'bg-rose-400', dot: 'bg-rose-400' },
    { label: 'Review Task', count: 5, percentage: 14, color: 'bg-teal-400', dot: 'bg-teal-400' },
  ]
}) => {
  return (
    <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 shadow-soft border border-gray-100/80 dark:border-gray-800/50 transition-colors">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Task Statistics
      </h3>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-gray-100/80 dark:border-gray-800/50 bg-gray-50/50 dark:bg-[#0c1222]/50 p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Task</p>
          <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-gray-100">{totalTask}</p>
        </div>
        <div className="rounded-xl border border-gray-100/80 dark:border-gray-800/50 bg-gray-50/50 dark:bg-[#0c1222]/50 p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Overdue Task</p>
          <p className="mt-1 text-xl font-semibold text-rose-500 dark:text-rose-400">{overdueTask}</p>
        </div>
      </div>

      {/* Segmented Color Bar */}
      <div className="h-2 w-full rounded-full overflow-hidden flex mb-5 bg-gray-100 dark:bg-gray-800">
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className={`${seg.color} h-full relative transition-all duration-300`}
            style={{ width: `${seg.percentage}%` }}
            title={`${seg.label}: ${seg.percentage}%`}
          />
        ))}
      </div>

      {/* Status Breakdown List */}
      <div className="space-y-3">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full ${seg.dot} ring-2 ring-white dark:ring-[#151d2e]`} />
              <span className="font-medium text-gray-600 dark:text-gray-300">{seg.label}</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskStatisticsCard
