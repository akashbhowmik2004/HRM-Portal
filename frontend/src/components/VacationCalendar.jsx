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
        borderRadius: '4px',
        opacity: 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        padding: '2px 6px',
        fontSize: '0.75rem',
        fontWeight: '500'
      }
    }
  }

  // Highlight weekends in the calendar background
  const dayPropGetter = (date) => {
    const day = date.getDay()
    if (day === 0 || day === 6) {
      return {
        className: 'bg-rose-50/20'
      }
    }
    return {}
  }

  return (
    <div className="rounded-lg border border-[#E3E7EB] bg-white p-5 shadow-subtle">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[#202A35] mb-0.5">Company Calendar</h3>
        <p className="text-xs text-[#687482]">Official public holidays and team leaves.</p>
      </div>
      
      {/* Overriding some default react-big-calendar styles nicely with Tailwind */}
      <style>{`
        .rbc-calendar { font-family: inherit; }
        .rbc-header { padding: 8px 0; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; color: #687482; border-bottom: 1px solid #E3E7EB; }
        .rbc-month-view { border-radius: 6px; border: 1px solid #E3E7EB; overflow: hidden; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #E3E7EB; }
        .rbc-month-row + .rbc-month-row { border-top: 1px solid #E3E7EB; }
        .rbc-today { background-color: #F6F7F8; }
        .rbc-date-cell { padding: 4px 8px; font-weight: 500; font-size: 0.8125rem; color: #202A35; }
        .rbc-off-range-bg { background-color: #F0F2F4; }
        .rbc-btn-group button { border-color: #E3E7EB; color: #687482; padding: 5px 10px; font-size: 0.8125rem; }
        .rbc-btn-group button.rbc-active { background-color: #F0F2F4; color: #202A35; box-shadow: none; font-weight: 600; }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active:hover, .rbc-toolbar button.rbc-active:focus { background-color: #F0F2F4; }
        .rbc-toolbar .rbc-toolbar-label { font-weight: 600; color: #202A35; font-size: 1rem; }
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

