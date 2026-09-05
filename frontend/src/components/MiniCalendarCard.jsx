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
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700 transition-colors">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
          {monthName} {year}
        </span>

        <button
          onClick={handleNextMonth}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={idx} className="py-1">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center text-xs gap-y-1">
        {calendarDays.slice(0, 35).map((item, idx) => {
          return (
            <div key={idx} className="py-1 flex items-center justify-center">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full font-bold transition ${
                  item.isToday
                    ? 'bg-sky-500 text-white font-black shadow-md'
                    : item.isCurrentMonth
                    ? 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                    : 'text-slate-400 dark:text-slate-500 font-medium'
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
