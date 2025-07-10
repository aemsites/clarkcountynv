// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { getViewPort } from '../../scripts/utils.js';
import { button, div } from '../../scripts/dom-helpers.js';

// Handle keyboard navigation within tab panels
const handlePanelKeyDown = (event) => {
  console.log('handlePanelKeyDown', event);
  if (event.key !== 'Tab') return;
  //const panel = this.panels[panelIndex];
  const desktopLayout = event.target.closest('.top-topics-desktop');
  const panel = desktopLayout.querySelector('');
  const focusableElements = this.getFocusableElements(panel);
  
  if (focusableElements.length === 0) return;
  
  const currentElement = document.activeElement;
  const currentElementIndex = focusableElements.indexOf(currentElement);
  
  // If we're on the last focusable element and pressing Tab (forward)
  if (!event.shiftKey && currentElementIndex === focusableElements.length - 1) {
      // Move to next tab
      const nextTabIndex = (panelIndex + 1) % this.tabs.length;
      event.preventDefault();
      this.setActiveTab(nextTabIndex);
      this.tabs[nextTabIndex].focus();
  }
  // If we're on the first focusable element and pressing Shift+Tab (backward)
  else if (event.shiftKey && currentElementIndex === 0) {
      // Move to previous tab
      const prevTabIndex = panelIndex === 0 ? this.tabs.length - 1 : panelIndex - 1;
      event.preventDefault();
      this.setActiveTab(prevTabIndex);
      this.tabs[prevTabIndex].focus();
  }
  // If we're on the panel itself (no focusable elements focused) and pressing Shift+Tab
  else if (event.shiftKey && currentElement === panel) {
      // Move to current tab
      event.preventDefault();
      this.tabs[panelIndex].focus();
  }
};

const handleKeyDown = (event) => {

};

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
  prevTabBtn?.setAttribute('tabindex', -1);
  const prevTabPanel = layout.querySelector('.tabs-panel[aria-hidden="false"]');
  prevTabPanel?.setAttribute('aria-hidden', 'true');
  prevTabPanel?.setAttribute('tabindex', -1);

  // show new
  if (currentTabBtn.getAttribute('aria-selected') === 'false') {
    currentTabBtn.setAttribute('aria-selected', 'true');
    currentTabBtn.setAttribute('tabindex', 0);
    const currentTabBtnControlsId = currentTabBtn.getAttribute('aria-controls');
    if (currentTabBtnControlsId) {
      const currentTabPanel = layout.querySelector(`.tabs-panel[id="${currentTabBtnControlsId}"]`);
      currentTabPanel?.setAttribute('aria-hidden', 'false');
      currentTabPanel?.setAttribute('tabindex', 0);
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
        ...(isNotSearchTab && { 'tabindex': `${(isMobileViewport ? -1 : (rowIndex === 0 ? 0 : -1))}` }),
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
        ...(isNotSearchTab && { class: 'tabs-panel' }),
        ...(isNotSearchTab && { id: `tabpanel-${id}` }),
        role: isNotSearchTab ? 'tabpanel' : 'none',
        ...(isNotSearchTab && { 'aria-hidden': (isMobileViewport ? true : (rowIndex !== 0)) }),
        ...(isNotSearchTab && { 'aria-labelledby': `tab-${id}` }),
        ...(isNotSearchTab && { 'tabindex': `${(isMobileViewport ? -1 : (rowIndex === 0 ? 0 : -1))}` }),
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
  const desktopPanels = desktopLayout.querySelectorAll('.tabs-panel');
  const desktopTablist = desktopLayout.querySelector('[role="tablist"]');
  const desktopTabs = desktopLayout.querySelectorAll('.tabs-tab');
  const mobileTabs = mobileLayout.querySelectorAll('.tabs-tab');
  desktopTabs?.forEach((btn) => btn.addEventListener('mouseover', handleToggle));
  mobileTabs?.forEach((btn) => btn.addEventListener('click', handleToggle));
  desktopTablist?.addEventListener('keydown', handleKeyDown);
  desktopPanels?.forEach((panel, index) => panel.addEventListener('keydown', (e) => handlePanelKeyDown(e, index)));

  // TODO: Add resize event
}
