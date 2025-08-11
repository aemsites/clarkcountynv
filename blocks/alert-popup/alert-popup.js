import { createModal } from '../modal/modal.js';
import { button, img, div } from '../../scripts/dom-helpers.js';

// Closes Full Width Popup
const handleClose = (e) => {
  const currPopup = e.target.closest('.alert-popup.popup.full-width');
  if (currPopup) {
    currPopup.classList.add('hide');
  }
};

export default async function decorate(block) {
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
