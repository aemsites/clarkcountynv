// add delayed functionality here
import { loadScript, loadCSS, sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const isDesktop = window.matchMedia('(min-width: 900px)');

function applyMaxWidthToIframe(counter) {
  const iframe = document.querySelector('iframe');
  if (iframe) {
    iframe.style.setProperty('max-width', '350px', 'important');
    iframe.contentDocument.body.style.setProperty('--mainColorRgbValues', '#0094c3', 'important');
    iframe.addEventListener('load', () => {
      console.log(iframe);
    });
  } else if (counter < 100) {
    setTimeout(() => applyMaxWidthToIframe(counter + 1), 200);
  }
}

function applyBackground(counter) {
    const div = document.querySelector('.userway_buttons_wrapper .uai.userway_dark');
    if (div) {
      div.style.setProperty('background', 'rgb(0, 148, 195)', 'important');
      const widget = document.querySelector('body > div.uwy.userway_p1.utb > div');
      widget.style.opacity = '1';
    } else if (counter < 5000) {
      setTimeout(() => applyBackground(counter + 1), 5);
    }
  }

async function loadWidget() {
  await loadCSS('/widgets/accessibility/accessibility.css');
  await loadScript('/widgets/accessibility/accessibility.js').then(() => {
    applyBackground(0);
    applyMaxWidthToIframe(0);
  });
}

if (isDesktop.matches) {
  loadWidget();
}


function resizeAction() {
    if (!isDesktop.matches) {
      const div = document.querySelector('.userway_buttons_wrapper .uai.userway_dark');
      div.style.setProperty('display', 'none');
    } else {
      const div = document.querySelector('.userway_buttons_wrapper .uai.userway_dark');
      div.style.setProperty('display', 'block');
    }
}

window.addEventListener('resize', resizeAction);
