import {
  div, h4, p, a,
  img,
} from '../../scripts/dom-helpers.js';
import {
  createOptimizedPicture, buildBlock, decorateBlock, loadBlock,
  fetchPlaceholders as defaultFetchPlaceholders,
} from '../../scripts/aem.js';
import { normalizeString } from '../../scripts/utils.js';
import { popupEvent } from '../../templates/calendar/calendar.js';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
let divisions = [];
const defaultplaceholders = await defaultFetchPlaceholders();
const CLARKLOGO = defaultplaceholders.clarkcountylogo;
// Result parsers parse the query results into a format that can be used by the block builder for
// the specific block types
const resultParsers = {
  // Parse results into a cards block
  columns: (results) => {
    const blockContents = [];
    let sourceDate = '';
    results.forEach((result) => {
      const row = [];
      const divLeft = div({ class: 'event-image' });
      if (result.image.length > 1) {
        const columnImage = createOptimizedPicture(result.image);
        divLeft.appendChild(columnImage);
      } else {
        const columnImage = createOptimizedPicture(CLARKLOGO);
        divLeft.appendChild(columnImage);
      }
      const divRight = div({ class: 'event-body' });
      if (result.start.length === 0) {
        sourceDate = result.startRecur;
      } else {
        sourceDate = result.start;
      }
      const eventMonth = sourceDate.split('T')[0].split('-')[1] - 1;
      const eventMonthName = months[parseInt(eventMonth, 10)];
      const eventYear = sourceDate.split('T')[0].split('-')[0];
      const eventDate = sourceDate.split('T')[0].split('-')[2];
      const fullDate = `${eventMonthName} ${eventDate}, ${eventYear}`;
      const dateDiv = div({ class: 'date' }, fullDate);
      const divTitle = div({ class: 'title' }, h4(result.title));
      const dateIcon = img({ src: '/icons/calendar-icon-grey.svg', alt: `${divTitle.textContent} icon` });
      dateDiv.prepend(dateIcon);
      const divDescription = p({ class: 'description' }, result.eventdescription);
      // Regular expression to match URLs
      const urlRegex = /(https?:\/\/main[^\s]+)/g;
      // Remove URLs from the textContent
      divDescription.textContent = divDescription.textContent.replace(urlRegex, '').trim();
      const divPath = div({ class: 'path' }, result.path);
      divRight.appendChild(dateDiv);
      divRight.appendChild(divTitle);
      divRight.appendChild(divDescription);
      divRight.appendChild(divPath);
      const columnBody = div({ class: 'event' });
      columnBody.addEventListener('click', () => {
        const url = window.location.origin + result.path;
        divisions.forEach((division) => {
          if (normalizeString(division.name) === normalizeString(result.divisionname)) {
            result['division-color'] = division.color;
          }
        });
        const data = { _def: { title: result.title } };
        popupEvent(url, result.readMore, data);
      });
      columnBody.appendChild(divLeft);
      columnBody.appendChild(divRight);
      row.push(columnBody);
      blockContents.push(row);
    });
    return blockContents;
  },
};

// Fetching events from individual calendar sheets
export async function fetchPlaceholders() {
  window.placeholders = window.placeholders || {};
  const KEY = 'events';
  const loaded = window.placeholders[`${KEY}-loaded`];

  if (!loaded) {
    window.placeholders[`${KEY}-loaded`] = new Promise((resolve) => {
      fetch(`/calendar/${KEY}.json?sheet=default&sheet=divisions`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return {};
        })
        .then((json) => {
          window.placeholders.calendarevents = json.default;
          window.placeholders.divisions = json.divisions;
          resolve(window.placeholders[KEY]);
        })
        .catch(() => {
          // error loading placeholders
          window.placeholders[KEY] = {};
          resolve(window.placeholders[KEY]);
        });
    });
  }
  await window.placeholders[`${KEY}-loaded`];
  return window.placeholders;
}

function priorDate(date) {
  const today = new Date();
  const eventDate = new Date(date);
  return eventDate < today;
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const yesArray = placeholders.calendarevents.data.filter((item) => item.featured === 'yes' && !priorDate(item.start));
  // Sort via dates
  yesArray.sort((x, y) => new Date(x.start) - new Date(y.start));
  divisions = placeholders.divisions.data;
  const blockContents = resultParsers.columns(yesArray.slice(0, 4));
  const builtBlock = buildBlock('columns', blockContents);
  block.appendChild(builtBlock);
  const seeMoreButton = div(
    { class: 'see-more' },
    a(
      { href: '/calendar', class: 'button', target: '_self' },
      'See More Calendar Events',
    ),
  );
  block.appendChild(seeMoreButton);
  decorateBlock(builtBlock);
  await loadBlock(builtBlock);
}
