import { div, iframe, section } from '../../scripts/dom-helpers.js';

class Obj {
  // eslint-disable-next-line max-len
  constructor(title, start, end, allDay, daysOfWeek, startTime, endTime, startRecur, endRecur, url, backgroundColor, classNames) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.allDay = allDay;
    this.daysOfWeek = daysOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.startRecur = startRecur;
    this.endRecur = endRecur;
    this.url = url;
    this.backgroundColor = backgroundColor;
    this.classNames = classNames;
  }
}

// Fetching events from individual calendar sheets
export async function fetchPlaceholders(prefix) {
  window.placeholders = window.placeholders || {};
  const TRANSLATION_KEY = prefix;
  const loaded = window.placeholders[`${TRANSLATION_KEY}-loaded`];

  if (!loaded) {
    window.placeholders[`${TRANSLATION_KEY}-loaded`] = new Promise((resolve) => {
      fetch(`/calendar/${prefix}.json`)
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

function createModal(doc) {
  const modal = div(
    { class: 'event-modal' },
    div(
      { class: 'event-modal-content' },
      iframe({
        id: 'event-iframe',
        width: '100%',
        height: '100%',
      }),
    ),
  );
  doc.body.append(modal);
}

function popupEvent(url) {
  const modal = document.querySelector('.event-modal');
  modal.querySelector('iframe').src = url;
  modal.style.display = 'block';
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

async function initializeCalendar() {
  let importedData = [];
  const eventsList = [];
  const calendarEl = document.getElementById('calendar');
  // const data = getEventsManual();
  const normalizeCalendar = 'events';
  const placeholders = await fetchPlaceholders(normalizeCalendar);
  importedData = [...importedData, ...placeholders.data];
  // eslint-disable-next-line no-undef
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'addEventButton',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    selectable: true,
    dayMaxEvents: true,
    // events: importedData,
    eventTimeFormat: { hour: 'numeric', minute: '2-digit' },
    eventClick: (info) => {
      info.jsEvent.preventDefault(); // don't let the browser navigate
      if (info.event.url) {
        popupEvent(info.event.url);
      }
    },
  });
  calendar.render();
  importedData.forEach((event) => {
    const startTime = event.startRecur.split('T')[1];
    const endTime = event.endRecur.split('T')[1];
    const url = window.location.origin + event.path;
    const eventObj = new Obj(event.title, event.start, event.end, event.allDay, event.daysOfWeek, startTime, endTime, event.startRecur, event.endRecur, url, event['division-color'], event.classNames);
    eventsList.push(eventObj);
  });
  eventsList.forEach((event) => {
    if (event.daysOfWeek.length > 0) {
      calendar.addEvent({
        title: event.title,
        allDay: false,
        daysOfWeek: event.daysOfWeek,
        startTime: event.startTime,
        endTime: event.endTime,
        startRecur: event.startRecur,
        endRecur: event.endRecur,
        url: event.url,
        backgroundColor: event.backgroundColor,
        classNames: event.classNames,
      });
    } else {
      calendar.addEvent({
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        url: event.url,
        backgroundColor: event.backgroundColor,
        classNames: event.classNames,
      });
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
  doc.body.classList.add('calendar');
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
  createModal(doc);
}
