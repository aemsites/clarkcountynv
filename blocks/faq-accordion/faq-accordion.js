import {
  div, input, button, img, p,
} from '../../scripts/dom-helpers.js';
import { createHashId, scrollWithHeaderOffset } from '../../scripts/utils.js';
import { loadCSS } from '../../scripts/aem.js';

// This will get the ID from the details HTML element and add as a hash to the url
function handleToggleHash(event) {
  if (event.target.hasAttribute('open')) {
    window.history.pushState(null, '', `#${event.target.id}`);
  } else {
    window.history.pushState(null, '', window.location.pathname);
  }
}

export default function decorate(block) {
  const sections = {};
  let currentSection = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    // Check if this is a section header (single cell)
    if (cells.length === 1) {
      // Create new section
      currentSection = {
        title: cells[0].textContent.trim(),
        id: createHashId(cells[0].textContent.trim()),
        items: [],
      };
      sections[currentSection.title] = currentSection;
    } else if (cells.length === 2 && currentSection) {
      // If we have 2 cells, it's a Q&A pair
      const questionText = cells[0].textContent.trim();
      const questionItem = {
        question: questionText,
        id: `${currentSection.id}-${createHashId(questionText)}`,
        answer: cells[1],
      };
      currentSection.items.push(questionItem);
    }
  });

  block.textContent = '';

  // Build search container
  const searchContainer = div({ class: 'search-container' });
  const searchBox = input({
    type: 'search',
    class: 'search-box',
    placeholder: 'Search',
    name: 'search-results',
  });
  const searchInputBtnContainer = div({ class: 'search-input-btn-container' });
  const searchResults = div({ class: 'search-results' });
  const searchBtn = button({ class: 'button primary', id: 'search-btn', type: 'button' }, 'Search');
  const searchIcon = img({ src: '/icons/search-white.svg', alt: 'Search results icon' });
  searchInputBtnContainer.append(searchBox);
  searchBtn.prepend(searchIcon);
  searchInputBtnContainer.append(searchBtn);
  searchContainer.append(searchInputBtnContainer, searchResults);
  block.appendChild(searchContainer);

  // Filter results based on user query
  const performSearch = () => {
    const searchTerm = searchBox.value.toLowerCase();
    let matchCount = 0;

    Object.values(sections).forEach((section) => {
      const sectionContent = block.querySelector(`[data-section="${section.title}"]`);
      if (!sectionContent) return;

      section.items.forEach((item, index) => {
        const questionEl = sectionContent.querySelector(`summary[data-index="${index}"]`);
        const answerEl = questionEl?.nextElementSibling;
        if (!questionEl || !answerEl) return;

        const questionText = item.question.toLowerCase();
        const answerText = item.answer.textContent.toLowerCase();
        const isMatch = questionText.includes(searchTerm) || answerText.includes(searchTerm);

        questionEl.parentElement.style.display = searchTerm && !isMatch ? 'none' : '';

        if (isMatch && searchTerm) {
          matchCount += 1;
        }
      });

      const hasVisibleQuestions = [...sectionContent.querySelectorAll('details')]
        .some((q) => q.style.display !== 'none');
      sectionContent.style.display = hasVisibleQuestions ? '' : 'none';
    });

    // Update search results count
    if (searchTerm) {
      searchResults.textContent = `${matchCount} item${matchCount !== 1 ? 's' : ''} found. Please see below for details.`;
    } else {
      searchResults.textContent = '';
    }
  };

  // Click event listener for search button
  searchBtn.addEventListener('click', performSearch);

  // Event listener on search input
  searchBox.addEventListener('input', (event) => {
    // If the user presses the 'X' clear button - reset
    if (event.target.value === '') {
      Object.values(sections).forEach((section) => {
        const sectionContent = block.querySelector(`[data-section="${section.title}"]`);
        const hiddenElements = Array.from(document.querySelectorAll('details[style]')).filter((el) => el.style.display === 'none');
        if (hiddenElements.length) {
          hiddenElements.forEach((el) => {
            el.style.display = '';
          });
          sectionContent.style.display = '';
          searchResults.textContent = '';
        }
      });
    }
  });

  Object.values(sections).forEach((section) => {
    // decorate accordion item label
    const summaryText = p(section.title);
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(summaryText);

    // decorate accordion item body
    const body = div({ class: 'content', 'data-valign': 'middle' });

    section.items.forEach((accordionItem, index) => {
      const accordionDetail = document.createElement('details');
      const accordionSummary = document.createElement('summary');
      const accordionSummaryText = p(accordionItem.question);
      const accordionContent = div({ class: 'content', 'data-valign': 'middle' });
      accordionDetail.addEventListener('toggle', handleToggleHash);
      accordionDetail.className = 'accordion-item';
      accordionDetail.id = accordionItem.id;
      accordionSummary.className = 'accordion-item-label';
      accordionSummary.setAttribute('data-index', index);
      accordionSummary.append(accordionSummaryText);
      accordionContent.insertAdjacentHTML('beforeend', accordionItem.answer.innerHTML);
      accordionDetail.append(accordionSummary, accordionContent);
      body.append(accordionDetail);
    });

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.setAttribute('data-section', section.title);

    const headingText = summary.textContent.trim();
    const id = createHashId(headingText);

    details.id = id;
    details.open = true;
    details.append(summary, body);

    details.addEventListener('toggle', handleToggleHash);
    block.append(details);
  });

  // Check if this details element is being targeted by the URL hash
  const hash = window.location.hash.substring(1);
  if (hash) {
    const foundDetail = block.querySelector(`details[id=${hash}]`);
    if (foundDetail) {
      foundDetail.setAttribute('open', '');
      setTimeout(() => {
        scrollWithHeaderOffset(foundDetail);
      }, 100);
    }
  }

  // Styles are shared for reusability
  loadCSS(`${window.hlx.codeBasePath}/blocks/accordion/accordion.css`);
}
