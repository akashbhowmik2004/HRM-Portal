import React from 'react'

const TaskStatisticsCard = ({
  totalTask = 245,
  overdueTask = 17,
  segments = [
    { label: 'Completed Tasks', count: 142, percentage: 30, color: 'bg-emerald-600', dot: 'bg-emerald-600' },
    { label: 'In-progress Task', count: 115, percentage: 25, color: 'bg-[#315C7D]', dot: 'bg-[#315C7D]' },
    { label: 'On Hold Task', count: 22, percentage: 10, color: 'bg-amber-500', dot: 'bg-amber-500' },
    { label: 'Pending Task', count: 16, percentage: 21, color: 'bg-[#687482]', dot: 'bg-[#687482]' },
    { label: 'Review Task', count: 5, percentage: 14, color: 'bg-[#715D78]', dot: 'bg-[#715D78]' },
  ]
}) => {
  return (
    <div className="rounded-lg bg-white dark:bg-[#151d2e] p-5 shadow-subtle border border-[#E3E7EB] dark:border-gray-800 transition-colors">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#687482] dark:text-gray-400 mb-3.5">
        Task Statistics
      </h3>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="rounded-md border border-[#E3E7EB] dark:border-gray-800 bg-[#F0F2F4] dark:bg-[#0c1222] p-2.5 text-center">
          <p className="text-[11px] text-[#687482] dark:text-gray-400 font-medium">Total Tasks</p>
          <p className="mt-0.5 text-lg font-semibold text-[#202A35] dark:text-gray-100">{totalTask}</p>
        </div>
        <div className="rounded-md border border-[#E3E7EB] dark:border-gray-800 bg-[#F0F2F4] dark:bg-[#0c1222] p-2.5 text-center">
          <p className="text-[11px] text-[#687482] dark:text-gray-400 font-medium">Overdue</p>
          <p className="mt-0.5 text-lg font-semibold text-rose-600 dark:text-rose-400">{overdueTask}</p>
        </div>
      </div>

      {/* Segmented Color Bar */}
      <div className="h-1.5 w-full rounded-full overflow-hidden flex mb-4 bg-[#F0F2F4] dark:bg-gray-800">
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className={`${seg.color} h-full relative transition-all duration-200`}
            style={{ width: `${seg.percentage}%` }}
            title={`${seg.label}: ${seg.percentage}%`}
          />
        ))}
      </div>

      {/* Status Breakdown List */}
      <div className="space-y-2">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${seg.dot}`} />
              <span className="font-medium text-[#687482] dark:text-gray-300">{seg.label}</span>
            </div>
            <span className="font-semibold text-[#202A35] dark:text-gray-200 text-xs">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskStatisticsCard

