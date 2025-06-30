/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */
import {
  div, button, img, waitForElement,
} from '../../scripts/dom-helpers.js';

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

function getMaxColumns(block) {
  let maxColumns = 0;

  // Iterate through each row in the block
  [...block.children].forEach((row) => {
    // Get number of children (columns) in this row
    const columnCount = [...row.children].length;
    // Update maxColumns if this row has more columns
    maxColumns = Math.max(maxColumns, columnCount);
  });

  return maxColumns;
}

function getScrollAmount(table) {
  const tableWidth = table.offsetWidth;
  const columns = table.querySelectorAll('th').length;
  const avgColumnWidth = tableWidth / columns;
  return Math.max(avgColumnWidth, 100);
}

function updateButtonStates(tableContainer, scrollLeftBtn, scrollRightBtn) {
  const scrollLeft = tableContainer.scrollLeft;
  const maxScroll = tableContainer.scrollWidth - tableContainer.clientWidth;  
  scrollLeftBtn.disabled = scrollLeft <= 0;
  scrollRightBtn.disabled = scrollLeft >= maxScroll;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) table.append(thead);
  table.append(tbody);

  const maxColumns = getMaxColumns(block);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);

    const childColumns = [...child.children];

    // Add colspan if row has only one child and maxColumns is 2
    if (maxColumns === 2 && childColumns.length === 1) {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = childColumns[0].innerHTML;
      cell.setAttribute('colspan', '2');
      row.append(cell);

    // Condition for blue-header-bordered table variant
    } else if (childColumns.length === 1
      && block.classList.contains('mixed-columns')) {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = childColumns[0].innerHTML;
      cell.setAttribute('colspan', maxColumns);
      row.append(cell);
    } else {
      // Normal case - add each column
      childColumns.forEach((col) => {
        const cell = buildCell(header ? i : i + 1);
        cell.innerHTML = col.innerHTML;
        row.append(cell);
      });
    }
  });

  // Add a fix for extra space added after underline when a part of the word.
  // Same logic can be used in other blocks when required
  table.querySelectorAll('u').forEach((el) => {
    const next = el.nextSibling;
    if (next && next.nodeName === '#text') {
      next.textContent = next.textContent.replace(/^ +/, '');
    }
  });

  const tableContainer = div({ class: 'table-wrapper' });
  const tableNav = div({ class: 'table-controls' });
  const scrollLeftBtn = button({ class: 'button primary', type: 'button' });
  const scrollRightBtn = button({ class: 'button primary', type: 'button' });
  const scrollLeftBtnImg = img({ src: '/icons/arrow-left-white.svg', alt: 'Scroll left arrow icon' });
  const scrollRightBtnImg = img({ src: '/icons/arrow-right-white.svg', alt: 'Scroll right arrow icon' });
  scrollLeftBtn.append(scrollLeftBtnImg);
  scrollRightBtn.append(scrollRightBtnImg);
  tableNav.append(scrollLeftBtn, scrollRightBtn);

  tableContainer.addEventListener('scroll', () => updateButtonStates(tableContainer, scrollLeftBtn, scrollRightBtn));

  scrollLeftBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount(table);
    tableContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
  });

  scrollRightBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount(table);
    tableContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
  });

  updateButtonStates(tableContainer, scrollLeftBtn, scrollRightBtn);

  tableContainer.append(table);

  block.innerHTML = '';
  block.append(tableContainer);
  block.append(tableNav);

  setTimeout(() => {
    updateButtonStates(tableContainer, scrollLeftBtn, scrollRightBtn);
  }, 100);
}
