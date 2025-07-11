// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { getViewPort } from '../../scripts/utils.js';
import { button, div } from '../../scripts/dom-helpers.js';

class AccordionTabs {
  constructor(block) {
    this.block = block;
    this.desktopLayout = block.querySelector('.top-topics-desktop');
    this.mobileLayout = block.querySelector('.top-topics-mobile');
    this.tabList = this.desktopLayout.querySelector('[role="tablist"]');
    this.mobileTabList = this.mobileLayout.querySelector('[role="tablist"]');
    this.tabs = Array.from(this.desktopLayout.querySelectorAll('[role="tab"]'));
    this.mobileTabs = Array.from(this.mobileLayout.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.desktopLayout.querySelectorAll('[role="tabpanel"]'));
    this.mobilePanels = Array.from(this.mobileLayout.querySelectorAll('[role="tabpanel"]'));
    this.searchLink = this.desktopLayout.querySelector('.search-btn a');
    this.allNavigableElements = [...this.tabs, this.searchLink];
    this.currentIndex = 0;
    this.isMobileViewport = getViewPort() === 'mobile';

    this.init();
  }

  init() {
    // Add event listeners
    this.tabList.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.tabList.addEventListener('click', (e) => this.handleClick(e));
    this.mobileTabList.addEventListener('click', (e) => this.handleClick(e));

    // Add hover listeners to tabs
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('mouseenter', () => this.handleTabHover(index));
    });

    // Add tab navigation to panels
    this.panels.forEach((panel, index) => {
      panel.addEventListener('keydown', (e) => this.handlePanelKeyDown(e, index));
    });

    // Set initial state
    this.setActiveTab(0);
  }

  // Handle mouse hover on tabs
  handleTabHover(index) {
    this.setActiveTab(index);
  }

  // Get all focusable elements within a panel
  static getFocusableElements(panel) {
    return Array.from(panel.querySelectorAll('a[href]'));
  }

  // Handle keyboard navigation within tab panels
  handlePanelKeyDown(event, panelIndex) {
    if (event.key !== 'Tab') return;

    const panel = this.panels[panelIndex];
    const focusableElements = AccordionTabs.getFocusableElements(panel);

    if (focusableElements.length === 0) return;

    const currentElement = document.activeElement;
    const currentElementIndex = focusableElements.indexOf(currentElement);

    // If we're on the last focusable element and pressing Tab (forward)
    if (!event.shiftKey && currentElementIndex === focusableElements.length - 1) {
      // If this is the last tab, move to search link
      if (panelIndex === this.tabs.length - 1) {
        event.preventDefault();
        this.searchLink.focus();
      } else {
        // Move to next tab
        const nextTabIndex = (panelIndex + 1) % this.tabs.length;
        event.preventDefault();
        this.setActiveTab(nextTabIndex);
        this.tabs[nextTabIndex].focus();
      }
    } else if (event.shiftKey && currentElementIndex === 0) {
      // If we're on the first focusable element and pressing Shift+Tab (backward)
      // Move to previous tab
      const prevTabIndex = panelIndex === 0 ? this.tabs.length - 1 : panelIndex - 1;
      event.preventDefault();
      this.setActiveTab(prevTabIndex);
      this.tabs[prevTabIndex].focus();
    } else if (event.shiftKey && currentElement === panel) {
      // If we're on the panel itself (no focusable elements focused) and pressing Shift+Tab
      // Move to current tab
      event.preventDefault();
      this.tabs[panelIndex].focus();
    }
  }

  handleKeyDown(event) {
    const { key } = event;
    const currentElement = document.activeElement;
    const currentElementIndex = this.allNavigableElements.indexOf(currentElement);
    let newIndex;

    switch (key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = (currentElementIndex + 1) % this.allNavigableElements.length;
        this.focusNavigableElement(newIndex);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentElementIndex === 0 ? (
          this.allNavigableElements.length - 1
        ) : currentElementIndex - 1;
        this.focusNavigableElement(newIndex);
        break;
      case 'Home':
        event.preventDefault();
        this.focusNavigableElement(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusNavigableElement(this.allNavigableElements.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (currentElement === this.searchLink) {
          // Let the link handle the navigation
          window.location.href = this.searchLink.href;
        }
        // For tabs, they're already active due to focus
        return;
      case 'Tab':
        // Allow natural tab flow into panel content for tabs only
        if (!event.shiftKey && this.tabs.includes(currentElement)) {
          const tabIndex = this.tabs.indexOf(currentElement);
          const activePanel = this.panels[tabIndex];
          const focusableElements = AccordionTabs.getFocusableElements(activePanel);

          if (focusableElements.length > 0) {
            event.preventDefault();
            focusableElements[0].focus();
          }
        }
        break;
      default:
    }
  }

  focusNavigableElement(index) {
    // Update tabindex for all elements
    this.allNavigableElements.forEach((element, i) => {
      element.setAttribute('tabindex', i === index ? '0' : '-1');
    });

    // Focus the element
    this.allNavigableElements[index].focus();

    // If it's a tab, make it active
    if (this.tabs.includes(this.allNavigableElements[index])) {
      const tabIndex = this.tabs.indexOf(this.allNavigableElements[index]);
      this.setActiveTab(tabIndex);
    }
  }

  handleClick(event) {
    const clickedTab = event.target.closest('[role="tab"]');
    if (!clickedTab) return;

    const newIndex = getViewPort() !== 'mobile' ? this.tabs.indexOf(clickedTab) : this.mobileTabs.indexOf(clickedTab);
    if (newIndex !== -1) {
      this.setActiveTab(newIndex, event);
    }
  }

  setActiveTab(index, event) {
    const isEventUndefined = typeof event === 'undefined';
    if (index < 0 || index >= this.tabs.length) return;

    // Update current index
    this.currentIndex = index;

    // Update tabs
    if (!this.isMobileViewport) {
      this.tabs.forEach((tab, i) => {
        const isActive = i === index;
        tab.setAttribute('aria-selected', isActive);
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      // Update panels - both visibility and accessibility
      this.panels.forEach((panel, i) => {
        const isActive = i === index;
        panel.setAttribute('aria-hidden', !isActive);

        // Set tabindex for panel content navigation
        panel.setAttribute('tabindex', isActive ? '0' : '-1');
      });
    } else {
      this.mobileTabs.forEach((tab, i) => {
        const isActive = i === index;
        tab.setAttribute('aria-selected', isEventUndefined ? false : isActive);
        // eslint-disable-next-line no-nested-ternary
        tab.setAttribute('tabindex', isEventUndefined ? '-1' : (isActive ? '0' : '-1'));
      });

      // Update panels - both visibility and accessibility
      this.mobilePanels.forEach((panel, i) => {
        const isActive = i === index;
        panel.setAttribute('aria-hidden', isEventUndefined ? true : !isActive);

        // Set tabindex for panel content navigation
        // eslint-disable-next-line no-nested-ternary
        panel.setAttribute('tabindex', isEventUndefined ? '-1' : (isActive ? '0' : '-1'));
      });
    }
  }

  // Programmatically set active tab
  activateTab(index) {
    this.setActiveTab(index);
    this.tabs[index].focus();
  }
}

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
        ...(isNotSearchTab && { 'aria-selected': (isMobileViewport ? false : (rowIndex === 0)) }),
        ...(isNotSearchTab && { 'aria-controls': `tabpanel-${id}` }),
        // eslint-disable-next-line no-nested-ternary
        ...(isNotSearchTab && { tabindex: `${(isMobileViewport ? -1 : (rowIndex === 0 ? 0 : -1))}` }),
      },
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
        // eslint-disable-next-line no-nested-ternary
        ...(isNotSearchTab && { tabindex: `${(isMobileViewport ? -1 : (rowIndex === 0 ? 0 : -1))}` }),
      },
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

  return new AccordionTabs(block);
}
