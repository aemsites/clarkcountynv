// add delayed functionality here
import { loadScript, loadCSS, sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

function applyMaxWidthToIframe(counter) {
    const iframe = document.querySelector('iframe');
    if (iframe) {
        // iframe.addEventListener('load', () => {
        //     console.log(iframe);
        //     iframe.style.setProperty('max-width', '350px', 'important');
        //     iframe.contentDocument.body.style.setProperty('--mainColorRgbValues', '#0094c3', 'important');
        // });
      iframe.style.setProperty('max-width', '350px', 'important');
      iframe.contentDocument.body.style.setProperty('--mainColorRgbValues', '#0094c3', 'important');
    } else if (counter < 100) {
      setTimeout(() => applyMaxWidthToIframe(counter + 1), 200);
    }
  }

function applyBackground(counter) {
    const div = document.querySelector('.userway_buttons_wrapper .uai.userway_dark');
    if (div) {
      div.style.setProperty('background', 'rgb(0, 148, 195)', 'important');
      const widget = document.querySelector('body > div.uwy.userway_p1.utb > div');
    //   document.documentElement.style.setProperty('--mainColorRgbValues', '#0094c3', 'important');
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

loadWidget();