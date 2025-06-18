import { createModal } from '../modal/modal.js';

export default async function decorate(block) {
  const type = block.classList.contains('popup') ? 'popup' : 'banner';
  if (type === 'popup') {
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
    const spanIcon = block.querySelector('span.icon');
    if (spanIcon) {
      spanIcon.setAttribute('role', 'img');
      spanIcon.setAttribute('aria-label', `Alert ${type} icon`);
    }
  }
}
