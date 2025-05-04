/* global WebImporter */
import {
  createMetadata,
  fetchAndParseDocument,
  blockSeparator,
  getMobileBgBlock,
  getDesktopBgBlock,
  buildSectionMetadata,
  getImportPagePath,
  fixPdfLinks,
  setPageTitle,
  fixImageSrcPath,
  extractBackgroundImageUrl, fixLinks,
} from './utils.js';

const extractPageInfo = async (url, href, results) => {
  const doc = await fetchAndParseDocument(url);
  const page = href.split('/').pop();
  if (doc) {
    const { body } = doc;
    const a = body.querySelector(`a[href="${page}"]`);

    // if article is present in list
    if (a) {
      const container = a.closest('.news');

      const bannerEl = container.querySelector('.news-banner');
      const backgroundImage = WebImporter.DOMUtils.replaceBackgroundByImg(bannerEl, document);
      let bannerUrl;
      if (backgroundImage) {
        bannerUrl = fixImageSrcPath(backgroundImage.getAttribute('src'), results, 'general/news');
      }
      const publishDateEl = container.querySelector('.news-date');
      const categoryEl = publishDateEl.querySelector('span.news-category');
      let category;
      if (categoryEl) {
        category = categoryEl.textContent.trim();
        categoryEl.remove();
      }
      const publishDate = publishDateEl.textContent.replace(/-\s+/g, '').trim();
      const brief = container.querySelector('.news-brief').textContent.trim();

      return {
        bannerUrl,
        category,
        publishDate,
        brief,
      };
    }
  }
  return {};
};

export const setPageTitleAnnouncement = (main, params) => {
  const pageTitleEl = main.querySelector('a').innerText.split(':')[1].trim();
  console.log(pageTitleEl);
  if (pageTitleEl.length > 0) {
    params['page-title'] = pageTitleEl;
  }
};

const getInfo = async (main, department, results, year) => {
  const publishDate = main.querySelector('a').innerText.split(':')[0];
  console.log('publishDate', publishDate);
  const title = main.querySelector('a').innerText.split(':')[1].trim();
  console.log('title', title);
  const category = department;
  console.log('category', category);
  const bannerEl = main.querySelector('img');
  const backgroundImage = WebImporter.DOMUtils.replaceBackgroundByImg(bannerEl, document);
  let bannerUrl;
  if (backgroundImage) {
    bannerUrl = fixImageSrcPath(backgroundImage.getAttribute('src'), results, `general/news/${department}/${year}`);
  }
  console.log('bannerUrl', bannerUrl);
  return {
    bannerUrl,
    title,
    category,
    publishDate,
  };
};

function getElement(url, doc) {
  const parentDiv = doc.querySelector('.faq-category');
  // get the # fragment from url
  const hash = url.split('#')[1];
  // filter the element if hash matches index
  return parentDiv.querySelectorAll('.faq-item')[hash];
}

export default {

  transform: async ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // const main = document.body;
    const main = getElement(params.originalURL, document);
    console.log(main);
    const year = main.querySelector('a').innerText.split(':')[0].split(',')[2].trim();
    const results = [];
    const department = 'environment_and_sustainability';
    const newPagePath = getImportPagePath(params.originalURL);
    console.log(newPagePath);
    // const heroBackgroundEl = main.querySelector('div.tns-bg-slide');
    // const backgroundImageUrl = heroBackgroundEl ? extractBackgroundImageUrl(heroBackgroundEl) : 'slide-1';

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      'section', // hero background image
      'noscript',
      '#main',
      '#skip', // skip to main content
      '.modal', // share button modal
      '#goog-gt-tt', // google translation
      '.uwy.userway_p5.utb',
    ]);

    // Handle all PDFs
    fixPdfLinks(main, results, newPagePath, `general/news/${department}/${year}`);
    setPageTitleAnnouncement(main, params);
    fixLinks(main);

    /* Start for hero image */
    const imagePath = '';
    const desktopBlock = getDesktopBgBlock(imagePath);
    const mobileBlock = getMobileBgBlock(imagePath);
    main.insertBefore(blockSeparator().cloneNode(true), main.firstChild);
    main.insertBefore(mobileBlock, main.firstChild);
    main.insertBefore(blockSeparator().cloneNode(true), main.firstChild);
    main.insertBefore(desktopBlock, main.firstChild);
    /* End for hero image */

    main.append(buildSectionMetadata([['Style', 'newsdetail, no-button']]));
    main.append(blockSeparator().cloneNode(true));

    params['breadcrumbs-base'] = '/news/news-breadcrumbs';
    params['breadcrumbs-title-override'] = 'News Post';
    // const listMetadata = await extractPageInfo(
    //   'http://localhost:3001/newslist.php?host=https://www.clarkcountynv.gov/newslist.php',
    //   params.originalURL,
    //   results,
    // );

    const listMetadata = await getInfo(main, department, results, year);

    Object.keys(listMetadata).forEach((key) => {
      if (listMetadata[key] && listMetadata[key].length > 0) {
        params[key] = listMetadata[key];
      }
    });

    createMetadata(main, document, params);

    results.push({
      element: main,
      path: `${newPagePath}/${year}`,
    });

    console.log('results', results);

    return results;
  },
};
