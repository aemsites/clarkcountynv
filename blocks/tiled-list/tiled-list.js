import {
  div, a, img, h4, span, p,
} from '../../scripts/dom-helpers.js';
import {
  buildBlock, decorateBlock, loadBlock, createOptimizedPicture, fetchPlaceholders,
} from '../../scripts/aem.js';

const placeholders = await fetchPlaceholders();
const CLARKLOGO = placeholders.clarkcountylogo;
const WHITEARROW = placeholders.whitearrow;

class News {
  constructor(newsTitle, newsPath, newsImage, newsCategory) {
    this.newsTitle = newsTitle;
    this.newsPath = newsPath;
    this.newsImage = newsImage;
    this.newsCategory = newsCategory;
  }
}

// Result parsers parse the query results into a format that can be used by the block builder for
// the specific block types
const resultParsers = {
  // Parse results into a cards block
  cards: (results) => {
    const blockContents = [];
    results.forEach((result) => {
      const cardtop = div({ class: 'card-top' });
      const row = [];
      if (result.newsImage.length > 0) {
        const cardImage = createOptimizedPicture(result.newsImage);
        cardtop.append(cardImage);
      } else {
        const cardImage = createOptimizedPicture(CLARKLOGO);
        cardtop.append(cardImage);
      }
      const cardbottom = div({ class: 'card-bottom' });

      const divTitle = div({ class: 'category' });
      if (result.newsCategory) {
        divTitle.textContent = `${result.newsCategory}`;
      }
      cardbottom.append(divTitle);

      const pageTitle = div({ class: 'pagetitle' }, result.newsTitle);
      cardbottom.append(pageTitle);
      const aEle1 = div({ class: 'learnmore' }, a({ href: `${result.newsPath}` }, 'Explore More', img({ src: WHITEARROW, alt: 'more' })));
      cardbottom.append(aEle1);
      row.push(cardtop, cardbottom);
      blockContents.push(row);
    });
    return blockContents;
  },
  columns: (results) => {
    const blockContents = [];
    results.forEach((result) => {
      const leftColumnFrag = document.createDocumentFragment();
      const rightColumnFrag = document.createDocumentFragment();
      if (result.newsImage) {
        const cardImage = createOptimizedPicture(result.newsImage, `${result.newsCategory} image`);
        leftColumnFrag.append(cardImage);
      }
      if (result.newsCategory) {
        const category = p({ class: 'newslist-category' }, result.newsCategory);
        rightColumnFrag.append(category);
      }
      if (result.newsTitle) {
        const title = h4({ class: 'newslist-title' }, result.newsTitle);
        rightColumnFrag.append(title);
      }
      if (result.newsPath) {
        const newsPath = a(
          { class: 'newslist-link', href: result.newsPath, target: '_self' },
          'Learn more',
          span(
            { class: 'icon icon-arrow-right-orange' },
            img(
              { src: '/icons/arrow-right-orange.svg', alt: 'Learn more about this news event' },
            ),
          ),
        );
        rightColumnFrag.append(newsPath);
      }
      const row = [];
      row.push(leftColumnFrag, rightColumnFrag);
      blockContents.push(row);
    });
    return blockContents;
  },
};

const loadresults = async (block, numberOfCards) => {
  const newsResults = [];

  [...block.children].forEach((row) => {
  // map the table columns to the object properties
    const pageTitle = row.children[2]?.querySelector('p')?.textContent.trim() || ' ';
    const path = row.children[3]?.querySelector('a')?.href || '';
    const bannerUrl = row.children[0]?.querySelector('img')?.src || '';
    const category = row.children[1]?.querySelector('p')?.textContent.trim() || ' ';

    // create the object
    const obj = new News(pageTitle, path, bannerUrl, category);
    newsResults.push(obj);
  });

  const blockType = 'columns';
  const numCards = typeof numberOfCards !== 'undefined' ? parseInt(numberOfCards, 10) : 6;

  // eslint-disable-next-line max-len
  const curPage = [...newsResults].slice(0, numCards);

  const blockContents = resultParsers[blockType](curPage);
  const builtBlock = buildBlock(blockType, blockContents);

  const parentDiv = div(
    builtBlock,
  );

  block.innerHTML = '';
  block.append(parentDiv);
  decorateBlock(builtBlock);
  await loadBlock(builtBlock);
  builtBlock.classList.add('newsitems');
  builtBlock.querySelectorAll(':scope > div').forEach((newsitem) => {
    Array.from(newsitem.children).forEach((column, index) => {
      if (index === 0) column.classList.add('column1');
      else column.classList.add('column2');
    });
    newsitem.classList.add('news');
  });
};

export default async function decorate(block) {
  const numberofcards = block.children.length;
  await loadresults(block, numberofcards);
}
