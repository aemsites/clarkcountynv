// eslint-disable-next-line no-unused-vars,no-empty-function
import {
  div, span,
} from '../../scripts/dom-helpers.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $leftsection = document.querySelector('.leftsection');
  const $clickElement = $leftsection.querySelector('.default-content-wrapper > p');
  const $activeElement = $leftsection.querySelector('.accordion-ml.block');

  $clickElement.addEventListener('click', () => {
    $clickElement.classList.toggle('active');
    $activeElement.classList.toggle('active');
    const height = document.querySelector(':root');
    const originalHeight = height.style.getPropertyValue('--original-height');
    height.style.setProperty('--height', `${originalHeight}`);
    if (!$clickElement.classList.contains('active')) {
      $activeElement.querySelectorAll('details[open]').forEach((detail) => {
        detail.removeAttribute('open');
      });
    }
  });

  const $rightsection = document.querySelector('.rightsection');

  // change all image anchor links to img tag
  $rightsection.querySelectorAll('a[href$=".jpg"], a[href$=".png"], a[href$=".jpeg"]').forEach((aEl) => {
    const picture = createOptimizedPicture(aEl.href, aEl.href.split('/').pop());
    aEl.replaceWith(picture);
  });

  const x = $rightsection.querySelectorAll('.rightsection.special-words p');
  x.forEach((y) => {
    // console.log(y.textContent);
    // console.log(/\[\[[a-zA-Z 0-9]*\]\]/.test(y.textContent));
    const z = y.innerHTML.match(/\[\[[a-zA-Z 0-9]*\]\]/);
    if (z) {
      console.log(z[0]);
      // remove the first and last character of the string
      const str = z[0].slice(2, -2);
      console.log(str);
      y.innerHTML = y.innerHTML.replace(/\[\[[a-zA-Z 0-9]*\]\]/, `<span class="special"> ${str} </span>`);
    }
  });

  const $mainmenu = div({ class: 'mainmenu' }, $leftsection, $rightsection);
  $main.append($mainmenu);
}
