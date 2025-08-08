import { Accordion } from '../accordion-ml/accordion-ml.js';
import {
  div, li, ul, details, summary, img,
} from '../../scripts/dom-helpers.js';

// TODO
// Add default orange bg with logo if no img is authored

function searchBlocks(searchValue, searchTarget) {
  const blocks = document.querySelectorAll('.business-block');
  blocks.forEach((block) => {
    const elToSearch = block.querySelector(searchTarget);
    if (elToSearch) {
      const text = elToSearch.textContent.toUpperCase();
      if (text.indexOf(searchValue.toUpperCase()) === -1) {
        block.style.display = 'none';
      } else {
        block.style.display = 'block';
      }
    }
  });
}

function displayAllBlocks() {
  const blocks = document.querySelectorAll('.business-block');
  blocks.forEach((block) => {
    block.style.display = 'block';
  });
}

function handleTagSearch(element) {
  if (element.classList.contains('selected-category')) {
    element.classList.remove('selected-category');
    displayAllBlocks();
    return;
  }

  document.querySelectorAll('.selected-category').forEach((el) => {
    el.classList.remove('selected-category');
  });

  element.classList.add('selected-category');

  const searchValue = element.textContent.trim();
  if (searchValue != null && searchValue.length > 0) {
    searchBlocks(searchValue, '.business-row .business-image p.category');
  }
}

function buildCategoryTags(categories) {
  const container = ul({ class: 'tag-container' });
  const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b));
  sortedCategories.forEach((category) => {
    const categoryTag = li({ class: `category-tag ${category.toLowerCase().replace(' ', '-')}`, onclick(e) { handleTagSearch(this, e); } }, category);
    container.append(categoryTag);
  });
  return container;
}

function getAltFromDescription(description) {
  return description.textContent;
}

// Removes authored <br> and adds anchor a11y title attributes
function formatContactMarkup(markup) {
  const tempDiv = document.createElement('div');
  tempDiv.appendChild(markup.cloneNode(true));

  const brElements = tempDiv.querySelectorAll('br');
  brElements?.forEach(br => br.remove());

  // Find all anchor tags with empty title attributes
  const anchors = tempDiv.querySelectorAll('a[title=""]');
  
  anchors.forEach((anchor) => {
    // Find the span with icon class inside this anchor
    const iconSpan = anchor.querySelector('span[class*="icon-"]');

    if (iconSpan) {
      const classList = iconSpan.className.split(' ');
      const iconClass = classList.find(cls => cls.startsWith('icon-') && cls !== 'icon');

      if (iconClass) {
        const iconType = iconClass.replace('icon-', '');
        // Capitalize first letter and create title
        const capitalizedIcon = iconType.charAt(0).toUpperCase() + iconType.slice(1);
        anchor.setAttribute('title', `${capitalizedIcon} Link`);
      }
    }
  });

  return tempDiv;
}

export default function decorate(block) {
  const contentContainer = div({ class: 'business-list' });
  const categories = [];

  function decorateLearnMore(learnMore, idValue) {
    const $summary = summary({ class: 'accordion-item-label' });

    const body = div({ class: 'accordion-item-body' });
    body.classList.add('content');
    [...learnMore.children].forEach((row, i) => {
      if (i === 0) {
        // decorate accordion item label
        const label = row;
        $summary.className = 'accordion-item-label';
        $summary.append(label);
      } else {
        // decorate accordion item content
        body.append(row);
      }
    });
    const id = `learn-more-${idValue}`;
    const $details = details({ class: 'accordion-item', id });
    $details.append($summary, body);
    return $details;
  }

  [...block.children].forEach((row, i) => {
    let accLearnMore;
    const backgroundImage = row.children[0].querySelector('img')?.getAttribute('src');
    const category = row.children[1].textContent;
    const descriptionEl = row.children[2];
    const contacts = row.children[3];
    if (row.children[4]) {
      const learnMore = row.children[4];
      accLearnMore = decorateLearnMore(learnMore, i);
    }
    const contactMarkup = document.createDocumentFragment();
    contactMarkup.append(...contacts.children);
    const contactMarkupFormatted = formatContactMarkup(contactMarkup);

    categories.push(category);
    const businessBlock = div(
      { class: 'business-block' },
      div(
        { class: 'business-row' },
        div(
          { class: 'business-image-container' },
          img({ src: backgroundImage, alt: `${getAltFromDescription(...descriptionEl.children)} image` }),
        ),
        div(
          { class: 'business-info' },
          ...descriptionEl.children,
          contactMarkupFormatted,
        ),
      ),
    );
    if (row.children[4]) { businessBlock.append(accLearnMore); }
    contentContainer.append(businessBlock);
  });
  const categoryTagContainer = buildCategoryTags([...new Set(categories)]);
  block.innerHTML = '';
  block.append(categoryTagContainer, contentContainer);

  /* eslint-disable no-new */
  block.querySelectorAll('details').forEach((el) => {
    new Accordion(el);
  });
}
