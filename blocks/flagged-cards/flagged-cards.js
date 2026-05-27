// TODO: - Ask about how we should handle images... actual images are taller/wider
//         than the icons, so the cards/image content becomes larger

import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  ul, li, a, div,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  /* change to ul, li */
  const $ul = ul();
  [...block.children].forEach((row) => {
    const banner = row.children[0];
    const hasBannerContent = banner && banner.textContent.trim();
    const iconImg = row.children[1];
    const cardTitle = row.children[2];
    const cardDesc = row.children[3];
    const cardButton = row.children.length && row.children[4] && row.children[4].querySelector('a');
    const altStyle = row.children[5];
    const hasAltStyle = altStyle && altStyle.textContent.trim();

    const { href, title } = cardButton ?? {};

    $ul.append(
      li(
        div(
          {
            class: hasAltStyle === 'alt'
              ? 'flagged-cards-alt'
              : 'flagged-cards',
          },

          // Banner
          div(
            {
              class: `
      ${hasAltStyle === 'alt'
    ? 'flagged-cards-banner-alt'
    : 'flagged-cards-banner'}
      ${hasBannerContent ? '' : 'empty-banner'}
    `,
            },

            // eslint-disable-next-line no-nested-ternary
            hasBannerContent
              ? (
                hasAltStyle === 'alt'
                  ? div(
                    { class: 'flagged-cards-banner-alt-inner' },
                    banner,
                  )
                  : banner
              )
              : '',
          ),

          // Main content
          div(
            {
              class: hasAltStyle === 'alt'
                ? 'flagged-cards-content-alt'
                : 'flagged-cards-content',
            },

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
