import ffetch from '../../scripts/ffetch.js';
import {
  div, a, img, h4, span, p,
} from '../../scripts/dom-helpers.js';
import {
  buildBlock, decorateBlock, loadBlock, createOptimizedPicture, readBlockConfig,
} from '../../scripts/aem.js';

class News {
  constructor(newsTitle, newsDescription, newsPath, newsPublished, newsImage, newsCategory) {
    this.newsTitle = newsTitle;
    this.newsDescription = newsDescription;
    this.newsPath = newsPath;
    this.newsPublished = newsPublished;
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
        const cardImage = createOptimizedPicture('/news/media_1cd00e6d663e3a8f17a6a71845a2d09cc41f55b6d.png');
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
      const aEle1 = div({ class: 'learnmore' }, a({ href: `${result.newsPath}` }, 'Explore More', img({ src: '/assets/images/general/white-arrow-right.png', alt: 'more' })));
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

const loadresults = async (jsonDataNews, resultsDiv, numberOfCards) => {
  const newsResults = [];
  jsonDataNews.forEach((news) => {
    // eslint-disable-next-line max-len
    const obj = new News(news.pagetitle, news.brief, news.path, news.publishDate, news.bannerUrl, news.category);
    newsResults.push(obj);
  });
  newsResults.sort((x, y) => y.newsPublished - x.newsPublished);

  const blockType = 'columns';
  const numCards = typeof numberOfCards !== 'undefined' ? parseInt(numberOfCards, 10) : 6;

  // eslint-disable-next-line max-len
  const curPage = [...newsResults].slice(0, numCards);

  const blockContents = resultParsers[blockType](curPage);
  const builtBlock = buildBlock(blockType, blockContents);

  const parentDiv = div(
    builtBlock,
  );

  resultsDiv.append(parentDiv);
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

async function getCategories(block, numberOfCards) {
  const jsonDataNews = await ffetch('/news/query-index.json')
    .chunks(1000)
    .all();
  loadresults(jsonDataNews, block, numberOfCards);
}

export default async function decorate(block) {
  const { numberofcards } = readBlockConfig(block);
  block.innerHTML = '';
  await getCategories(block, numberofcards);
}
