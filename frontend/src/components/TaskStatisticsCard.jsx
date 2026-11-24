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
    <div className="rounded-xl bg-white p-5 shadow-xs border border-[#E2E8E5] transition-colors dark:bg-[#151d2e] dark:border-gray-800">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#647572] mb-3.5 dark:text-gray-300">
        Task Statistics
      </h3>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="rounded-lg border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 text-center dark:border-gray-700 dark:bg-[#0f172a]">
          <p className="text-[11px] text-[#647572] font-medium dark:text-gray-400">Total Tasks</p>
          <p className="mt-0.5 text-lg font-bold text-[#172B2A] dark:text-gray-100">{totalTask}</p>
        </div>
        <div className="rounded-lg border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 text-center dark:border-gray-700 dark:bg-[#0f172a]">
          <p className="text-[11px] text-[#647572] font-medium dark:text-gray-400">Overdue</p>
          <p className="mt-0.5 text-lg font-bold text-rose-600 dark:text-rose-400">{overdueTask}</p>
        </div>
      </div>

      {/* Segmented Color Bar */}
      <div className="h-1.5 w-full rounded-full overflow-hidden flex mb-4 bg-[#F8FAF9] dark:bg-[#0f172a]">
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
              <span className="font-medium text-[#647572] dark:text-gray-400">{seg.label}</span>
            </div>
            <span className="font-semibold text-[#172B2A] text-xs dark:text-gray-100">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskStatisticsCard

