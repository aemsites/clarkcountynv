import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  ul, li, a, div, img, h4, i, br,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  /* change to ul, li */
  const $ul = ul();
  let cardImage;
  [...block.children].forEach((row) => {
    [...row.children].forEach((col, index) => {
      if (index === 0) {
        const imageLinkEl = col.querySelector('a');
        if (imageLinkEl) {
          const imgSrc = imageLinkEl.getAttribute('href');
          cardImage = createOptimizedPicture(imgSrc, imgSrc.split('/').pop());
          col.replaceWith(cardImage);
        } else {
          cardImage = col.querySelector('picture');
        }
      }
    });
    if (block.classList.contains('clickable')) {
      const $li = li({ class: 'cards-card' });
      const aEle = a();
      $li.append(aEle);
      while (row.firstElementChild) aEle.append(row.firstElementChild);
      [...aEle.children].forEach((divEl) => {
        if (divEl.children.length === 1 && divEl.querySelector('picture')) divEl.className = 'cards-card-image';
        else {
          divEl.className = 'cards-card-body';
          const cardsLinkEl = divEl.querySelector('a') || divEl.querySelector('img');
          if (cardsLinkEl) {
            aEle.href = cardsLinkEl.getAttribute('href') || cardsLinkEl.getAttribute('src');

            if (aEle.href) {
              const isExternal = !aEle.href.startsWith(window.location.origin)
                                && !aEle.href.startsWith('/')
                                && !aEle.href.startsWith('#');

              if (isExternal) {
                aEle.setAttribute('target', '_blank');
                aEle.setAttribute('rel', 'noopener noreferrer'); // Security best practice for external links
              }
            }

            if (cardsLinkEl.parentElement.tagName === 'P') {
              cardsLinkEl.parentElement.remove();
            } else {
              cardsLinkEl.remove();
            }
          }
        }
      });
      $ul.append($li);
    } else if (block.classList.contains('clickable-images')) {
      const image = row.children[0].querySelector('picture');
      const aEle = a({ class: 'grid-link' });
      const cardsLinkEl = row.children[1]?.querySelector('a') || row.children[1]?.querySelector('img');
      if (cardsLinkEl) { // for non-clickable images
        aEle.href = cardsLinkEl?.tagName === 'A' ? cardsLinkEl.href : cardsLinkEl.src;
        aEle.setAttribute('target', '_blank');
      }
      aEle.append(image);

      const imageText = row.children[2];
      if (imageText?.children.length > 0) {
        imageText.classList.add('image-text');
        let direction = 'bottom';
        block.classList.values().filter((className) => className.startsWith('text-direction')).forEach((className) => {
          [,, direction] = className.split('-');
        });

        if (direction === 'top') {
          $ul.append(li(imageText, aEle));
        } else {
          $ul.append(li(aEle, imageText));
        }
      } else {
        $ul.append(li(aEle));
      }
    } else if (block.classList.contains('tiles')) {
      const $a = row.querySelector('a');
      let url;
      if ($a) {
        url = $a.href;
      }
      const picture = row.querySelector('picture img');
      const backgroundImgSrc = picture ? picture.src : '';
      $ul.append(
        li(
          a(
            { href: url, class: 'visitors-tile' },
            div({ class: 'visitors-tile-banner', style: `background:url('${backgroundImgSrc}') center/contain no-repeat #F5F5F5` }),
            div({ class: 'visitors-tile-text' }, $a.textContent.trim()),
          ),
        ),
      );
    } else if (block.classList.contains('staff')) {
      const imgSrc = row.children[0].querySelector('img')?.src;
      const altText = imgSrc?.split('/').pop().split('?')[0];
      const name = row.children[1].textContent;
      const title = row.children[2];
      const pageLink = row.children[3].querySelector('a')?.href;
      const phone = row.children[4].querySelector('a[title="phone"]')?.href;
      const email = row.children[4].querySelector('a[title="email"]')?.href;
      const facebookSrc = row.children[4].querySelector('a[title="facebook"]')?.href;
      const youtubeSrc = row.children[4].querySelector('a[title="youtube"]')?.href;
      const twitterSrc = row.children[4].querySelector('a[title="twitter"]')?.href;
      const instagramSrc = row.children[4].querySelector('a[title="instagram"]')?.href;

      $ul.append(
        li(
          a(
            { href: pageLink || '', class: 'tile-detail', style: pageLink ? '' : 'pointer-events: none;' },
            div({ class: 'staff-tile-img-box' }, img({ src: imgSrc, alt: altText || '' })),
            h4({ class: 'staff-tile-name' }, `${name.split('-')[0]} - `, br(), name.split('-')[1]),
            div({ class: 'staff-tile-title' }, title),
          ),
          div(
            { class: 'staff-tile-contacts' },
            phone ? a(
              { href: phone, class: 'staff-tile-contact-icon' },
              i({ class: 'fa fa-phone' }),
            ) : null,
            email ? a(
              { href: email, class: 'staff-tile-contact-icon' },
              i({ class: 'fa fa-envelope' }),
            ) : null,
            facebookSrc ? a(
              { href: facebookSrc, class: 'staff-tile-contact-icon' },
              i({ class: 'fa fa-facebook' }),
            ) : null,
            youtubeSrc ? a(
              { href: youtubeSrc, class: 'staff-tile-contact-icon' },
              i({ class: 'fa fa-youtube' }),
            ) : null,
            twitterSrc ? a(
              { href: twitterSrc, class: 'staff-tile-contact-icon' },
              i({ class: 'fa fa-x-twitter' }),
            ) : null,
            instagramSrc ? a(
              { href: instagramSrc, class: 'staff-tile-contact-icon' },
              i({ class: 'fa fa-instagram' }),
            ) : null,
          ),
        ),
      );
    } else {
      const $li = li();
      while (row.firstElementChild) $li.append(row.firstElementChild);
      [...$li.children].forEach((divEl) => {
        if (divEl.children.length === 1 && divEl.querySelector('picture')) divEl.className = 'cards-card-image';
        else divEl.className = 'cards-card-body';
      });
      $ul.append($li);
    }
  });
  $ul.querySelectorAll('picture > img').forEach((imgEl) => imgEl.closest('picture').replaceWith(createOptimizedPicture(imgEl.src, imgEl.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append($ul);
}
