// eslint-disable-next-line no-unused-vars,no-empty-function
import {
  section, div,
} from '../../scripts/dom-helpers.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $leftsection = document.querySelector('.leftsection');
  const $clickElement = $leftsection.querySelector('.default-content-wrapper > p');
  const $activeElement = $leftsection.querySelector('.accordion-ml.block');

  $clickElement.addEventListener('click', () => {
    $clickElement.classList.toggle('active');
    $activeElement.classList.toggle('active');
  });

  const $rightsection = document.querySelector('.rightsection');
  const $mainmenu = div({ class: 'mainmenu' });

  $mainmenu.append($leftsection, $rightsection);
  $main.append($mainmenu);
}
