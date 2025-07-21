/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { Accordion } from '../accordion-ml/accordion-ml.js';
import {
  button, details, div, img, input, p, span, summary, ul, h4,
} from '../../scripts/dom-helpers.js';
import { createHashId, scrollWithHeaderOffset } from '../../scripts/utils.js';

let oldSearch = '';

function slideDown(element, duration = 400) {
  element.style.display = 'block';
  element.style.height = '0';
  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease-in-out`;
  element.style.height = `${element.scrollHeight}px`;

  setTimeout(() => {
    element.style.height = '';
    element.style.overflow = '';
    element.style.transition = '';
  }, duration);
}

function slideUp(element, duration = 400) {
  element.style.height = `${element.scrollHeight}px`;
  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease-in-out`;

  setTimeout(() => {
    element.style.height = '0';
  }, 10);

  setTimeout(() => {
    element.style.display = 'none';
    element.style.height = '';
    element.style.overflow = '';
    element.style.transition = '';
  }, duration);
}

function searchDocuments(searchValue) {
  oldSearch = searchValue;
  let fileText = '';
  const results = [];

  const files = document.querySelectorAll('.documents-wrap .content .file-item, .documents-wrap .content-inner .file-item');
  files.forEach((file) => {
    const aEl = file.querySelector('a');
    if (aEl) {
      fileText = aEl.textContent.toUpperCase();
      if (fileText.indexOf(searchValue) >= 0) {
        results.push(file.closest('li'));
        return;
      }
    }
    const spanEl = file.querySelector('span');
    if (spanEl) {
      fileText = spanEl.textContent.toUpperCase();
      if (fileText.indexOf(searchValue) >= 0) {
        results.push(file.closest('li'));
      }
    }
  });

  const searchResults = document.querySelector('.doc-search-results');
  searchResults.innerHTML = '';

  if (results.length === 0) {
    searchResults.append(span({ class: 'search-not-found' }, `No results found for: ${searchValue}`));
  } else {
    const ulEl = ul({ class: 'search-result-files' });
    results.forEach((result) => {
      ulEl.append(result.cloneNode(true));
    });
    searchResults.append(ulEl);
  }

  slideDown(searchResults);
  slideUp(document.querySelector('.documents-wrap'));
}

function searchFile() {
  const searchValue = document.querySelector('.doc-search-input').value.trim().toUpperCase();

  if (searchValue.length > 0 && searchValue !== oldSearch) {
    searchDocuments(searchValue.toUpperCase());
  }
}

const handleSearchInputClear = (event) => {
  if (event.target.value === '') {
    const block = event.target.closest('.document-center.block');
    if (block) {
      const searchResults = block.querySelector('.doc-search-results');
      const documentsWrap = block.querySelector('.documents-wrap');
      if (searchResults.style.display !== '' && searchResults.style.display !== 'none') {
        slideUp(searchResults);
        slideDown(documentsWrap);
      }
    }
  }
};

function createFileSearchForm(block) {
  const searchInput = input({
    class: 'doc-search-input', type: 'search', name: 'document-center-input', placeholder: 'Search', onkeypress: (e) => { if (e.key === 'Enter') searchFile(); },
  });
  searchInput.addEventListener('input', handleSearchInputClear);
  const searchButton = button({
    class: 'button primary doc-search-button',
    id: 'search-btn',
    type: 'button',
    onclick: () => searchFile(),
  }, 'Search');
  const searchIcon = img({ src: '/icons/search-white.svg', alt: 'Search results icon' });
  searchButton.prepend(searchIcon);

  const searchForm = div(
    { class: 'doc-search-form' },
    searchInput,
    searchButton,
  );

  block.insertBefore(searchForm, block.firstChild);
}

function customizeFileLinks(fileLinks) {
  fileLinks.forEach((fileLink) => {
    const fullFileTitle = fileLink.textContent.trim();
    const fileTypeClass = fileLink.href.split('.').pop().endsWith('pdf') ? 'fa-file-pdf-o' : 'fa-file-text-o';
    fileLink.classList.add(fileTypeClass);
    let fileDescription;
    if (fullFileTitle.search('\\[description=') !== -1) {
      fileDescription = fullFileTitle.split('[description=')[1].slice(0, -1);
      const [fileName] = fullFileTitle.split('[description=');
      fileLink.textContent = fileName;
    }
    fileLink.replaceWith(div({ class: 'file-item' }, fileLink.cloneNode(true), span({ class: 'doc-file-desc' }, fileDescription)));
  });
}

export default function decorate(block) {
  const searchResults = div({ class: 'doc-search-results' });
  const container = div({ class: 'documents-wrap' });
  [...block.children].forEach((row) => {
    const fileGroup = row.children[0];
    const [fileGroupTitle, fileGroupDescription] = fileGroup.children;
    const contentContainer = div({ class: 'content' });
    let body = row.children[1];
    body.className = 'content';
    if (fileGroupDescription) {
      const descriptionEl = div({ class: 'doc-group-description' }, fileGroupDescription.textContent.trim());
      body.prepend(descriptionEl);
      contentContainer.prepend(descriptionEl);
    }

    const documents = row.children[1].cloneNode(true);
    const documentsList = documents.children[0];
    const singleLevelList = ul(); // Create a single ul for all single-level items

    if (documentsList) {
      [...documentsList.children].forEach((listItem) => {
        // Check if item is an empty heading (text without link and no children)
        const isEmptyHeading = !listItem.querySelector('a') && !listItem.querySelector('ul') && listItem.textContent.trim();
        const hasNestedList = listItem.querySelector('ul');

        if (hasNestedList || isEmptyHeading) {
          // If we have accumulated any single-level items, add them to container
          if (singleLevelList.children.length > 0) {
            contentContainer.append(singleLevelList.cloneNode(true));
            singleLevelList.innerHTML = ''; // Clear the list for next group
          }

          // Handle multi-level item or empty heading
          const sectionTitle = listItem.firstChild.textContent.trim();
          if (!sectionTitle) return;

          const nestedList = listItem.querySelector('ul');
          const fileLinks = nestedList ? nestedList.querySelectorAll('a') : [];
          const numOfDocs = fileLinks.length;

          const sectionSummary = summary(
            { class: 'accordion-item-label-inner' },
            h4({ class: 'summary-title' }, sectionTitle),
            p({ class: 'doc-center-counter-inner' }, `${numOfDocs} documents`),
          );

          if (nestedList) {
            customizeFileLinks(fileLinks);
          }

          const subId = createHashId(sectionTitle);
          const subDetailsEl = details(
            { class: 'accordion-item-inner', id: subId },
            sectionSummary,
            nestedList ? div({ class: 'content' }, nestedList) : div({ class: 'content' }), // Empty content div for empty headings
          );
          contentContainer.append(subDetailsEl);
        } else {
          // Handle single-level item
          const fileLinks = listItem.querySelectorAll('a');
          customizeFileLinks(fileLinks);
          singleLevelList.append(listItem);
        }
      });
    }

    // Add any remaining single-level items
    if (singleLevelList.children.length > 0) {
      contentContainer.append(singleLevelList);
    }

    body = contentContainer;

    fileGroupTitle.classList.add('summary-title');
    const titleText = fileGroupTitle.textContent.trim();
    const id = createHashId(titleText);
    const mainSummaryEl = summary(
      { class: 'accordion-item-label' },
      fileGroupTitle,
      p(
        { class: 'doc-center-counter' },
        `${body.querySelectorAll('.file-item').length} Documents`,
      ),
    );

    const detailsEl = details(
      {
        class: 'accordion-item',
        id,
      },
      mainSummaryEl,
      contentContainer,
    );

    // Add toggle event listener for hash updates
    detailsEl.addEventListener('toggle', () => {
      if (detailsEl.hasAttribute('open')) {
        window.history.pushState(null, '', `#${id}`);
      } else {
        window.history.pushState(null, '', window.location.pathname);
      }
    });

    // Check if this main accordion should be open based on hash
    if (window.location.hash === `#${id}`) {
      detailsEl.setAttribute('open', '');
      setTimeout(() => {
        scrollWithHeaderOffset(detailsEl);
      }, 100);
    }
    container.append(detailsEl);
    row.remove();
  });

  block.append(searchResults);
  block.append(container);
  createFileSearchForm(block);

  /* eslint-disable no-new */
  block.querySelectorAll('details').forEach((el) => {
    new Accordion(el);

    window.addEventListener('hashchange', () => {
      const targetId = window.location.hash.substring(1);
      if (el.id === targetId) {
        el.setAttribute('open', '');
        scrollWithHeaderOffset(el);
      } else {
        el.removeAttribute('open');
      }
    });
  });
}
