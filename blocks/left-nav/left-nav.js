import { loadCSS } from '../../scripts/aem.js';

export class AccessibleLeftNav {
  constructor(navElement) {
    this.nav = navElement;
    this.init();
  }

  init() {
    this.setupNavigationStructure();
    this.setupKeyboardNavigation();
    this.checkForActivePage();

    // If we are inside of left-nav fragment preview mode, add class
    if (window.location.pathname.endsWith('/fragments/left-nav')) {
      this.addPreviewClass();
    }

    // Init component block for sidekick library page
    if (this.nav.classList.contains('sidekick-library')) {
      this.sidekickPageInit();
    }
  }

  addPreviewClass() {
    this.nav.classList.add('in-preview');
  }

  checkForActivePage() {
    const links = this.nav.querySelectorAll('a');
    links?.forEach((link) => {
      if (link.href === window.location.href) {
        link.classList.add('active');
      }
    });
  }

  sidekickPageInit() {
    const sidekickMain = this.nav.closest('main.sidekick-library');
    if (sidekickMain) {
      const leftSection = sidekickMain.querySelector('.leftsection');
      if (leftSection) {
        // Create mainmenu wrapper and append left + right sections
        const mainMenu = document.createElement('div');
        mainMenu.classList.add('mainmenu');
        leftSection.parentNode.insertBefore(mainMenu, leftSection);
        const rightSection = document.createElement('div');
        rightSection.classList.add('rightsection');
        mainMenu.append(leftSection, rightSection);

        // load CSS from default template for 2 column layout
        loadCSS(`${window.hlx.codeBasePath}/templates/default/default.css`);
      }
    }
  }

  setupNavigationStructure() {
    // Find the main navigation container
    const mainNav = this.nav.querySelector('nav') || this.nav;

    // Set up the tree structure
    const topLevelList = mainNav.querySelector('ul');
    if (topLevelList) {
      topLevelList.setAttribute('role', 'tree');
      topLevelList.setAttribute('aria-label', 'Left navigation');

      // Add level classes to all ul elements
      this.assignLevelClasses(topLevelList, 1);
    }

    // Process all list items
    const allListItems = mainNav.querySelectorAll('li');
    allListItems.forEach((li) => {
      li.setAttribute('role', 'treeitem');

      // Check if this item has children
      const childList = li.querySelector('ul');
      if (childList) {
        this.setupExpandableItem(li, childList);
      } else {
        // Simple link item
        const link = li.querySelector('a');
        if (link) {
          li.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Set up nested lists
    const nestedLists = mainNav.querySelectorAll('ul ul');
    nestedLists.forEach((list) => {
      list.setAttribute('role', 'group');
      list.setAttribute('aria-hidden', 'true');
    });
  }

  assignLevelClasses(list, level) {
    // Add the level class to the current list
    list.classList.add(`level-${level}`);

    // Find all direct child lists and recursively assign level classes
    const childLists = list.querySelectorAll(':scope > li > ul');
    childLists.forEach((childList) => {
      this.assignLevelClasses(childList, level + 1);
    });
  }

  setupExpandableItem(listItem, childList) {
    const link = listItem.querySelector('a');
    if (!link) return;

    // Mark the list item as having children
    listItem.classList.add('has-children');
    listItem.setAttribute('aria-expanded', 'false');

    // Enhance the existing link for dual functionality
    link.setAttribute('role', 'button');
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-controls', this.generateId());
    link.setAttribute('aria-haspopup', 'true');

    // Set the ID on the child list
    childList.id = link.getAttribute('aria-controls');

    // Wrap the existing text in a span for styling
    const originalText = link.textContent;
    link.innerHTML = '';

    const textSpan = document.createElement('span');
    textSpan.className = 'nav-text';
    textSpan.textContent = originalText;

    // Check if left nav text has a11y helper text - if so remove.
    const toggleText = 'Toggle  submenu';
    const toggleRegex = new RegExp(toggleText);
    if (toggleRegex.test(textSpan.textContent)) {
      textSpan.textContent = textSpan.textContent.replace(/Toggle\s+submenu/, '').trim();
    }

    const caret = document.createElement('svg');
    caret.className = 'nav-caret';
    caret.setAttribute('viewBox', '0 0 16 16');
    caret.setAttribute('aria-hidden', 'true');
    caret.innerHTML = '<path d="M6 4l4 4-4 4V4z"/>';

    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = `Toggle ${link.textContent} submenu`;

    link.appendChild(textSpan);
    link.appendChild(caret);
    link.appendChild(srText);

    // Add click handler with dual functionality
    link.addEventListener('click', (e) => {
      // Check if click was on the caret area (right side of link)
      const rect = link.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const caretArea = rect.width - 60;

      if (clickX > caretArea) {
        // Click was on caret - toggle submenu
        e.preventDefault();
        this.toggleSubmenu(listItem, link, childList, caret);
      }
      // Otherwise, let the link navigate normally
    });

    // Add keyboard handler for toggle functionality
    link.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        this.toggleSubmenu(listItem, link, childList, caret);
      }
      // Enter key will navigate to the link (default behavior)
    });
  }

  // eslint-disable-next-line class-methods-use-this
  toggleSubmenu(listItem, button, childList, caret) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      // Collapse
      button.setAttribute('aria-expanded', 'false');
      listItem.setAttribute('aria-expanded', 'false');
      childList.classList.remove('expanded');
      childList.setAttribute('aria-hidden', 'true');
      caret.classList.remove('expanded');
    } else {
      // Expand
      button.setAttribute('aria-expanded', 'true');
      listItem.setAttribute('aria-expanded', 'true');
      childList.classList.add('expanded');
      childList.setAttribute('aria-hidden', 'false');
      caret.classList.add('expanded');
    }
  }

  setupKeyboardNavigation() {
    const treeItems = this.nav.querySelectorAll('[role="treeitem"]');

    treeItems.forEach((item, index) => {
      const focusableElement = item.querySelector('a');
      if (!focusableElement) return;

      focusableElement.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            this.focusNextItem(treeItems, index);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.focusPrevItem(treeItems, index);
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.handleRightArrow(item);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            this.handleLeftArrow(item);
            break;
          case 'Enter':
            break;
          case ' ':
            if (item.classList.contains('has-children')) {
              e.preventDefault();
              const link = item.querySelector('a');
              const childList = item.querySelector('ul');
              const caret = link.querySelector('.nav-caret');
              this.toggleSubmenu(item, link, childList, caret);
            }
            break;
          case 'Home':
            e.preventDefault();
            this.focusFirstItem(treeItems);
            break;
          case 'End':
            e.preventDefault();
            this.focusLastItem(treeItems);
            break;
          default:
            break;
        }
      });
    });
  }

  handleRightArrow(item) {
    if (item.classList.contains('has-children')) {
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      if (!isExpanded) {
        const link = item.querySelector('a');
        const childList = item.querySelector('ul');
        const caret = link.querySelector('.nav-caret');
        this.toggleSubmenu(item, link, childList, caret);
      }
    }
  }

  handleLeftArrow(item) {
    if (item.classList.contains('has-children')) {
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        const link = item.querySelector('a');
        const childList = item.querySelector('ul');
        const caret = link.querySelector('.nav-caret');
        this.toggleSubmenu(item, link, childList, caret);
      }
    }
  }

  focusNextItem(items, currentIndex) {
    const visibleItems = this.getVisibleItems(items);
    const currentVisibleIndex = visibleItems.indexOf(items[currentIndex]);
    const nextIndex = (currentVisibleIndex + 1) % visibleItems.length;
    this.focusItem(visibleItems[nextIndex]);
  }

  focusPrevItem(items, currentIndex) {
    const visibleItems = this.getVisibleItems(items);
    const currentVisibleIndex = visibleItems.indexOf(items[currentIndex]);
    const prevIndex = currentVisibleIndex === 0 ? visibleItems.length - 1 : currentVisibleIndex - 1;
    this.focusItem(visibleItems[prevIndex]);
  }

  focusFirstItem(items) {
    const visibleItems = this.getVisibleItems(items);
    if (visibleItems.length > 0) {
      this.focusItem(visibleItems[0]);
    }
  }

  focusLastItem(items) {
    const visibleItems = this.getVisibleItems(items);
    if (visibleItems.length > 0) {
      this.focusItem(visibleItems[visibleItems.length - 1]);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getVisibleItems(items) {
    return Array.from(items).filter((item) => item.offsetParent !== null && !item.closest('[aria-hidden="true"]'));
  }

  // eslint-disable-next-line class-methods-use-this
  focusItem(item) {
    const focusableElement = item.querySelector('a');
    if (focusableElement) {
      focusableElement.focus();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  generateId() {
    return `nav-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export default function decorate(block) {
  return new AccessibleLeftNav(block);
}
