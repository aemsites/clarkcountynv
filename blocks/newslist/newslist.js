import ffetch from '../../scripts/ffetch.js';
import { addPagingWidget, normalizeString } from '../../scripts/utils.js';
import {
  div, a, li, h3, span, p,
} from '../../scripts/dom-helpers.js';
import {
  buildBlock, decorateBlock, loadBlock, createOptimizedPicture, getMetadata,
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
  columns: (results) => {
    const blockContents = [];
    const newsButtonText = getMetadata('news-button-text') || 'Read More';
    results.forEach((result) => {
      const cardleft = div({ class: 'card-left' });
      const row = [];
      if (result.newsImage.length > 0) {
        const cardImage = createOptimizedPicture(result.newsImage);
        cardleft.append(cardImage);
      } else {
        const cardImage = createOptimizedPicture('/news/media_1cd00e6d663e3a8f17a6a71845a2d09cc41f55b6d.png');
        cardleft.append(cardImage);
      }
      const cardright = div(
        { class: 'card-right' },
      );

      const divDescription = p(
        { class: 'description' },
        span(
          { class: 'fw-bold' },
          'Additional Details: ',
        ),
        result.newsDescription,
      );

      const pageTitle = h3(
        { class: 'pagetitle' },
        result.newsTitle,
      );
      cardright.append(pageTitle, divDescription);

      const aEle1 = a(
        { class: 'button primary' },
        newsButtonText,
      );
      aEle1.href = window.location.origin + result.newsPath;
      cardright.append(aEle1);

      row.push(cardleft, cardright);
      blockContents.push(row);
    });
    return blockContents;
  },
};

const loadresults = async (jsonDataNews, resultsDiv, page, newsbox) => {
  const newsResults = [];
  jsonDataNews.forEach((news) => {
    // eslint-disable-next-line max-len
    const obj = new News(news.pagetitle, news.brief, news.path, news.publishDate, news.bannerUrl, news.category);
    newsResults.push(obj);
  });
  newsResults.sort((x, y) => y.newsPublished - x.newsPublished);

  const blockType = 'columns';
  const resultsPerPage = 10;
  const startResult = page * resultsPerPage;

  // eslint-disable-next-line max-len
  const curPage = [...newsResults].slice(startResult, startResult + resultsPerPage);

  const blockContents = resultParsers[blockType](curPage);
  const builtBlock = buildBlock(blockType, blockContents);

  const parentDiv = div(
    builtBlock,
  );

  // Pagination logic
  const totalResults = jsonDataNews.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  addPagingWidget(parentDiv, page, totalPages);
  const paginationblock = parentDiv.querySelector('ul');
  const paginationLimit = 5;
  if (totalPages > paginationLimit) {
    let elementForward = 0;
    const threeDotsAfter = li();
    const ata = a();
    ata.innerText = '...';
    threeDotsAfter.appendChild(ata);

    const threeDotsBefore = li();
    const atb = a();
    atb.innerText = '...';
    threeDotsBefore.appendChild(atb);

    const firstElement = paginationblock.querySelector('.prev.page').nextElementSibling;
    const lastElement = paginationblock.querySelector('.next.page').previousElementSibling;
    firstElement.after(threeDotsBefore);
    lastElement.before(threeDotsAfter);

    if (page < (paginationLimit - 1)) {
      firstElement.nextElementSibling.classList.add('notvisible');
      const currentElement = paginationblock.querySelector('.active');
      // eslint-disable-next-line max-len
      elementForward = (page === 0) ? currentElement.nextElementSibling.nextElementSibling.nextElementSibling : currentElement.nextElementSibling.nextElementSibling;
      while (elementForward) {
        elementForward.classList.add('notvisible');
        elementForward = elementForward.nextElementSibling;
        if (elementForward.innerText === '...') break;
      }
    }
    if (page > (paginationLimit - 2) && (page < (totalPages - 3))) {
      const currentElement = paginationblock.querySelector('.active');
      elementForward = currentElement.nextElementSibling.nextElementSibling;
      while (elementForward) {
        elementForward.classList.add('notvisible');
        elementForward = elementForward.nextElementSibling;
        if (elementForward.innerText === '...') break;
      }
      // eslint-disable-next-line max-len
      let elementBefore = currentElement.previousElementSibling.previousElementSibling.previousElementSibling;
      while (elementBefore) {
        elementBefore.classList.add('notvisible');
        elementBefore = elementBefore.previousElementSibling;
        if (elementBefore.innerText === '...') break;
      }
    } else if (page > (totalPages - 4)) {
      const currentElement = paginationblock.querySelector('.active');
      lastElement.previousElementSibling.classList.add('notvisible');
      // eslint-disable-next-line max-len
      let elementBefore = currentElement.previousElementSibling.previousElementSibling.previousElementSibling;
      while (elementBefore) {
        elementBefore.classList.add('notvisible');
        elementBefore = elementBefore.previousElementSibling;
        if (elementBefore.innerText === '...') break;
      }
    }
  }
  resultsDiv.append(parentDiv);
  decorateBlock(builtBlock);
  await loadBlock(builtBlock);
  builtBlock.classList.add('news-items');
  builtBlock.querySelectorAll(':scope > div').forEach((newsitem) => {
    newsitem.classList.add('news');
  });
  newsbox.append(builtBlock);
  newsbox.append(paginationblock.parentElement);
};

async function getCategories(block, newsbox) {
  const categories = new Set();
  const jsonDataNews = await ffetch('/news/query-index.json')
    .chunks(1000)
    .all();
  // Get category from array of Objects
  jsonDataNews.forEach((news) => {
    if (news.category) {
      categories.add(news.category);
    }
  });
  const params = new URLSearchParams(window.location.search);
  const catNews = params.get('category');
  if (!catNews) {
    params.set('category', normalizeString('All News'));
    window.location.search = params.toString();
  }
  let curPage = params.get('pg');
  if (!curPage) {
    curPage = 0;
  } else {
    // convert the current page to a number
    curPage = parseInt(curPage, 10);
  }

  loadresults(jsonDataNews, block, curPage, newsbox);
}

export default async function decorate(block) {
  block.innerHTML = '';
  const newsbox = div({ class: 'news-box' });
  block.append(newsbox);
  await getCategories(block, newsbox);
}
