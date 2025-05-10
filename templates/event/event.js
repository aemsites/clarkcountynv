// eslint-disable-next-line no-unused-vars,no-empty-function

import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';

function decorateHeroSection(element) {
  const section = element.querySelector('.section.hero');
  if (section) {
    const checkAElement = section.querySelector('a');
    if (checkAElement) {
      const backgroundPic = createOptimizedPicture(checkAElement);
      section.textContent = '';
      section.append(backgroundPic);
    }
  }
}

export default async function decorate(doc) {
  doc.querySelector('header').classList.add('displayoff');
  doc.querySelector('footer').classList.add('displayoff');
  doc.body.classList.add('event');
  decorateHeroSection(doc);

  const titleText = getMetadata('featuredtitle');
  doc.querySelector('.title').innerHTML = `<h2>${titleText}</h2>`;

  const featuredImage = getMetadata('featuredimage');
  const imageBlock = doc.querySelector('.image');
  if (imageBlock) {
    imageBlock.innerHTML = `<img src="${featuredImage}">`;
  }

  const address = doc.querySelector('.section.address');
  if (address?.children?.length === 0) {
    address.remove();
  }

  const locations = doc.querySelector('.section.locations');
  if (locations?.children?.length === 0) {
    locations.remove();
  }

  const descriptionEl = doc.querySelector('.section.description');

  if (descriptionEl?.children.length === 0) {
    descriptionEl.append(getMetadata('featureddescription'));
  }
  descriptionEl?.querySelectorAll('a[href$=".jpg"], a[href$=".png"], a[href$=".jpeg"], a[href$=".gif"]').forEach((aEl) => {
    if (['jpg', 'jpeg', 'png', 'gif'].some((ext) => aEl.textContent.trim().endsWith(ext))) {
      const picture = createOptimizedPicture(aEl.href, aEl.href.split('/').pop());
      const parent = aEl.parentElement;
      if (parent.tagName === 'P' && parent.children.length === 1) {
        parent.replaceWith(picture);
      } else {
        aEl.replaceWith(picture);
      }
    }
  });

  if (descriptionEl?.children?.length === 0) {
    descriptionEl.remove();
  }

  // Configuring a POST Message on scrolling to send the event title to the parent window
  (() => {
    let lastState = { eventtop: null, eventfooter: null };
    let ticking = false;
    const BOTTOM_THRESHOLD = 10;

    function checkScrollState() {
      const { scrollY } = window;
      const viewportHeight = window.innerHeight;
      const pageHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      );

      // Calculate total scrollable height
      const scrollableHeight = pageHeight - viewportHeight;
      const MIN_SCROLL_THRESHOLD = 50; // Increased threshold for minimal scroll

      let newState = { eventtop: null, eventfooter: null };

      if (scrollableHeight <= MIN_SCROLL_THRESHOLD) {
        // If scroll area is very small (<=50px), treat it as no scroll
        newState = { eventtop: 'on', eventfooter: 'on' };
      } else {
        const nearTop = scrollY <= 100;
        const nearBottom = (
          scrollY > 0 // Ensure we've scrolled at least a bit
          && (scrollableHeight - scrollY <= BOTTOM_THRESHOLD // Either near absolute bottom
           || scrollY >= (scrollableHeight - MIN_SCROLL_THRESHOLD)) // within min scroll threshold
        );

        if (nearTop) {
          newState = { eventtop: 'on', eventfooter: 'off' };
        } else if (nearBottom) {
          newState = { eventtop: 'off', eventfooter: 'on' };
        } else {
          newState = { eventtop: 'off', eventfooter: 'off' };
        }
      }

      // Only post message if state actually changed
      if (
        newState.eventtop !== lastState.eventtop
        || newState.eventfooter !== lastState.eventfooter
      ) {
        window.parent.postMessage(newState, '*');
        lastState = newState;
      }

      ticking = false;
    }

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(checkScrollState);
        ticking = true;
      }
    }

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Check state after all content (including images) is loaded
    window.addEventListener('load', () => {
      // Wait a brief moment for any final layout calculations
      setTimeout(checkScrollState, 100);
    });

    // Handle resize events which might change the need for scrolling
    window.addEventListener('resize', handleScroll);

    // Check state when DOM is ready but wait for images
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Initial check but also wait for images
        setTimeout(checkScrollState, 100);
      });
    } else {
      // If DOM is already ready, just do the check
      setTimeout(checkScrollState, 100);
    }
  })();
}
