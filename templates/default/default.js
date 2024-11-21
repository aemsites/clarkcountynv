// eslint-disable-next-line no-unused-vars,no-empty-function
import {
  div,
} from '../../scripts/dom-helpers.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $leftsection = document.querySelector('.leftsection');
  const $rightsection = document.querySelector('.rightsection');
  const $mainmenu = div({ class: 'mainmenu' });

  $mainmenu.append($leftsection, $rightsection);
  $main.append($mainmenu);
}
