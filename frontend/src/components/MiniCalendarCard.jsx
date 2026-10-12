import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MiniCalendarCard = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const monthName = months[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))
  }

  // Calculate calendar grid for the month
  const firstDayIndex = new Date(year, currentDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, currentDate.getMonth(), 0).getDate()

  const calendarDays = []

  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      isToday: i === currentDate.getDate()
    })
  }

  // Next month padding to fill grid
  const remainingCells = 35 - calendarDays.length
  if (remainingCells > 0) {
    for (let i = 1; i <= remainingCells; i++) {
      calendarDays.push({
        day: i,
        isCurrentMonth: false
      })
    }
  }

  return (
    <div className="rounded-lg bg-white dark:bg-[#151d2e] p-5 shadow-subtle border border-[#E3E7EB] dark:border-gray-800 transition-colors">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="rounded-md p-1 text-[#687482] hover:bg-[#F0F2F4] hover:text-[#202A35] dark:hover:bg-slate-700"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-xs font-semibold text-[#202A35] dark:text-white tracking-tight">
          {monthName} {year}
        </span>

        <button
          onClick={handleNextMonth}
          className="rounded-md p-1 text-[#687482] hover:bg-[#F0F2F4] hover:text-[#202A35] dark:hover:bg-slate-700"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-[#687482] dark:text-slate-300 mb-1.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={idx} className="py-0.5">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center text-xs gap-y-1">
        {calendarDays.slice(0, 35).map((item, idx) => {
          return (
            <div key={idx} className="py-0.5 flex items-center justify-center">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-medium transition ${
                  item.isToday
                    ? 'bg-[#202A35] text-white font-semibold dark:bg-white dark:text-[#202A35]'
                    : item.isCurrentMonth
                    ? 'text-[#202A35] dark:text-white hover:bg-[#F0F2F4] dark:hover:bg-slate-700'
                    : 'text-[#687482]/40 dark:text-slate-500'
                }`}
              >
                {item.day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MiniCalendarCard

