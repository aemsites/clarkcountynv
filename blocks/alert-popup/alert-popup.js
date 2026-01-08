// TODO: Isolate the auto-closing logic to only the full-width popup (It is currently set to close
//       any type of alert popup... for instance, right now it also includes the modal)
//       Also remove any un-needed console logs and old code

// INFO: sessionStorage persists only within the same tab. If you make a new tab, that tab has its
//       own separate sessionStorage and will thus not have its sessionStorage cookie set. This
//       will result in the fact that if you close the alert and set the cookie, it will not
//       reappear on subsequent pages within the same tab. However if you open a new tab and go to
//       the pages, the alerts will show back up, because the new tab does not have the
//       sessionStorage cookie set yet.
//
//       This obviously also applies to completely new browser sessions (closing google chrome
//       completely and then reopening it)
//
//       Also of note is that if you "Duplicate" the tab (by right clicking the tab, and choosing
//       the Duplicate option), this will copy the sessionStorage of the copied tab over to the new
//       one. Keep this in mind if any questions get asked about it.

// WARN: Remember to lint the file before pushing!!!
//       "npx eslint ./blocks/alert-popup/alert-popup.js"

import { createModal } from '../modal/modal.js';
import { button, img, div } from '../../scripts/dom-helpers.js';

// Closes Full Width Popup
const handleClose = (e) => {
  const currPopup = e.target.closest('.alert-popup.popup.full-width');
  if (currPopup) {
    currPopup.classList.add('hide');
  }

  // set sessionStorage cookie when user closes a full-width popup
  sessionStorage.setItem('closed', 'true');
  console.log('full-width popup has been closed + sessionStorage set');

  setTimeout(() => {
    // get next popup and focus close button
    const nextPopup = document.querySelector('.alert-popup.popup.full-width:not(.hide)');
    if (nextPopup) {
      nextPopup.querySelector('.close-button')?.focus();
    }
  }, 250);
};

export default async function decorate(block) {
  if (sessionStorage.getItem('closed') === 'true') {
    console.log('sessionStorage cookie is set to true');
    block.innerHTML = '';
  } else {
    console.log('sessionStorage cookie not set...');

    const type = block.classList.contains('popup') ? 'popup' : 'banner';
    if (type === 'popup') {
      if (!block.classList.contains('full-width')) {
        const childNodes = block.children[0]?.childNodes;
        if (childNodes.length) {
          const filteredNodes = Array.from(childNodes).filter((node) => node.nodeName === 'DIV');
          if (filteredNodes.length) {
            const { showModal, block: modal } = await createModal(filteredNodes);
            modal.className += ' alert-popup popup';
            const modalContent = modal.querySelector('.modal-content');
            const icon = modalContent?.querySelector('span.icon');
            if (icon) {
              icon.setAttribute('role', 'img');
              icon.setAttribute('aria-label', `Alert ${type} icon`);
            }
            showModal();
          }
        }
      } else {
        const closeBtnColor = (block.classList.contains('high') || block.classList.contains('low')) ? 'black' : 'white';
        const closeBtn = button(
          { class: 'close-button', type: 'button', onclick: (e) => handleClose(e) },
          img(
            { src: `/icons/close-icon-${closeBtnColor}.svg`, alt: 'Close alert popup' },
          ),
        );
        const closeBtnContainer = div(closeBtn);
        block.querySelector(':scope > div')?.append(closeBtnContainer);
      }
    } else {
      const spanIcon = block.querySelector('span.icon');
      if (spanIcon) {
        spanIcon.setAttribute('role', 'img');
        spanIcon.setAttribute('aria-label', `Alert ${type} icon`);
      }
    }
  }
}
