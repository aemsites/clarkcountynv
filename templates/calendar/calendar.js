/* global rrule */
import {
  div, iframe, section, button, a, ul, li,
} from '../../scripts/dom-helpers.js';
import { normalizeString, getWindowSize, getViewPort } from '../../scripts/utils.js';
// eslint-disable-next-line import/no-cycle
import { createModal } from '../../blocks/modal/modal.js';

export const EDS_DOMAINS = ['main--clarkcountynv--aemsites.aem.page', 'main--clarkcountynv--aemsites.aem.live'];
class Obj {
  // eslint-disable-next-line max-len
  constructor(title, start, end, allDay, daysOfWeek, startTime, endTime, url, backgroundColor, textColor, classNames, readMore, divisionid, excludeDates, duration, freq) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.allDay = allDay;
    this.daysOfWeek = daysOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.url = url;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.classNames = classNames;
    this.readMore = readMore;
    this.divisionid = divisionid;
    this.excludeDates = excludeDates;
    this.duration = duration;
    this.freq = freq;
  }
}

let deepLinkDay = 0;
let deepLinkMonth = 0;
let deepLinkYear = 0;
let deepLinkView = '';
const today = new Date();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();

export function mobilecheck() {
  const { width } = getWindowSize();
  if (width >= 900) {
    return false;
  }
  return true;
}

let calendar = null;
let events = [];
let calendarEl = null;

let divisions = [];
let placeholders = [];

// Fetching events from individual calendar sheets
export async function fetchPlaceholders(prefix) {
  window.placeholders = window.placeholders || {};
  const TRANSLATION_KEY = prefix;
  const loaded = window.placeholders[`${TRANSLATION_KEY}-loaded`];

  if (!loaded) {
    window.placeholders[`${TRANSLATION_KEY}-loaded`] = new Promise((resolve) => {
      fetch(`/calendar/${prefix}.json?sheet=default&sheet=divisions`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return {};
        })
        .then((json) => {
          window.placeholders.calendarevents = json.default;
          window.placeholders.divisions = json.divisions;
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
  return window.placeholders;
}

const handleModalClose = () => {
  const url = new URL(window.location.href);
  if (url.searchParams.size > 0 && url.searchParams.has('id')) {
    url.searchParams.delete('id');
    window.history.pushState({}, '', url.href);
  }
  const modal = document.querySelector('.event-modal-block');
  if (modal) {
    const closeButton = modal.querySelector('.close-button');
    closeButton?.click();
  }
};

async function popupEvent(url, readMore) {
  const eventModalContent = document.createDocumentFragment();
  const pageIframe = iframe({ src: url });
  const eventFooter = div({ class: 'event-modal-footer hidden' });
  const closeWindowBtn = button({ class: `button close-modal-btn ${readMore.length === 1 ? 'primary' : 'secondary'}` }, 'Close Window');
  eventFooter.append(closeWindowBtn);
  if (readMore.length > 1) {
    const readMoreBtn = a({ href: readMore, class: `${readMore ? 'button primary' : ''}`, target: '_blank' }, 'Read More');
    eventFooter.append(readMoreBtn);
  }
  eventModalContent.append(pageIframe, eventFooter);
  const { showModal, block: eventModal } = await createModal([eventModalContent]);
  eventModal.classList.add('event-modal-block');
  showModal();

  pageIframe.addEventListener('load', () => {
    const iframeDocument = pageIframe.contentDocument || pageIframe.contentWindow.document;
    const iframeBody = iframeDocument?.body;
    const eventFooterSection = iframeBody?.querySelector('.section.event-footer');
    if (eventFooterSection && eventFooterSection.children.length === 0) {
      eventFooterSection.append(eventFooter.cloneNode(true));
      const footerEl = eventFooterSection.querySelector('.event-modal-footer');
      if (footerEl && footerEl.classList.contains('hidden')) {
        footerEl.classList.remove('hidden');
      }
      const closeBtn = footerEl.querySelector('.close-modal-btn');
      closeBtn?.addEventListener('click', handleModalClose);
      const modalEl = pageIframe.closest('.event-modal-block');
      const topCloseBtn = modalEl?.querySelector('.close-button');
      topCloseBtn?.addEventListener('click', handleModalClose);
    } else {
      const modalContentEl = pageIframe.closest('.modal-content');
      const eventModalFooterEl = modalContentEl?.querySelector('.event-modal-footer');
      if (eventModalFooterEl && eventModalFooterEl.classList.contains('hidden')) {
        eventModalFooterEl.classList.remove('hidden');
      }
    }
  });
}

function disableSpinner() {
  const spinnerDiv = document.querySelector('.spinner');
  spinnerDiv.style.display = 'none';
}

function disableRightClick() {
  document.querySelectorAll('.noReadMore').forEach((element) => {
    element.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  });
}

async function getfromDOM(element) {
  const currentURL = element.href;
  if (currentURL) {
    const resp = await fetch(currentURL);
    const htmlBody = await resp.text();
    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlBody, 'text/html');
    const readMoreMeta = dom.querySelector('meta[name="readmore"]');
    if (readMoreMeta) {
      element.href = readMoreMeta.content;
    }
  }
}

async function changehref() {
  document.querySelectorAll('.yesReadMore').forEach(async (element) => {
    await getfromDOM(element);
  });
}

function getbyweekday(daysOfWeek) {
  return daysOfWeek.split(',').map((item) => {
    const match = item.match(/^([a-z]{2})\((-?\d+)\)$/i); // match like mo(1), mo(-1)
    if (match) {
      const day = match[1].toUpperCase(); // e.g., "MO"
      const nth = parseInt(match[2], 10); // e.g., 1 or -1
      if (rrule.RRule[day]) {
        return rrule.RRule[day].nth(nth);
      }
    } else {
      // Handle simple "mo" case (no parentheses)
      const day = item.toUpperCase();
      if (rrule.RRule[day]) {
        return rrule.RRule[day];
      }
    }
    return null;
  }).filter(Boolean);
}

function createEvents(eventsList) {
  disableSpinner();
  let eventDuration = '';
  eventsList.forEach((event) => {
    if (event.freq.toLowerCase() === 'daily') {
      event.daysOfWeek = 'mo,tu,we,th,fr,sa,su';
    }
    event.allDay = event.allDay === 'true';
    if (event.daysOfWeek.length > 1) {
      if (event.duration && event.duration.length > 0) {
        eventDuration = `${event.duration.split('T')[1]}`;
      } else {
        eventDuration = '01:00';
      }
      if (event.excludeDates && event.excludeDates.length > 1) {
        if (typeof event.excludeDates === 'string') {
          event.excludeDates = event.excludeDates.split(',').map((date) => `${date}T${event.startTime}`).filter((content) => content.includes('-'));
        }
        const eventbyweekday = getbyweekday(event.daysOfWeek);
        /* Converting String into array to leverage map function */
        calendar.addEvent({
          title: event.title,
          allDay: event.allDay,
          rrule: {
            freq: event.freq,
            byweekday: eventbyweekday,
            dtstart: event.start,
            until: event.end,
          },
          duration: eventDuration,
          exdate: event.excludeDates,
          url: event.url,
          classNames: event.classNames,
          groupId: event.divisionid,
          extendedProps: { readMore: event.readMore },
          id: `${event.divisionid}-${event.title.length}${event.start.length}`,
        });
      } else {
        const eventbyweekday = getbyweekday(event.daysOfWeek);
        calendar.addEvent({
          title: event.title,
          allDay: event.allDay,
          rrule: {
            freq: event.freq,
            byweekday: eventbyweekday,
            dtstart: event.start,
            until: event.end,
          },
          duration: eventDuration,
          url: event.url,
          classNames: event.classNames,
          groupId: event.divisionid,
          extendedProps: { readMore: event.readMore },
          id: `${event.divisionid}-${event.title.length}${event.start.length}`,
        });
      }
    } else {
      calendar.addEvent({
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        url: event.url,
        classNames: event.classNames,
        groupId: event.divisionid,
        extendedProps: { readMore: event.readMore },
        id: `${event.divisionid}-${event.title.length}${event.start.length}`,
      });
    }
  });
  disableRightClick();
  changehref();
}

function createEventList(importedData, eventsList) {
  importedData.forEach((event) => {
    let divisionArray = [];
    const startTime = event.start.split('T')[1];
    const endTime = event.end.split('T')[1];
    const url = window.location.origin + event.path;
    // Check for comma in the string
    if (event.divisionname.includes(',')) {
      divisionArray = event.divisionname.split(',');
    } else {
      divisionArray.push(event.divisionname);
    }
    divisionArray.forEach((divisionEle, index) => {
      if (index === 0) {
        // Check for each division and assign the class, color, id to the event
        divisions.forEach((division) => {
          if (normalizeString(division.name) === normalizeString(divisionEle)) {
            event['division-color'] = division.color;
            event['division-textColor'] = division.textColor;
            event.divisionid = division.id;
            if (event.readMore.length > 1) {
              event.classNames = `${normalizeString(division.name)} yesReadMore`;
            } else {
              event.classNames = `${normalizeString(division.name)} noReadMore`;
            }
          }
        });
        const eventObj = new Obj(event.title, event.start, event.end, event.allDay, event.daysOfWeek, startTime, endTime, url, event['division-color'], event['division-textColor'], event.classNames, event.readMore, event.divisionid, event.excludeDates, event.duration, event.freq);
        eventsList.push(eventObj);
      }
    });
  });
  createEvents(eventsList);
  return eventsList;
}

function getInfo(view) {
  deepLinkDay = view.currentStart.getDate();
  deepLinkMonth = view.currentStart.getMonth() + 1;
  deepLinkYear = view.currentStart.getFullYear();
  if (view.type === 'dayGridMonth') {
    deepLinkView = 'month';
  } else if (view.type === 'timeGridWeek') {
    deepLinkView = 'week';
  } else if (view.type === 'timeGridDay') {
    deepLinkView = 'day';
  } else if (view.type === 'listMonth') {
    deepLinkView = 'list';
  }
  if (deepLinkDay < 10) {
    deepLinkDay = `0${deepLinkDay}`;
  }
  if (deepLinkMonth < 10) {
    deepLinkMonth = `0${deepLinkMonth}`;
  }
  const windowHref = window.location.href;
  const url = new URL(windowHref);
  if (url.searchParams.get('view') !== deepLinkView) {
    url.searchParams.set('view', deepLinkView);
    url.searchParams.set('day', deepLinkDay);
    url.searchParams.set('month', deepLinkMonth);
    url.searchParams.set('year', deepLinkYear);
    window.history.pushState({}, '', url);
  } else if (url.searchParams.get('day') !== deepLinkDay) {
    url.searchParams.set('day', deepLinkDay);
    url.searchParams.set('month', deepLinkMonth);
    url.searchParams.set('year', deepLinkYear);
    window.history.pushState({}, '', url);
  } else if (url.searchParams.get('month') !== deepLinkMonth) {
    url.searchParams.set('month', deepLinkMonth);
    url.searchParams.set('year', deepLinkYear);
    window.history.pushState({}, '', url);
  }
}

/* get the view and accordingly target the calendar */
function getView() {
  const isMobileViewport = getViewPort() === 'mobile';
  if (isMobileViewport) {
    return 'listMonth';
  }

  const url = new URL(window.location.href);
  if (url.searchParams.size) {
    const searchParams = new URLSearchParams(url.searchParams);
    const view = searchParams.get('view');
    // Default to calendar month view
    if (view === 'month' || view === null) {
      return 'dayGridMonth';
    }
    return 'listMonth';
  }
  return 'dayGridMonth';
}

const handleEventModal = async (info) => {
  if (info.event.url) {
    const windowHref = window.location.href;
    const url = new URL(windowHref);
    if (URLSearchParams && !url.searchParams.get('id')) {
      url.searchParams.append('id', info.event.id);
      window.history.pushState({}, '', url);
    } else {
      url.searchParams.set('id', info.event.id);
      window.history.pushState({}, '', url);
    }
    try {
      await popupEvent(info.event.url, info.event.extendedProps.readMore);
    } catch (error) {
      console.error('Error displaying event modal:', error);
    }
  }
};

function createCalendar() {
  // eslint-disable-next-line no-undef
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: getView(),
    timeZone: 'local',
    fixedWeekCount: false,
    dayMaxEventRows: mobilecheck() ? 1 : 3,
    height: 'auto',
    views: {
      listMonth: { buttonText: 'List View' },
      dayGridMonth: { buttonText: 'Calendar View' },
    },
    headerToolbar: {
      left: 'dayGridMonth,listMonth',
      center: 'title',
      right: 'prev,next,today',
    },
    dayHeaderFormat: {
      weekday: 'long',
    },
    buttonText: {
      today: 'Today',
    },
    moreLinkClick: 'listDay',
    moreLinkContent: ({ num }) => (`+${num} more events`),
    windowResize: ({ view }) => {
      if (window.innerWidth < 900 && view.type !== 'listMonth') {
        view.calendar.changeView('listMonth');
      }
    },
    eventDisplay: 'block',
    navLinks: false,
    editable: true,
    datesSet: (dateInfo) => {
      getInfo(dateInfo.view);
    },
    eventTimeFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: true },
    eventDidMount: (info) => {
      info.el.setAttribute('id', info.event.id);
    },
    viewDidMount: ({ view }) => {
      if (window.innerWidth < 900 && view.type === 'dayGridMonth') {
        view.calendar.changeView('listMonth');
      }
    },
    eventClick: async (info) => {
      info.jsEvent.preventDefault(); // don't let the browser navigate
      handleEventModal(info);
    },
  });
  /* The Below code is for when the URL is loaded with a specific date */
  const windowHref = window.location.href;
  const url = new URL(windowHref);
  const view = url.searchParams.get('view');
  const day = url.searchParams.get('day');
  const month = url.searchParams.get('month');
  const year = url.searchParams.get('year');
  const ricksDate = new Date(year, month - 1, day);
  if (view === 'month') {
    calendar.changeView('dayGridMonth');
  } else if (view === 'list') {
    calendar.changeView('listMonth');
  }
  calendar.gotoDate(ricksDate);
  const eventID = url.searchParams.get('id');
  /* Get Pop up window of the event automatically if event ID is mentioned in the URL */
  setTimeout(() => {
    if (eventID) {
      const element = document.getElementById(eventID);
      if (element) {
        element.click();
      }
    }
  }, 1);
  calendar.render();
}

async function getFeaturedEvents() {
  const placeholdersfeatured = placeholders.calendarevents;
  const yesArray = placeholdersfeatured.data.filter((item) => item.featured === 'yes');
  calendar.destroy();
  createCalendar();
  const eventsList = [];
  createEventList(yesArray, eventsList);
}

async function initializeCalendar() {
  let importedData = [];
  const eventsList = [];
  calendarEl = document.getElementById('calendar');
  if (placeholders.calendarevents) {
    importedData = placeholders.calendarevents.data;
    createCalendar();
    const checkDivision = window.location.pathname.split('/');
    if (checkDivision[2] && checkDivision[2].length > 0) {
      divisions.forEach((division) => {
        if (normalizeString(division.name) === checkDivision[2]) {
          if (normalizeString(division.name) === 'featured-events') {
            getFeaturedEvents();
          } else if (normalizeString(division.name) === 'county-commissioners') {
            // eslint-disable-next-line max-len
            // filter data as per event.title includes bcc meetings OR event.title includes Planning Commission Meeting or  event.title includes Zoning Commission Meeting and event.daysOfWeek length greater 1
            const filterData = importedData.filter((event) => (
              (normalizeString(event.title).includes('bcc-meeting')
                || normalizeString(event.title).includes('planning-commission-meeting')
                || normalizeString(event.title).includes('zoning-commission-meeting'))
              && event.daysOfWeek.length > 1));
            createEventList(filterData, eventsList);
          } else {
            // eslint-disable-next-line max-len
            const filterData = importedData.filter((event) => normalizeString(event.divisionname).includes(normalizeString(division.name))).map((event) => {
              [event.divisionname] = event.divisionname.split(',');
              return event;
            });
            createEventList(filterData, eventsList);
          }
        }
      });
    } else {
      events = createEventList(importedData, eventsList);
    }
  }
}

export function loadrrtofullcalendar() {
  const scriptrrtofullcalendar = document.createElement('script');
  scriptrrtofullcalendar.setAttribute('type', 'text/javascript');
  scriptrrtofullcalendar.src = 'https://cdn.jsdelivr.net/npm/@fullcalendar/rrule@6.1.15/index.global.min.js';
  scriptrrtofullcalendar.addEventListener('load', initializeCalendar);
  document.head.append(scriptrrtofullcalendar);
}

export function loadmomenttofullcalendar() {
  const scriptrrtofullcalendar = document.createElement('script');
  scriptrrtofullcalendar.setAttribute('type', 'text/javascript');
  scriptrrtofullcalendar.src = 'https://cdn.jsdelivr.net/npm/@fullcalendar/moment-timezone@6.1.15/index.global.min.js';
  scriptrrtofullcalendar.addEventListener('load', loadrrtofullcalendar);
  document.head.append(scriptrrtofullcalendar);
}

export function loadfullcalendar() {
  const scriptfullcalendar = document.createElement('script');
  scriptfullcalendar.setAttribute('type', 'text/javascript');
  scriptfullcalendar.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js';
  scriptfullcalendar.addEventListener('load', loadmomenttofullcalendar);
  document.head.append(scriptfullcalendar);
}

export function loadmomentTZ() {
  const scriptrrule = document.createElement('script');
  scriptrrule.setAttribute('type', 'text/javascript');
  scriptrrule.src = 'https://cdn.jsdelivr.net/npm/moment-timezone@0.5.40/builds/moment-timezone-with-data.min.js';
  scriptrrule.addEventListener('load', loadfullcalendar);
  document.head.append(scriptrrule);
}

export function loadmoment() {
  const scriptrrule = document.createElement('script');
  scriptrrule.setAttribute('type', 'text/javascript');
  scriptrrule.src = 'https://cdn.jsdelivr.net/npm/moment@2.29.4/min/moment.min.js';
  scriptrrule.addEventListener('load', loadmomentTZ);
  document.head.append(scriptrrule);
}

export function loadrrule() {
  const scriptrrule = document.createElement('script');
  scriptrrule.setAttribute('type', 'text/javascript');
  scriptrrule.src = 'https://cdn.jsdelivr.net/npm/rrule@2.6.4/dist/es5/rrule.min.js';
  scriptrrule.addEventListener('load', loadmoment);
  document.head.append(scriptrrule);
}

function filterEvents(divisionId, redirectCalendarName) {
  if (divisionId === '1') {
    window.location.href = `https://${window.location.host}/calendar`;
    return;
  }
  window.location.href = `https://${window.location.host}/calendar/${normalizeString(redirectCalendarName)}/`;
}

function searchItems(searchTerm) {
  const tokenizedSearchWords = searchTerm.split(' ');
  if (tokenizedSearchWords.length > 1) tokenizedSearchWords.unshift(searchTerm);
  return tokenizedSearchWords;
}

function filterMatches(tokenizedSearchWords) {
  const allMatches = [];
  tokenizedSearchWords.forEach((searchTerm) => {
    const matches = events.filter((event) => (
      event.divisionname
        + event.title
        + event.eventdescription
        + event.eventname
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase()));
    allMatches.push(...matches);
  });
  // remove duplicates:
  return [...new Set(allMatches)];
}

function implementSearch(searchDiv) {
  const response = document.getElementById('eventform');
  searchDiv.querySelector('form').addEventListener('submit', async (web) => {
    web.preventDefault();
    const rawdata = response.value;
    const tokenizedSearchWords = searchItems(rawdata);
    const searchResults = filterMatches(tokenizedSearchWords);
    calendar.destroy();
    createCalendar();
    createEvents(searchResults);
  });
}

function changeURL() {
  const windowHref = window.location.href;
  if (!windowHref.includes('?')) {
    const queryParam = `?view=month&day=01&month=${mm}&year=${yyyy}`;
    const newUrl = windowHref + queryParam;
    window.location.replace(newUrl);
  }
}

function getName(divisionId) {
  let divisionName = '';
  divisions.forEach((division) => {
    if (division.id === divisionId) {
      divisionName = division.name;
    }
  });
  return divisionName;
}

const handleSearchInput = (event) => {
  if (event.target.value === '') {
    calendar.destroy();
    initializeCalendar();
  }
};

export default async function decorate(doc) {
  changeURL();
  doc.body.classList.add('calendar');
  const $main = doc.querySelector('main');
  const $searchSection = section({ class: 'fc-search' });
  const $calendarSection = section();

  // For the search section implementation
  const calendarfilters = div({ class: 'fc-calendar-filters' });
  const calendarButton = a();
  const closeButton = button({ class: 'fc-close' });
  const calendarList = ul({ class: 'fc-calendar-list' });
  const normalizeCalendar = 'events';
  placeholders = await fetchPlaceholders(normalizeCalendar);
  divisions = placeholders.divisions.data;
  divisions.forEach((division) => {
    const divisionLi = li({ class: 'fc-calendar-list-item', id: `${division.id}` });
    const divisionButton = a({ class: 'fc-calendar-list-button' });
    divisionButton.textContent = division.name;
    divisionLi.appendChild(divisionButton);
    calendarList.appendChild(divisionLi);
  });
  const searchDiv = div();
  searchDiv.innerHTML = `
    <p class="fc-search-helper-text">Search events by keyword.</p>
    <form class="fc-search-form">
        <input type="search" id="eventform" name="event" placeholder="Search">
        <button type="submit" class="fc-search-btn">
          <img src="/icons/search-white.svg" alt="Calendar search icon button" />
          Search
        </button>
    </form>
    `;
  const bottomDiv = div({ class: 'fc-calendar-search' });
  bottomDiv.appendChild(searchDiv);
  const spinnerDiv = div({ class: 'spinner' }, div({ class: 'circle-spinner' }));
  bottomDiv.appendChild(spinnerDiv);
  calendarfilters.appendChild(calendarButton);
  calendarfilters.appendChild(closeButton);
  calendarfilters.appendChild(calendarList);
  $searchSection.appendChild(calendarfilters);
  $searchSection.appendChild(bottomDiv);
  $main.appendChild($searchSection);
  const calDiv = div({ id: 'calendar' });
  $calendarSection.append(calDiv);
  $main.append($calendarSection);
  document.getElementById('eventform')?.addEventListener('input', handleSearchInput);
  // loadrrule() is loaded after 3 seconds via the delayed.js script for improving page performance
  calendarList.querySelectorAll('.fc-calendar-list-item').forEach((divisionLi, _, parent) => {
    // get path from url
    const path = window.location.pathname.split('/');
    const pathDivision = path[2];
    if (pathDivision && pathDivision.length > 0) {
      if (pathDivision === normalizeString(divisionLi.querySelector('a').innerText)) {
        divisions.forEach((division) => {
          if (divisionLi.id === division.id) {
            divisionLi.classList.add('active');
            divisionLi.style.backgroundColor = division.color;
            divisionLi.querySelector('.fc-calendar-list-button').style.backgroundColor = division.color;
          }
        });
      }
    }
    divisionLi.addEventListener('click', () => {
      parent.forEach((liele) => {
        liele.classList.toggle('active', liele === divisionLi);
        if (liele.classList.contains('active')) {
          const divisionId = liele.id;
          divisions.forEach((division) => {
            if (division.id === divisionId) {
              liele.style.backgroundColor = division.color;
              liele.querySelector('.fc-calendar-list-button').style.backgroundColor = division.color;
              const redirectCalendarName = getName(divisionId);
              if (divisionId === '64') {
                window.location.href = `https://${window.location.host}/calendar/${normalizeString(redirectCalendarName)}/`;
                getFeaturedEvents();
              } else {
                filterEvents(divisionId, redirectCalendarName);
              }
            }
          });
        } else {
          liele.style.backgroundColor = '#fff';
          liele.querySelector('.fc-calendar-list-button').style.backgroundColor = '#fff';
        }
        calendarList.classList.remove('expanded');
        closeButton.classList.remove('expanded');
      });
    });
  });
  calendarButton.textContent = 'Calendars';
  calendarButton.addEventListener('click', () => {
    calendarList.classList.toggle('expanded');
    closeButton.classList.toggle('expanded');
  });
  closeButton.addEventListener('click', () => {
    calendarList.classList.remove('expanded');
    closeButton.classList.remove('expanded');
  });
  implementSearch(searchDiv);
}
