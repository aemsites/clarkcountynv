import ffetch from '../../scripts/ffetch.js';
import { normalizeString } from '../../scripts/utils.js';
import {
  div, a,
  h3,
} from '../../scripts/dom-helpers.js';
import {
  buildBlock, decorateBlock, loadBlock, createOptimizedPicture,
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
      let publishedDate;
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
      if (result.newsPublished.length > 0) {
        publishedDate = new Date(result.newsPublished * 1000).toDateString();
      }
      const divTitle = div();
      if (result.newsCategory && publishedDate) {
        divTitle.textContent = `${result.newsCategory} - ${publishedDate.slice(4)}`;
      } else {
        // eslint-disable-next-line no-nested-ternary
        const available = publishedDate ? publishedDate.slice(4) : result.newsCategory ? result.newsCategory : '';
        divTitle.textContent = available;
      }
      cardbottom.append(divTitle);

      const divDescription = div({ class: 'description' });
      const pageTitle = h3({ class: 'pagetitle' }, result.newsTitle);
      divDescription.textContent = result.newsDescription;
      const aEle = a({ class: 'description' });
      aEle.href = window.location.origin + result.newsPath;
      aEle.append(pageTitle, divDescription);
      cardbottom.append(aEle);
      const divReadmore = div({ class: 'readmore' });
      const aEle1 = a({ class: 'readmore' }, 'Read More');
      aEle1.href = window.location.origin + result.newsPath;
      divReadmore.append(aEle1);
      cardbottom.append(divReadmore);
      row.push(cardtop, cardbottom);
      blockContents.push(row);
    });
    return blockContents;
  },
};

const loadresults = async (jsonDataNews, resultsDiv) => {
  const newsResults = [];
  jsonDataNews.forEach((news) => {
    // eslint-disable-next-line max-len
    const obj = new News(news.pagetitle, news.brief, news.path, news.publishDate, news.bannerUrl, news.category);
    newsResults.push(obj);
  });
  newsResults.sort((x, y) => y.newsPublished - x.newsPublished);

  const blockType = 'cards';

  // eslint-disable-next-line max-len
  const curPage = [...newsResults].slice(0, 6);
  console.log(curPage);

  const blockContents = resultParsers[blockType](curPage);
  const builtBlock = buildBlock(blockType, blockContents);

  const parentDiv = div(
    builtBlock,
  );

  resultsDiv.append(parentDiv);
  decorateBlock(builtBlock);
  await loadBlock(builtBlock);
  builtBlock.classList.add('newsItems');
  builtBlock.querySelectorAll(':scope > div').forEach((newsitem) => {
    newsitem.classList.add('news');
  });
};

async function getCategories(block) {
  const jsonDataNews = await ffetch('/news/query-index.json')
    .chunks(1000)
    .all();
  loadresults(jsonDataNews, block);
}

export default async function decorate(block) {
  block.innerHTML = '';
  await getCategories(block);
}
