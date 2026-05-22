// TODO: - Fix case where there is nothing placed in the banner... its still showing a small patch
//         yellow at the top and the card isnt the same height as everything else
//       - Add the 3rd mockup card as well (use the 6th column to make custom styles or something)
//       - Also make sure that normal pictures work too, we are currently using ":potholes:" etc

import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  ul, li, a, div,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  /* change to ul, li */
  const $ul = ul();
  [...block.children].forEach((row) => {
    const banner = row.children[0];
    const iconImg = row.children[1];
    const cardTitle = row.children[2];
    const cardDesc = row.children[3];
    const cardButton = row.children.length && row.children[4] && row.children[4].querySelector('a');

    const { href, title } = cardButton ?? {};

    $ul.append(
      li(
        div(
          { class: 'flagged-cards' },

          // Banner
          banner
            ? div({ class: 'flagged-cards-banner' }, banner)
            : null,

          // Main content
          div(
            { class: 'flagged-cards-content' },

            iconImg ? div({ class: 'flagged-cards-img' }, iconImg) : null,

            cardTitle ? div({ class: 'flagged-cards-title' }, cardTitle) : null,

            cardDesc ? div({ class: 'flagged-cards-description' }, cardDesc) : null,

            // Button
            cardButton
              ? a(
                { class: 'flagged-cards-button', href, title },
                cardButton,
              )
              : null,
          ),
        ),
      ),
    );
  });
  $ul.querySelectorAll('picture > img').forEach((imgEl) => imgEl.closest('picture').replaceWith(createOptimizedPicture(imgEl.src, imgEl.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append($ul);
}
