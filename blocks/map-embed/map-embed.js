import { iframe, p } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // if map-embed is just a raw google maps embed link
    const mapEmbedEl = row.querySelector('a');
    if (mapEmbedEl) {
      const mapLink = mapEmbedEl.href;
      const $iframe = iframe(
        {
          src: mapLink,
          allowFullscreen: true,
          frameBorder: 0,
          class: 'map-embed',
        },
      );
      row.replaceWith($iframe);
      if (mapEmbedEl.textContent.trim() !== mapLink) {
        $iframe.parentElement.appendChild((p({ class: 'map-title' }, mapEmbedEl.textContent.trim())));
      }
    } else {
      // if map-embed is a full <iframe> element. it is read as a <p> first so we have
      // to escape it and reconvert it back to an <iframe>, from there we can just call
      // normal helper functions on it to get the src link among other things.
      const paragraph = row.querySelector('p');

      const text = paragraph.textContent.trim();
      const temp = document.createElement('div');
      temp.innerHTML = text;

      const convertedIframe = temp.querySelector('iframe');

      if (convertedIframe) {
        const $iframe = iframe({
          src: convertedIframe.src,
          allowFullscreen: true,
          frameBorder: 0,
          class: 'map-embed',
        });

        row.replaceWith($iframe);
      }
    }
  });
}
