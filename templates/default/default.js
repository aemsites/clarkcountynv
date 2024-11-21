// eslint-disable-next-line no-unused-vars,no-empty-function
import {
  section, div,
} from '../../scripts/dom-helpers.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $mainChildren = Array.from($main.childNodes);
  const $section = section();
  const $leftsection = document.querySelector('.leftsection');
  const $rightsection = document.querySelector('.rightsection');
  const $mainmenu = section({ class: 'mainmenu' });

  $mainChildren.forEach((child) => {
    $section.appendChild(child);
  });

  $main.innerHTML = '';
  $mainmenu.append($leftsection, $rightsection);
  console.log($mainmenu);
  $main.append($section, $mainmenu);
}
