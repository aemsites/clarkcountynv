// add delayed functionality here
import { loadScript, sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const isDesktop = window.matchMedia('(min-width: 900px)');

function googleTranslate() {
  const s1 = document.createElement('script');
  s1.setAttribute('src', 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
  (document.body || document.head).appendChild(s1);
  const s2 = document.createElement('script');
  s2.text = `
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    }
  `;
  (document.body || document.head).appendChild(s2);
}

googleTranslate();

// async function fc1() {
//   const s1 = document.createElement('script');
//   s1.setAttribute('src', 'https://cdn.jsdelivr.net/npm/fullcalendar@5.1.0/main.min.js');
//   (document.body || document.head).appendChild(s1);
// }

// await fc1();

// async function fc1() {
//   await loadScript('https://cdn.jsdelivr.net/npm/fullcalendar/index.global.min.js');
// }

// await fc1();

// async function fc2() {
//   const s2 = document.createElement('script');
//   s2.text = `
//     document.addEventListener('DOMContentLoaded', function() {
//         const calendarEl = document.getElementById('calendar')
//         const calendar = new FullCalendar.Calendar(calendarEl, {
//           initialView: 'dayGridMonth'
//         })
//         calendar.render()
//       })
//   `;
//   (document.body || document.head).appendChild(s2);
// }

// await fc2();

async function loadWidget() {
  await loadScript('/widgets/accessibility/accessibility.js');
}

async function loadShareWidget() {
  await loadScript('/widgets/share-button/share-button.js');
}

if (isDesktop.matches) {
  loadWidget();
  loadShareWidget();
}

function resizeAction() {
  if (!isDesktop.matches) {
    const div = document.querySelector('.userway_buttons_wrapper .uai.userway_dark');
    if (div) div.style.setProperty('display', 'none');
  } else {
    const div = document.querySelector('.userway_buttons_wrapper .uai.userway_dark');
    if (div) {
      div.style.setProperty('display', 'block');
    } else {
      loadWidget();
    }
  }
}

window.addEventListener('resize', resizeAction);
