import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/sass/styles.scss'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import constants from '../constants';


export default function CalendarMVP(props) {
  const localizer = momentLocalizer(moment)
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${constants.baseURL}schedule`
        );
        const json = await response.json();
        let Myevents = json.data.map((event) => {
          if (event.approved === 1){
            return {
              id: event.id,
              title: event.reason,
              desc: event.reason,
              start: new Date(event.startDate),
              end: new Date(event.endDate),
            };
          }
        });
        setEvents(Myevents);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData()
    if (props.refreshCalendar) {
      fetchData();
      props.offRefresh();
    }
  }, [props.refreshCalendar])

  return (
    <div>
      <Calendar
        events={events}
        localizer={localizer}
        startAccessor="start"
        views={{ month: true }}
        style={{ height: 500, width: 700 }}
        endAccessor="end"
      />
    </div>
  );
}