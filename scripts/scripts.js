import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  sampleRUM,
  getMetadata,
  createOptimizedPicture as libCreateOptimizedPicture, fetchPlaceholders,
} from './aem.js';

import { h1 } from './dom-helpers.js';

import { getViewPort, externalLinks, ScrolltoTop } from './utils.js';

import assetsInit from './aem-assets-plugin-support.js';

const placeholders = await fetchPlaceholders();
const DEFAULT_BACKGROUND_IMAGE = placeholders.defaultherobanner;

const getPageTitle = async (url) => {
  // TODO: check if URL is valid, shouldn't be empty or null or need trailing slash
  const resp = await fetch(url); // invalid URL will return 404 in console
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    const pageTitle = html.querySelector('meta[name="page-title"]');
    if (pageTitle) {
      return html.querySelector('meta[name="breadcrumbs-title-override"]')?.content || html.querySelector('meta[name="page-title"]').content;
    }
    return html.querySelector('title').innerText;
  }
  return null;
};

const getAllPathsExceptCurrent = async (paths) => {
  const result = [];
  // remove first and last slash characters
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/');
  for (let i = 0; i < pathsList.length - 1; i += 1) {
    const pathPart = pathsList[i];
    const prevPath = result[i - 1] ? result[i - 1].path : '';
    const path = `${prevPath}/${pathPart}`;
    const url = `${window.location.origin}${path}/`;
    /* eslint-disable-next-line no-await-in-loop */
    const name = await getPageTitle(url);
    result.push({ path, name, url });
  }
  return result.filter(Boolean);
};

async function buildBreadcrumbsFromNavTree(nav, currentUrl) {
  const crumbs = [];
  // TODO: changing logic based on path as we will likely load from meta or tabs from index later
  const path = window.location.pathname;
  const paths = await getAllPathsExceptCurrent(path);
  paths.forEach((pathPart) => {
    if (pathPart.name !== '') {
      crumbs.push({ title: pathPart.name, url: pathPart.url });
    }
  });

  // TODO: no link on home icon
  const homeUrl = document.querySelector('.nav-brand a[href]')?.href || window.location.origin;
  if (currentUrl !== homeUrl) {
    crumbs.push({ title: getMetadata('breadcrumbs-title-override') || getMetadata('page-title'), url: currentUrl });
  }

  // TODO: needs placeholders file
  const placeholders = await fetchPlaceholders();
  const homePlaceholder = placeholders.breadcrumbsHomeLabel || 'Home';

  crumbs.unshift({ title: homePlaceholder, url: homeUrl });

  // last link is current page and should not be linked
  if (crumbs.length > 1) {
    crumbs[crumbs.length - 1].url = null;
  }
  crumbs[crumbs.length - 1]['aria-current'] = 'page';

  return crumbs;
}

export const fetchAndParseDocument = async (url) => {
  try {
    const response = await fetch(`${url}.plain.html`);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching and parsing document:', error);
  }
  return null;
};

async function buildBreadcrumbsFromMetadata(nav, currentUrl) {
  const crumbs = [];
  // TODO: changing logic based on path as we will likely load from meta or tabs from index later
  let paths = await fetchAndParseDocument(getMetadata('breadcrumbs-base'));
  paths = paths.querySelectorAll('li a');
  paths.forEach((path) => {
    crumbs.push({ title: path.textContent, url: path.href });
  });

  const homeUrl = document.querySelector('.nav-brand a[href]')?.href || window.location.origin;
  if (currentUrl !== homeUrl && (getMetadata('page-title') !== '' || getMetadata('breadcrumbs-title-override') !== '')) {
    const title = getMetadata('breadcrumbs-title-override') || getMetadata('page-title');
    crumbs.push({ title, url: null });
  }
  return crumbs;
}

export async function buildBreadcrumbs() {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';

  let crumbs;
  if (getMetadata('breadcrumbs-base')) {
    crumbs = await buildBreadcrumbsFromMetadata(document.querySelector('.nav-sections'), document.location.href);
  } else {
    crumbs = await buildBreadcrumbsFromNavTree(document.querySelector('.nav-sections'), document.location.href);
  }

  const ul = document.createElement('ul');
  ul.append(...crumbs.map((item) => {
    const li = document.createElement('li');
    if (item['aria-current']) li.setAttribute('aria-current', item['aria-current']);
    if (item.url) {
      const anc = document.createElement('a');
      anc.href = item.url;
      anc.textContent = item.title;
      li.append(anc);
    } else {
      li.textContent = item.title;
    }
    return li;
  }));

  breadcrumbs.append(ul);
  return breadcrumbs;
}

function decorateSectionsWithBackgrounds(element) {
  const sections = element.querySelectorAll(`.section[data-bg-image],
  .section[data-bg-image-desktop],
  .section[data-bg-image-mobile],
  .section[data-bg-image-tablet]`);
  sections.forEach(async (section) => {
    const bgImage = section.getAttribute('data-bg-image');
    const bgImageDesktop = section.getAttribute('data-bg-image-desktop');
    const bgImageMobile = section.getAttribute('data-bg-image-mobile');
    const bgImageTablet = section.getAttribute('data-bg-image-tablet');

    if (!(bgImage || bgImageDesktop || bgImageMobile || bgImageTablet)) {
      section.setAttribute('data-bg-image', DEFAULT_BACKGROUND_IMAGE);
    }
    const viewPort = getViewPort();
    let background = DEFAULT_BACKGROUND_IMAGE;
    switch (viewPort) {
      case 'Mobile':
        background = bgImageMobile || bgImageTablet || bgImageDesktop || bgImage || background;
        break;
      case 'Tablet':
        background = bgImageTablet || bgImageDesktop || bgImage || bgImageMobile || background;
        break;
      default:
        background = bgImageDesktop || bgImage || bgImageTablet || bgImageMobile || background;
        break;
    }
    if (background) {
      if (section.classList.contains('with-static-background-image')) {
        section.classList.add('with-static-background-image');
      } else {
        section.classList.add('with-background-image');
      }
      const backgroundPic = libCreateOptimizedPicture(background);
      backgroundPic.classList.add('background-image');
      section.append(backgroundPic);
    }

    if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
      section.insertBefore(await buildBreadcrumbs(), section.firstChild);
    }

    const heading = getMetadata('page-title');
    if (heading) {
      const pageTitle = h1({ class: 'page-title' }, heading);
      section.append(pageTitle);
    }
  });
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const $h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if ($h1 && picture && ($h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, $h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function autolinkModals(element) {
  element.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');

    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
      openModal(origin.href);
    }
  });
}

/*
  * Appends query params to a URL
  * @param {string} url The URL to append query params to
  * @param {object} params The query params to append
  * @returns {string} The URL with query params appended
  * @private
  * @example
  * appendQueryParams('https://example.com', { foo: 'bar' });
  * // returns 'https://example.com?foo=bar'
*/
function appendQueryParams(url, params) {
  const { searchParams } = url;
  params.forEach((value, key) => {
    searchParams.set(key, value);
  });
  url.search = searchParams.toString();
  return url.toString();
}

export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]) {
  const isAbsoluteUrl = /^https?:\/\//i.test(src);

  // Fallback to createOptimizedPicture if src is not an absolute URL
  if (!isAbsoluteUrl) return libCreateOptimizedPicture(src, alt, eager, breakpoints);

  const url = new URL(src);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    const searchParams = new URLSearchParams({ width: br.width, format: 'webply' });
    source.setAttribute('srcset', appendQueryParams(url, searchParams));
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    const searchParams = new URLSearchParams({ width: br.width, format: ext });

    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', appendQueryParams(url, searchParams));
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', appendQueryParams(url, searchParams));
    }
  });

  return picture;
}

/**
 * Decorates all images in a container element and replace media urls with delivery urls.
 * @param {Element} main The container element
 */
function decorateDeliveryImages(main) {
  const pictureElements = main.querySelectorAll('picture');
  [...pictureElements].forEach((pictureElement) => {
    const imgElement = pictureElement.querySelector('img');
    const alt = imgElement.getAttribute('alt');
    try {
      const deliveryObject = JSON.parse(decodeURIComponent(alt));
      const { deliveryUrl, altText } = deliveryObject;
      if (!deliveryUrl) {
        return;
      }

      const newPictureElement = createOptimizedPicture(deliveryUrl, altText);
      pictureElement.parentElement.replaceChild(newPictureElement, pictureElement);
    } catch (error) {
      // Do nothing
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates paragraphs containing a single link as buttons.
 * @param {Element} element container element
 */
export function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    if (!a.closest('.no-buttons')) {
      a.title = a.title || a.textContent;
      if (a.href !== a.textContent) {
        const up = a.parentElement;
        const twoup = a.parentElement.parentElement;
        if (!a.querySelector('img')) {
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            a.className = 'button'; // default
            up.classList.add('button-container');
          }
          if (
            up.childNodes.length === 1
            && up.tagName === 'STRONG'
            && twoup.childNodes.length === 1
            && twoup.tagName === 'P'
          ) {
            a.className = 'button primary';
            twoup.classList.add('button-container');
          }
          if (
            up.childNodes.length === 1
            && up.tagName === 'EM'
            && twoup.childNodes.length === 1
            && twoup.tagName === 'P'
          ) {
            a.className = 'button secondary';
            twoup.classList.add('button-container');
          }
        }
      }
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  if (window.hlx.aemassets.decorateExternalImages) {
    // decorate external images with explicit external image marker
    window.hlx.aemassets.decorateExternalImages(main, '//External Image//');
    // decorate external images with implicit external image marker
    window.hlx.aemassets.decorateExternalImages(main);
  }
  if (window.hlx.aemassets.decorateImagesFromAlt) {
    window.hlx.aemassets.decorateImagesFromAlt(main);
  }
  // decorate images with delivery url and correct alt text
  decorateDeliveryImages(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateSectionsWithBackgrounds(main);
  externalLinks(main);
}

/**
 * Decorates the template.
 */
export async function loadTemplate(doc, templateName) {
  try {
    const cssLoaded = new Promise((resolve) => {
      loadCSS(
        `${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`,
      )
        .then(resolve)
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(
            `failed to load css module for ${templateName}`,
            err.target.href,
          );
          resolve();
        });
    });
    const decorationComplete = new Promise((resolve) => {
      (async () => {
        try {
          const mod = await import(
            `../templates/${templateName}/${templateName}.js`
          );
          if (mod.default) {
            await mod.default(doc);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`failed to load module for ${templateName}`, error);
        }
        resolve();
      })();
    });

    document.body.classList.add(`${templateName}-template`);

    await Promise.all([cssLoaded, decorationComplete]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`failed to load block ${templateName}`, error);
  }
}

/**
 * Adds a page specific subscribe modal
 * @param path
 * @param main
 *
 */
function addPageBasedModal(path, main) {
  const modal = document.createElement('script');
  if (path && path.startsWith('/')) {
    switch (path) {
      case '/government/departments/parks___recreation/':
        modal.setAttribute('src', '//content.govdelivery.com/overlay/js/8729.js');
        break;
      case '/government/elected_officials/county_treasurer/':
        modal.setAttribute('src', 'https://public.govdelivery.com/assets/SignupOverlay.js');
        modal.setAttribute('data-account-code', 'NVCLARK');
        modal.setAttribute('data-signup-id', '38697');
        modal.setAttribute('data-width', '500');
        modal.setAttribute('data-delay', '0');
        modal.setAttribute('async', '');
        break;
      default:
        break;
    }
    main.append(modal);
  }
}
/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  const templateName = getMetadata('template');
  decorateTemplateAndTheme(templateName);

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    if (templateName) {
      await loadTemplate(doc, templateName);
    }
    addPageBasedModal(window.location.pathname, main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  sampleRUM.enhance();

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 991 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  autolinkModals(doc);

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

ScrolltoTop();

await assetsInit(); // This to be done before loadPage() function invocation

loadPage();
