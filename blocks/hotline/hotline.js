import { Accordion } from '../accordion-ml/accordion-ml.js';
import {
  div, li, ul, details, summary, img, a,
} from '../../scripts/dom-helpers.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

function searchBlocks(searchValue) {
  const blocks = document.querySelectorAll('.business-block');
  blocks.forEach((block) => {
    const elToSearch = block.getAttribute('data-category');
    if (elToSearch) {
      const text = elToSearch.toUpperCase();
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

function handleTagSearch(element, event) {
  console.log('clicked', event);
  event.preventDefault();
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
    searchBlocks(searchValue);
  }
}

function buildCategoryTags(categories) {
  const container = ul({ class: 'tag-container' });
  categories.forEach((category) => {
    const categoryTag = li(
      { class: `category-tag ${category.toLowerCase().replace(' ', '-')}`, onclick(e) { handleTagSearch(this, e); } },
      a(
        { class: 'category-tag-link', href: '#' },
        category,
      ),
    );
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
  brElements?.forEach((br) => br.remove());

  // Find all anchor tags with empty title attributes
  const anchors = tempDiv.querySelectorAll('a[title=""]');

  anchors.forEach((anchor) => {
    // Find the span with icon class inside this anchor
    const iconSpan = anchor.querySelector('span[class*="icon-"]');

    if (iconSpan) {
      const classList = iconSpan.className.split(' ');
      const iconClass = classList.find((cls) => cls.startsWith('icon-') && cls !== 'icon');

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

export default async function decorate(block) {
  const contentContainer = div({ class: 'business-list' });
  const categories = [];
  const isFilterHotline = block.classList.contains('filter');

  const { clarkcountywhitelogo } = await fetchPlaceholders();

  [...block.children].forEach((row) => {
    const hasAuthoredImage = row.children[0].querySelector('img');
    const backgroundImage = row.children[0].querySelector('img')?.getAttribute('src');
    const category = row.children[1].textContent;
    const descriptionEl = row.children[2];
    const contacts = row.children[3];
    let accordionContent = null;
    if (row.children[4]) {
      if (isFilterHotline) {
        const temp = document.createElement('div');
        temp.innerHTML = row.children[4].innerHTML;
        accordionContent = div();
        accordionContent.innerHTML = row.children[4].innerHTML;
      }
    }

    const contactMarkup = document.createDocumentFragment();
    contactMarkup.append(...contacts.children);
    const contactMarkupFormatted = formatContactMarkup(contactMarkup);

    categories.push(category);
    const businessBlock = isFilterHotline ? div(
      { class: 'business-block', 'data-category': category },
      details(
        { class: 'accordion-item' },
        summary(
          { class: 'accordion-item-label' },
          div(
            { class: 'business-row' },
            div(
              { class: 'business-image-container' },
              img(
                { src: backgroundImage, alt: `${getAltFromDescription(...descriptionEl.children)} image` },
              ),
            ),
            div(
              { class: 'business-info' },
              ...descriptionEl.children,
              contactMarkupFormatted,
            ),
          ),
        ),
        div(
          { class: 'accordion-item-body content' },
          accordionContent,
        ),
      ),
    ) : div(
      { class: 'business-block' },
      div(
        { class: 'business-row' },
        div(
          { class: `business-image-container${!hasAuthoredImage ? ' bg-primary-orange' : ''}` },
          img({ src: hasAuthoredImage ? backgroundImage : clarkcountywhitelogo, alt: `${getAltFromDescription(...descriptionEl.children)} image` }),
        ),
        div(
          { class: 'business-info' },
          ...descriptionEl.children,
          contactMarkupFormatted,
        ),
      ),
    );
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
