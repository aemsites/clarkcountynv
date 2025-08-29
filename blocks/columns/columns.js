import { createOptimizedPicture } from '../../scripts/aem.js';
import { a, i, iframe } from '../../scripts/dom-helpers.js';
import { replaceClickableImageLinkWithImage } from '../../scripts/utils.js';

function enablePlaybutton(col, pic, redirectURL) {
  const playButton = a({ class: 'explore-video-play' }, i({ class: 'play-button' }));
  playButton.setAttribute('aria-label', 'Play Video');
  playButton.href = redirectURL;
  col.append(pic);
  col.append(playButton);
  col.classList.add('explore-img');
}

/** allow for link attributes to be added by authors
 * example usage = Text [class:button,target:_blank,title:Title goes here]
 * @param main
 */
export function decorateLinks(element) {
  element.querySelectorAll('a').forEach(($a) => {
    // match text inside [] and split by '|'
    const match = $a.textContent.match(/(.*)\[\[([^\]\]]*)]/);
    if (match) {
      // eslint-disable-next-line no-unused-vars
      const [_, linkText, attrs] = match;
      $a.textContent = linkText.trim();
      $a.setAttribute('title', $a.textContent);
      attrs.split(',').forEach((attr) => {
        let [key, ...value] = attr.trim().split(':');
        key = key.trim().toLowerCase();
        value = value.join().trim();
        if (key) $a.setAttribute(key, value);
      });
    }
  });
}

function decorateImage(col) {
  let pic = col.querySelector('picture');
  let redirectElement = '';
  if (!pic) {
    const imgSrc = col.querySelectorAll('a')[0].href;
    pic = createOptimizedPicture(imgSrc, imgSrc.split('/').pop());
    // eslint-disable-next-line prefer-destructuring
    redirectElement = col.querySelectorAll('a')[1];
  } else {
    // eslint-disable-next-line prefer-destructuring
    redirectElement = col.querySelectorAll('a')[0];
  }
  if (pic) {
    col.innerHTML = '';
    if (redirectElement) {
      if (redirectElement.href.includes('youtube.com') || redirectElement.href.includes('youtu.be')) {
        enablePlaybutton(col, pic, redirectElement.href);
      } else {
        const redirect = a({ class: 'redirect' });
        redirect.href = redirectElement.href;
        redirect.append(pic);
        col.append(redirect);
      }
    } else {
      col.append(pic);
    }
  }
}

export default function decorate(block) {
  if (block.classList.contains('clickable-image-left') || block.classList.contains('clickable-image-right')) {
    [...block.children].forEach((row) => {
      [...row.children].forEach((col, index) => {
        if (block.classList.contains('clickable-image-left') && index === 0) {
          col.classList.add('explore-img');
          decorateImage(col);
        } else if (block.classList.contains('clickable-image-right') && index === 1) {
          col.classList.add('explore-img');
          decorateImage(col);
        }
        if (block.classList.contains('clickable-image-left') && index === 1) {
          col.classList.add('explore-item');
          decorateLinks(col);
        } else if (block.classList.contains('clickable-image-right') && index === 0) {
          col.classList.add('explore-item');
          decorateLinks(col);
        }
      });
    });
  }

  const cols = [...block.firstElementChild.children];

  block.classList.add(`columns-${cols.length}-cols`);
  for (let counter = 0; counter < cols.length; counter += 1) {
    cols[counter].classList.add(`column${counter + 1}`);
    [...cols[counter].children].forEach((child) => {
      child.classList.remove('button-container');
      child.classList.add('columns-paragraph');
      child.classList.add(`column${counter + 1}-paragraph`);
    });
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      decorateLinks(col);
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Contact Card (Map Embed)
  const isContactCard = block.classList.contains('contact-card');
  if (isContactCard) {
    const firstCol = block.querySelector('.column1');
    const secondCol = block.querySelector('.column2');
    const secondColFirstEl = secondCol?.firstElementChild;
    const isTitleHeader = secondColFirstEl && (secondColFirstEl.tagName === 'H2' || secondColFirstEl.tagName === 'H3');
    const title = `${isTitleHeader.textContent} map` || 'Google map embed';
    const mapLink = firstCol?.querySelector('a');
    const hasFirstColImg = firstCol?.querySelector('picture');
    const hasEmbedCode = mapLink?.href.indexOf('www.google.com/maps/embed') > -1;
    if (hasEmbedCode || hasFirstColImg) {
      if (hasEmbedCode) {
        const map = iframe(
          {
            src: mapLink,
            allowFullscreen: true,
            frameBorder: 0,
            class: 'map-embed',
            title,
          },
        );
        mapLink?.parentElement.replaceWith(map);
      }
    } else {
      firstCol?.classList.add('no-embed');
    }
  }

  // 2 Column Image Layout
  const isTwoColImgLayout = block.classList.contains('two-column-image');
  if (isTwoColImgLayout) {
    replaceClickableImageLinkWithImage(block);
  }
}
