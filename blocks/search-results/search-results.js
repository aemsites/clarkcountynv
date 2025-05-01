import {
  div,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const gseDiv = div({ class: 'gcse-searchresults-only' });
  block.innerHTML = '';
  block.append(gseDiv);
}
