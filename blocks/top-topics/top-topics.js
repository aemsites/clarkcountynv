// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { getViewPort } from '../../scripts/utils.js';
import {
  a,
} from '../../scripts/dom-helpers.js';

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);
    const isNotSearchTab = id.indexOf('try-searching') === -1;

    // decorate tabpanel
    const tabpanel = block.children[i];
    if (isNotSearchTab) {
      tabpanel.className = 'tabs-panel';
      tabpanel.id = `tabpanel-${id}`;
      tabpanel.setAttribute('aria-hidden', !!i);
      tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
      tabpanel.setAttribute('role', 'tabpanel');
      if (!hasWrapper(tabpanel.lastElementChild)) {
        tabpanel.lastElementChild.innerHTML = `<p>${tabpanel.lastElementChild.innerHTML}</p>`;
      }
    } else {
      tabpanel.className = 'tabs-panel';
      tabpanel.setAttribute('role', 'none');
    }

    // build tab button
    let button = null;
    //const button = document.createElement('button');
    if (isNotSearchTab) {
      button = document.createElement('button');
      button.className = 'tabs-tab';
      button.id = `tab-${id}`;
      button.setAttribute('aria-controls', `tabpanel-${id}`);
      button.setAttribute('aria-selected', !i);
      button.setAttribute('role', 'tab');
      button.setAttribute('type', 'button');
    } else {
      button = document.createElement('div');
      button.classList.add('tab-search');
      button.setAttribute('role', 'none');
    }
    button.innerHTML = tab.innerHTML;
    if (isNotSearchTab) {
      button.addEventListener('mouseover', () => {
        block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
          panel.setAttribute('aria-hidden', true);
        });
        tablist.querySelectorAll('button').forEach((btn) => {
          if (btn.hasAttribute('role') && btn.getAttribute('role') === 'tab') {
            btn.setAttribute('aria-selected', false);
          }
        });
        tabpanel.setAttribute('aria-hidden', false);
        if (button.hasAttribute('role') && button.getAttribute('role') !== 'none') {
          button.setAttribute('aria-selected', true);
        }
        const viewPort = getViewPort();
        if (viewPort === 'mobile') {
          button.parentNode.insertBefore(tabpanel, button.nextSibling);
          const tabLength = (tabpanel.querySelectorAll('li').length);
          const height = document.querySelector(':root');
          if (tabLength < 3) {
            height.style.setProperty('--tab-height', '150px');
          } else if (tabLength < 5) {
            height.style.setProperty('--tab-height', '200px');
          } else if (tabLength < 8) {
            height.style.setProperty('--tab-height', '300px');
          } else if (tabLength > 7) {
            height.style.setProperty('--tab-height', '450px');
          }
          button.addEventListener('click', () => {
            button.parentNode.insertBefore(tabpanel, button.nextSibling);
          });
        } else {
          block.append(tabpanel);
        }
      });
    }
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);

  const search = block.querySelector('.tab-search');
  if (search) {
    const anchor = search.querySelector('a');
    anchor?.classList.add('button', 'secondary');
    const img = search.querySelector('img');
    if (img && !img.alt) {
      img.alt = 'Top topics search icon';
    }
  }

  function resizeAction() {
    const viewPort = getViewPort();
    if (viewPort === 'desktop') {
      block.querySelectorAll('[role=tabpanel]').forEach((tabpanel) => {
        block.append(tabpanel);
      });
    }
  }
  // if ((block.parentNode.nextSibling.querySelector('p').textContent).includes('search') && (block.parentNode.nextSibling.querySelector('picture'))) {
  //   const searchImg = block.parentNode.nextSibling.querySelector('picture');
  //   const searchImgLink = a();
  //   searchImgLink.href = '/search';
  //   searchImgLink.title = 'Search';
  //   searchImg.after(searchImgLink);
  //   searchImgLink.append(searchImg);
  // }
  window.addEventListener('resize', resizeAction);
}
