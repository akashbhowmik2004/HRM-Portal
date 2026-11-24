import React from 'react'

const MetricStatCard = ({
  icon: Icon,
  value,
  label,
  subtext,
  badge,
  badgeType = 'positive', // 'positive' | 'warning' | 'neutral'
  iconBg = 'bg-blue-50 text-blue-600',
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-3.5 sm:p-5 border border-[#E3E7EB] shadow-card transition-all hover:shadow-elevated dark:bg-[#151d2e] dark:border-gray-800 min-w-0">
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 w-full">
        {Icon && (
          <div className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#667085] truncate dark:text-gray-400">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight leading-tight dark:text-gray-100">
              {value}
            </span>
            {badge && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate max-w-full ${
                  badgeType === 'positive'
                    ? 'text-emerald-700 bg-emerald-50'
                    : badgeType === 'warning'
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-slate-600 bg-slate-100'
                }`}
              >
                {badge}
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-[10px] sm:text-[11px] font-medium text-[#667085] mt-0.5 truncate dark:text-gray-400">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MetricStatCard


