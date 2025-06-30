import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

export default function VaccinationSchedule() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      // weekends={false}
      events={[
        { title: 'Vaccination Campaign 1', date: '2025-07-01' },
        { title: 'Health Check Campaign 2', date: '2025-07-02' },
        { title: 'Health Check Campaign 3', start: '2025-07-02', end: '2025-07-05' },
      ]}
      dateClick={(info) => {
        alert('Clicked on: ' + info.dateStr)
      }}
      eventClick={(info) => {
        alert('Event: ' + info.event.title + '\nDate: ' + info.event.start.toISOString())
      }}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
    />
  )
}