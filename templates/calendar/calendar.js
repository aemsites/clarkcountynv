import { div, section } from '../../scripts/dom-helpers.js';
import { normalizeString } from '../../scripts/utils.js';

// Scripts for Full Calendar

// function getEventsManual() {
//   const events = [
//     {
//       title: 'All Day Event',
//       start: '2024-12-01',
//       backgroundColor: '#3787d8',
//     },
//     {
//       title: 'Long Event',
//       start: '2024-12-07',
//       end: '2024-12-10',
//       backgroundColor: '#da80c1',
//     },
//     {
//       groupId: '999',
//       title: 'Repeating Event',
//       start: '2024-12-09T16:00:00',
//       backgroundColor: '#3a9500',
//       classNames: ['county_commissioners'],
//     },
//     {
//       groupId: '1000',
//       title: 'Repeating Event',
//       start: '2024-12-16T16:00:00',
//       end: '2024-12-16T18:00:00',
//       backgroundColor: '#3a9500',
//       borderColor: 'blue',
//     },
//     {
//       title: 'Conference',
//       start: '2024-12-11',
//       end: '2024-12-13',
//       backgroundColor: 'red',
//     },
//     {
//       title: 'Meeting',
//       start: '2024-12-12T10:30:00',
//       end: '2024-12-12T12:30:00',
//       backgroundColor: 'red',
//     },
//     {
//       title: 'Lunch',
//       start: '2024-12-12T12:00:00',
//       backgroundColor: 'red',
//     },
//     {
//       title: 'Meeting',
//       start: '2024-12-12T14:30:00',
//       backgroundColor: 'red',
//     },
//     {
//       title: 'Birthday Party',
//       start: '2024-12-13T07:00:00',
//       backgroundColor: 'red',
//     },
//     {
//       title: 'Click for Facebook',
//       url: 'https://google.com/',
//       start: '2024-12-28',
//       backgroundColor: 'red',
//     },
//   ];
//   return events;
// }

const childCalendars = [
  'County Commissioners',
  'County Commission District A',
  'County Commission District B',
  'County Commissioners District C',
  'County Commissioners District D',
];

// Fetching events from individual calendar sheets
export async function fetchPlaceholders(prefix) {
  window.placeholders = window.placeholders || {};
  const TRANSLATION_KEY = prefix;
  const loaded = window.placeholders[`${TRANSLATION_KEY}-loaded`];

  if (!loaded) {
    window.placeholders[`${TRANSLATION_KEY}-loaded`] = new Promise((resolve) => {
      fetch(`/calendar/${prefix}/${prefix}.json?sheet=events`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return {};
        })
        .then((json) => {
          window.placeholders[prefix] = json;
          resolve(window.placeholders[prefix]);
        })
        .catch(() => {
          // error loading placeholders
          window.placeholders[prefix] = {};
          resolve(window.placeholders[prefix]);
        });
    });
  }
  await window.placeholders[`${TRANSLATION_KEY}-loaded`];
  return window.placeholders[`${TRANSLATION_KEY}`];
}

async function initializeCalendar() {
  let eventsData = [];
  const calendarEl = document.getElementById('calendar');
  // const data = getEventsManual();
  childCalendars.forEach(async (childCalendar, i) => {
    const normalizeCalendar = normalizeString(childCalendar);
    const placeholders = await fetchPlaceholders(normalizeCalendar);
    eventsData = [...eventsData, ...placeholders.data];
    if (i === childCalendars.length - 1) {
      // eslint-disable-next-line no-undef
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        selectable: true,
        dayMaxEvents: true,
        events: eventsData,
        eventTimeFormat: { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' },
      });
      calendar.render();
    }
  });
}

export function loadfullcalendar() {
  const scriptfullcalendar = document.createElement('script');
  scriptfullcalendar.setAttribute('type', 'text/javascript');
  scriptfullcalendar.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js';
  scriptfullcalendar.addEventListener('load', initializeCalendar);
  document.head.append(scriptfullcalendar);
}

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $mainChildren = Array.from($main.childNodes);
  const $section = section();
  const $calendarSection = section();

  $mainChildren.forEach((child) => {
    $section.appendChild(child);
  });

  $main.appendChild($section);
  const calDiv = div({ id: 'calendar' });
  $calendarSection.append(calDiv);
  $main.append($calendarSection);
  loadfullcalendar();
}
