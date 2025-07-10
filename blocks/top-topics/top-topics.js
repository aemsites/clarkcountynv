// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { getViewPort } from '../../scripts/utils.js';
import { button, div } from '../../scripts/dom-helpers.js';

const handleToggle = (event) => {
  const currentTabBtn = event.target;
  if (currentTabBtn.getAttribute('aria-selected') === 'true') {
    return;
  }
  const isDesktopViewport = getViewPort() === 'desktop';
  const block = currentTabBtn.closest('.block');
  const layout = isDesktopViewport ? block?.querySelector('.top-topics-desktop') : block?.querySelector('.top-topics-mobile');
  
  // reset old 
  const prevTabBtn = layout.querySelector('.tabs-tab[aria-selected="true"]');
  prevTabBtn?.setAttribute('aria-selected', 'false');
  const prevTabPanel = layout.querySelector('.tabs-panel[aria-hidden="false"]');
  prevTabPanel?.setAttribute('aria-hidden', 'true');

  // show new
  if (currentTabBtn.getAttribute('aria-selected') === 'false') {
    currentTabBtn.setAttribute('aria-selected', 'true');
    const currentTabBtnControlsId = currentTabBtn.getAttribute('aria-controls');
    if (currentTabBtnControlsId) {
      const currentTabPanel = layout.querySelector(`.tabs-panel[id="${currentTabBtnControlsId}"]`);
      currentTabPanel?.setAttribute('aria-hidden', 'false');
    }
  }
};

export default async function decorate(block) {

  const isMobileViewport = getViewPort() === 'mobile';
  const desktopLayout = div({ class: 'top-topics-desktop' });
  const desktopSideNav = div({ class: 'sidenav' });
  const desktopMainContent = div({ class: 'main-content' });
  const desktopContentFrag = document.createDocumentFragment();
  const mobileContentFrag = document.createDocumentFragment();
  const contentFragmentWrapper = document.createDocumentFragment();
  const mobileLayout = div({ class: 'top-topics-mobile' });

  // build desktop/mobile tablist
  const desktopTabList = div({ class: 'tabs-list', role: 'tablist' });
  const mobileTabList = div({ class: 'tabs-list', role: 'tablist' });

  [...block.children].forEach((row, rowIndex) => {

    // tab
    const tab = row.firstElementChild;
    const id = toClassName(tab.textContent);
    const isNotSearchTab = id.indexOf('try-searching') === -1;
    const tabBtn = button(
      { 
        class: isNotSearchTab ? 'tabs-tab' : 'search-btn',
        type: 'button',
        role: isNotSearchTab ? 'tab' : 'none',
        ...(isNotSearchTab && { id: `tab-${id}` }),
        ...(isNotSearchTab && { 'aria-selected': (isMobileViewport ? false : (rowIndex === 0))}),
        ...(isNotSearchTab && { 'aria-controls': `tabpanel-${id}` }),
      }
    );

    const searchBtn = tab.querySelector('a');
    if (searchBtn) {
      searchBtn.classList.add('button', 'secondary');
      const img = searchBtn.querySelector('img');
      if (img && !img.alt) {
        img.alt = 'Top topics search icon';
      }
    }
    
    tabBtn.innerHTML = tab.innerHTML;
    desktopTabList.append(tabBtn);
    mobileTabList.append(tabBtn.cloneNode(true));

    // tabpanel
    const content = row.children.length > 1 ? row.children[1] : [];
    const tabPanel = div(
      {
        class: 'tabs-panel',
        id: `tabpanel-${id}`,
        'aria-hidden': (isMobileViewport ? true : (rowIndex !== 0)),
        'aria-labelledby': `tab-${id}`,
      }
    );

    tabPanel.append(content);
    desktopContentFrag.append(tabPanel);
    mobileContentFrag.append(tabPanel.cloneNode(true));
    mobileTabList.append(mobileContentFrag);

  });

  // Desktop 
  desktopSideNav.append(desktopTabList);
  desktopMainContent.append(desktopContentFrag);
  desktopLayout.append(desktopSideNav, desktopMainContent);

  // Mobile
  mobileLayout.append(mobileTabList);
  contentFragmentWrapper.append(desktopLayout, mobileLayout);

  block.innerHTML = '';
  block.append(contentFragmentWrapper);

  // Event listeners
  const desktopTabs = desktopLayout.querySelectorAll('.tabs-tab');
  const mobileTabs = mobileLayout.querySelectorAll('.tabs-tab');
  desktopTabs?.forEach((btn) => btn.addEventListener('mouseover', handleToggle));
  mobileTabs?.forEach((btn) => btn.addEventListener('click', handleToggle));

  // TODO: Add resize event
}
