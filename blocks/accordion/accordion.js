/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { Accordion } from '../accordion-ml/accordion-ml.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'content';
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);

    const aElems = block.querySelectorAll('.content a');
    aElems.forEach((aElem) => {
      const text = aElem.textContent;
      if (text && (text.search('jpeg') !== -1 || text.search('jpg') !== -1 || text.search('png') !== -1 || text.search('gif') !== -1 || text.search('jpg') !== -1)) {
        aElem.textContent = '';
        aElem.append(createOptimizedPicture(text));
      } else {
        aElem.classList.remove('button');
      }
      aElem.setAttribute('target', '_blank');
    });
  });

  /* eslint-disable no-new */
  block.querySelectorAll('details').forEach((el) => {
    new Accordion(el);
  });
}
