import { hr } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
    const separator = hr({ class: 'separator', 'aria-label': 'Section separator' });
    block.append(separator);
}