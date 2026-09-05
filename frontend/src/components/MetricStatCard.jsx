import React from 'react'

const MetricStatCard = ({
  icon: Icon,
  value,
  label,
  iconBg = 'bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-300'
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft transition-colors">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 leading-tight tracking-tight">
            {value}
          </p>
          <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MetricStatCard
