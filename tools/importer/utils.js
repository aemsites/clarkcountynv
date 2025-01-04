/* global WebImporter */

export const PREVIEW_DOMAIN = 'https://main--clarkcountynv--aemsites.aem.page';
const METADATA_ALLOWED_KEYS = ['template', 'breadcrumbs-base', 'page-title', 'breadcrumbs-title-override',
  'backgroundImageUrl', 'category', 'publishDate', 'title', 'brief', 'bannerUrl'];
export const createMetadata = (main, document, params) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  if (params.preProcessMetadata && Object.keys(params.preProcessMetadata).length) {
    Object.assign(meta, params.preProcessMetadata);
  }

  METADATA_ALLOWED_KEYS.forEach((key) => {
    if (params[key]) {
      meta[key] = params[key];
    }
  });

  const image = document.createElement('img');
  image.src = `${PREVIEW_DOMAIN}/assets/images/logo.png`;
  meta.Image = image;
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

export const fixRelativeLinks = (document) => {
  document.querySelectorAll('a').forEach((a) => {
    const url = new URL(a.href);
    if (url.pathname) {
      a.href = PREVIEW_DOMAIN + url.pathname;
    }
  });
};

export const getImportPagePath = (url) => {
  let path = new URL(url).pathname;
  path = path.endsWith('.php') ? path.slice(0, -4) : path;
  return WebImporter.FileUtils.sanitizePath(path);
};

export const getSanitizedPath = (url) => {
  const u = new URL(url);
  // if link points to a URL outside this site, return the original URL
  if (u.hostname && u.hostname !== 'www.clarkcountynv.gov' && u.hostname !== 'localhost') {
    return url;
  }

  const path = u.pathname;
  const sanitizedPath = WebImporter.FileUtils.sanitizePath(path);
  if (sanitizedPath.endsWith('index.php')) {
    return sanitizedPath.slice(0, -9);
  } if (sanitizedPath.endsWith('.php')) {
    return sanitizedPath.slice(0, -4);
  }
  return sanitizedPath;
};

export const getPathSegments = (url) => (new URL(url)).pathname.split('/')
  .filter((segment) => segment);

export const normalizeString = (str) => str.toLowerCase().replace(/ /g, '_');

export const fetchAndParseDocument = async (url) => {
  try {
    const response = await fetch(url);
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

export const fixPdfLinks = (main, results, assetPath = '/assets/documents/') => {
  main.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href.endsWith('.pdf')) {
      const u = new URL(href, 'https://webfiles.clarkcountynv.gov');
      const newPath = WebImporter.FileUtils.sanitizePath(`${assetPath}${u.pathname.split('/').pop()}`);
      results.push({
        path: newPath,
        from: u.toString(),
      });

      a.setAttribute('href', new URL(newPath, PREVIEW_DOMAIN));
    }
  });
};

export const fixAudioLinks = (main) => {
  main.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && (href.toLowerCase().search('.mp3') !== -1 || href.toLowerCase().search('.mp4') !== -1)) {
      const u = new URL(href, 'https://webfiles.clarkcountynv.gov');
      a.setAttribute('href', u.toString());
    }
  });
};

export const getImagePath = (src, results, imgLocation = '/assets/images/departments/') => {
  const imagePath = new URL(src).pathname.toLowerCase();
  const u = new URL(imagePath, 'https://webfiles.clarkcountynv.gov');
  const newPath = WebImporter.FileUtils.sanitizePath(`${imgLocation}${imagePath.split('/').pop()}`);
  results.push({
    path: newPath,
    from: u.toString(),
  });
  return new URL(newPath, PREVIEW_DOMAIN);
};
