import { createModal } from '../modal/modal.js';

export default async function decorate(block) {
  const childNodes = block.children[0]?.childNodes;
  if (childNodes.length) {
    const filteredNodes = Array.from(childNodes).filter((node) => node.nodeName === 'DIV');
    const { showModal, block: modal } = await createModal(filteredNodes);
    modal.className += ' alert-popup popup';
    showModal();
  }
}
