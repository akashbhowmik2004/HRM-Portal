import { useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Holidays from 'date-holidays'
import { PartyPopper } from 'lucide-react'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Initialize India holidays
const hd = new Holidays('IN')

const VacationCalendar = ({ vacations = [], onAddVacation }) => {
  const events = useMemo(() => {
    const currentYear = new Date().getFullYear()
    
    // Get real public holidays for this year and next year
    const holidaysList = [
      ...hd.getHolidays(currentYear),
      ...hd.getHolidays(currentYear + 1)
    ]

    const holidayEvents = holidaysList.map(h => ({
      title: h.name,
      start: new Date(h.date),
      end: new Date(h.date),
      allDay: true,
      type: 'holiday'
    }))

    const vacationEvents = vacations.map(v => ({
      title: `${v.employeeName} (${v.type})`,
      start: new Date(v.date),
      end: new Date(v.date),
      allDay: true,
      type: 'vacation',
      status: v.status
    }))

    return [...holidayEvents, ...vacationEvents]
  }, [vacations])

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad' // default blue
    
    if (event.type === 'holiday') {
      backgroundColor = '#d97706' // amber-600
    } else if (event.type === 'vacation') {
      if (event.status === 'Approved') backgroundColor = '#059669' // emerald-600
      else if (event.status === 'Pending') backgroundColor = '#d97706' // amber-600
      else backgroundColor = '#e11d48' // rose-600
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        padding: '2px 6px',
        fontSize: '0.75rem',
        fontWeight: '600'
      }
    }
  }

  // Highlight weekends in the calendar background
  const dayPropGetter = (date) => {
    const day = date.getDay()
    if (day === 0 || day === 6) {
      return {
        className: 'bg-rose-50/30'
      }
    }
    return {}
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 mb-1">Company Calendar</h3>
        <p className="text-sm text-slate-500">Includes official public holidays and team vacations.</p>
      </div>
      
      {/* Overriding some default react-big-calendar styles nicely with Tailwind */}
      <style>{`
        .rbc-calendar { font-family: inherit; }
        .rbc-header { padding: 8px 0; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        .rbc-month-view { border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
        .rbc-month-row + .rbc-month-row { border-top: 1px solid #e2e8f0; }
        .rbc-today { background-color: #f8fafc; }
        .rbc-date-cell { padding: 4px 8px; font-weight: 500; font-size: 0.875rem; color: #334155; }
        .rbc-off-range-bg { background-color: #f1f5f9; }
        .rbc-btn-group button { border-color: #e2e8f0; color: #475569; padding: 6px 12px; }
        .rbc-btn-group button.rbc-active { background-color: #f1f5f9; box-shadow: inset 0 3px 5px rgba(0,0,0,0.05); }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active:hover, .rbc-toolbar button.rbc-active:focus { background-color: #e2e8f0; }
        .rbc-toolbar .rbc-toolbar-label { font-weight: 700; color: #0f172a; font-size: 1.125rem; }
      `}</style>

      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'agenda']}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter}
          components={{
            event: ({ event }) => (
              <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
                {event.type === 'holiday' && <PartyPopper className="h-3 w-3 shrink-0" />}
                <span className="truncate">{event.title}</span>
              </div>
            )
          }}
          selectable={true}
          onSelectSlot={(slotInfo) => {
            if (onAddVacation) {
              const dateStr = format(slotInfo.start, 'yyyy-MM-dd')
              onAddVacation(dateStr)
            }
          }}
          popup
        />
      </div>
    </div>
  )
}

export default VacationCalendar
