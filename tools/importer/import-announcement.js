/* global WebImporter */
import {
  createMetadata,
  blockSeparator,
  getMobileBgBlock,
  getDesktopBgBlock,
  buildSectionMetadata,
  fixPdfLinks,
  fixImageSrcPath,
  fixLinks,
} from './utils.js';

export const setPageTitleAnnouncement = (main, params) => {
  const pageTitleEl = main.querySelector('a').innerText.split(':')[1].trim();
  if (pageTitleEl.length > 0) {
    params['page-title'] = pageTitleEl;
  }
};

const getInfo = async (main, department, results, year) => {
  const publishDate = main.querySelector('a').innerText.split(':')[0];
  const title = main.querySelector('a').innerText.split(':')[1].trim();
  const category = department;
  const bannerEl = main.querySelector('img');
  let bannerUrl;
  if (bannerEl) {
    const backgroundImage = WebImporter.DOMUtils.replaceBackgroundByImg(bannerEl, document);
    if (backgroundImage) {
      bannerUrl = fixImageSrcPath(backgroundImage.getAttribute('src'), results, `general/news/${department}/${year}`);
    }
  } else {
    bannerUrl = 'https://main--clarkcountynv--aemsites.aem.page/assets/images/general/clarkcounty-logo.png';
  }
  return {
    bannerUrl,
    title,
    category,
    publishDate,
    year,
  };
};

function getElement(url, doc) {
  const parentDiv = doc.querySelector('.faq-category');
  // get the # fragment from url
  const hash = url.split('#')[1];
  // filter the element if hash matches index
  return parentDiv.querySelectorAll('.faq-item')[hash];
}

export const buildTextMetadata = (cells) => WebImporter.Blocks.createBlock(document, {
  name: 'text (center)',
  cells: [...cells],
});

export const getTextBlock = (title) => buildTextMetadata([
  [title],
]);

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
    fixPdfLinks(main, results, `general/news/${department}/${year}`);
    setPageTitleAnnouncement(main, params);
    fixLinks(main);

    // Creating a Text block for the title
    const textBlock = getTextBlock(main.querySelector('a').innerText.split(':')[1].trim());
    main.insertBefore(textBlock, main.firstChild);

    /* Start for hero image */
    const imagePath = '';
    const desktopBlock = getDesktopBgBlock(imagePath);
    const mobileBlock = getMobileBgBlock(imagePath);
    main.insertBefore(blockSeparator().cloneNode(true), main.firstChild);
    main.insertBefore(mobileBlock, main.firstChild);
    main.insertBefore(blockSeparator().cloneNode(true), main.firstChild);
    main.insertBefore(desktopBlock, main.firstChild);
    /* End for hero image */

    /* Taking care of rest of the images */
    main.querySelectorAll('img').forEach((image) => {
      const imageUrl = fixImageSrcPath(image.getAttribute('src'), results, `general/news/${department}/${year}`);
      image.replaceWith(imageUrl);
    });

    main.append(buildSectionMetadata([['Style', 'newsdetail, no-button']]));
    main.append(blockSeparator().cloneNode(true));

    params['breadcrumbs-base'] = '/news/news-breadcrumbs';
    params['breadcrumbs-title-override'] = 'News Post';

    const listMetadata = await getInfo(main, department, results, year);

    Object.keys(listMetadata).forEach((key) => {
      if (listMetadata[key] && listMetadata[key].length > 0) {
        params[key] = listMetadata[key];
      }
    });

    createMetadata(main, document, params);

    results.push({
      element: main,
      path: `/news/${department}/${year}`,
    });

    console.log('results', results);

    return results;
  },
};
