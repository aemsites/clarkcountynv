import { getMetadata, toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  div, img, span, a, button, h2, iframe,
} from '../../scripts/dom-helpers.js';

function normalizeImage(str) {
  const imagePath = '/assets/images/google-translations/';
  return `${imagePath + str.replace(/[()]/g, '').replace(/[ ]/g, '-').toLowerCase()}.png`;
}

function hideGoogleTranslateBar() {
  document.body.style.top = 0;
  const element = document.querySelector('#\\:1\\.container');
  if (element) {
    element.classList.add('hidden');
  }
}

let rawkey = '';
let searchIframe = '';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
const tracker = [];

function decorateGoogleTranslator(languageTool) {
  languageTool.querySelectorAll('li').forEach((li, i) => {
    const textArray = li.textContent.split(' ');
    const dataCode = textArray[0];
    const dataLang = textArray[1];
    textArray.splice(0, 2);
    const dataText = textArray.join(' ');
    const aTag = a({ class: `${dataLang}`, href: '#' }, dataText);
    aTag.setAttribute('data-code', dataCode);
    aTag.setAttribute('data-lang', dataLang);
    li.innerHTML = '';
    li.appendChild(aTag);
    if (i === 0) {
      li.classList.add('selected');
    }
  });
}

function letsTranslate(ele) {
  const selectField = document.querySelector('select.goog-te-combo');
  selectField.value = ele.querySelector('a').getAttribute('data-lang');
  selectField.dispatchEvent(new Event('change'));
  hideGoogleTranslateBar();
}

/* Search Implementation */
function decorateSearchBox(searchBox) {
  searchBox.innerHTML = `
    <div class="search-top">
      <div class="searchHeaderBtn"></div>
      <h2 class="search-menu-header">Search</h2>
      <p class="search-menu-helper-text">Search for a page, department, or by keyword.</p>
      <div class="search-top-right">
        <button type="button" class="button secondary search-close">
          <img src="/icons/mega-menu-close.svg" alt="Close search menu" />
        </button>
      </div>
    </div>
    <div class="search-form-wrap">
      <form class="search-form" method="GET" action="search" role="search" aria-label="sitewide">
        <label for="search-input"><span class="sr-only">Search</span></label>
        <input name="q" class="form-control search-input" placeholder="Search" type="search" id="search-input">
        <button type="button" class="search-btn">
          <img src="/icons/search-white.svg" alt="Search button icon"/>
          Search
        </button>
      </form>
      <div class="search-results off" style="">
        <div class="tab-content clearfix">
          <div class="tab-pane off" id="search-3">
            <h3 class="search-results-all-header">All of Clark County</h3>
            <div class="g-search-wrap">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-middle">
      <div class="search-middle-left">
        <div class="searchHeaderBtn"></div>
        <h3 class="search-menu-popular-header">Popular Search Terms</h3>
      </div>
    </div>`;
}

function showSearch(ele, tabContent) {
  ele.querySelector('a').classList.add('active');
  const targetId = ele.querySelector('a').getAttribute('id');
  tabContent.querySelectorAll('.tab-pane').forEach((tab) => {
    if (tab.getAttribute('id') !== targetId) {
      tab.classList.add('off');
    } else {
      tab.classList.remove('off');
      if (targetId === 'search-2') {
        const addIframe = iframe();
        addIframe.src = `https://clarkcountynv.gov/_assets_/plugins/search-box.html?q=${rawkey}%20filetype:doc%20OR%20filetype:pdf%20OR%20filetype:docx`;
        if (!tab.querySelector('.g-search-wrap').querySelector('iframe')) {
          tab.querySelector('.g-search-wrap').appendChild(addIframe);
        }
      } else if (targetId === 'search-3') {
        const addIframe = iframe();
        addIframe.src = `https://www.clarkcountynv.gov/_assets_/plugins/search-box.html?q=${rawkey}`;
        if (!tab.querySelector('.g-search-wrap').querySelector('iframe')) {
          tab.querySelector('.g-search-wrap').appendChild(addIframe);
        }
      }
    }
  });
}

function enableTabbing(searchBox) {
  const tabContent = searchBox.querySelector('.search-results .tab-content');
  searchBox.querySelectorAll('.search-results .search-nav li').forEach((ele) => {
    if (ele.querySelector('a')) {
      ele.querySelector('a').addEventListener('click', () => {
        showSearch(ele, tabContent);
      });
    }
  });
}

function handleNavTools(navWrapper) {
  let buttonInnerText = 'English';
  let imgSrc = normalizeImage('english');
  const tools = [];
  tools[0] = navWrapper.querySelector('.nav-tools .default-content-wrapper p');
  tools[1] = navWrapper.querySelector('.nav-tools .default-content-wrapper ul:first-of-type');
  tools[2] = navWrapper.querySelector('.nav-tools .default-content-wrapper ul:last-of-type');
  if (tools && tools.length === 3) {
    const searchTool = tools[0];
    const searchPopularList = tools[1];
    const languageTool = tools[2];
    const nav = document.querySelector('.nav-wrapper nav');
    const searchDiv = div({ class: 'nav-search' });
    const searchButton = button({ type: 'button', class: 'nav-search-button' }, searchTool.innerText);
    const searchButtonIcon = img({ src: '/icons/search-white.svg', class: 'nav-search-icon', alt: 'Search Icon' });
    searchButton.prepend(searchButtonIcon);
    searchDiv.append(searchButton);
    const searchBox = div({ class: 'search-box' });
    decorateSearchBox(searchBox);
    searchBox.querySelector('.search-middle-left').appendChild(searchPopularList);
    searchPopularList.classList.add('popular-searches-list');
    searchBox.classList.add('hidden');
    searchDiv.appendChild(searchBox);
    searchButton.addEventListener('click', () => {
      searchButton.classList.add('active');
      if (searchBox.classList.contains('hidden')) {
        searchBox.classList.remove('hidden');
        searchBox.querySelector('input').value = '';
        searchBox.querySelector('.search-results').classList.add('off');
        searchBox.querySelector('.tab-pane').classList.add('off');
      } else {
        searchBox.classList.add('hidden');
        searchBox.querySelector('input').value = '';
        searchBox.querySelector('.search-results').classList.add('off');
        searchBox.querySelector('.tab-pane').classList.add('off');
      }
    });
    searchBox.querySelector('.search-top-right').addEventListener('click', () => {
      searchBox.querySelector('input').value = '';
      searchBox.classList.add('hidden');
      if (searchButton.classList.contains('active')) {
        searchButton.classList.remove('active');
      }
    });

    searchBox.querySelector('input').addEventListener('input', (key) => {
      key.preventDefault();
      rawkey = key.target.value;
      enableTabbing(searchBox);
      if (rawkey.length > 2) {
        searchBox.querySelector('.search-results').classList.remove('off');
        searchBox.querySelector('.tab-pane').classList.remove('off');
        const tabContent = searchBox.querySelector('.search-results .tab-content');
        const tab = tabContent.querySelector('.tab-pane');
        const addIframe = iframe();
        addIframe.src = `/search-header?q=${rawkey}`;
        addIframe.title = 'Clark County Search Results';
        if (!searchIframe) {
          tab.querySelector('.g-search-wrap').appendChild(addIframe);
          searchIframe = tab.querySelector('.g-search-wrap').querySelector('iframe');
        } else {
          searchIframe.src = `/search-header?q=${rawkey}`;
        }
      }
    });

    searchBox.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      if (searchBox.querySelector('.search-results').classList.contains('off')) {
        searchBox.querySelector('.search-results').classList.remove('off');
        searchBox.querySelector('.tab-pane').classList.remove('off');
        const tabContent = searchBox.querySelector('.search-results .tab-content');
        const tab = tabContent.querySelector('.tab-pane');
        const addIframe = iframe();
        addIframe.src = `/search-header?q=${rawkey}`;
        addIframe.title = 'Clark County Search Results';
        if (!searchIframe) {
          tab.querySelector('.g-search-wrap').appendChild(addIframe);
          searchIframe = tab.querySelector('.g-search-wrap').querySelector('iframe');
        } else {
          searchIframe.src = `/search-header?q=${rawkey}`;
        }
      }
    });

    const languageDiv = div({ class: 'nav-language' });
    languageDiv.setAttribute('id', 'google-translate-wrap');
    const languageDiv1 = div({ class: 'google-translate' });
    languageDiv1.setAttribute('id', 'google_translate_element');
    languageDiv.appendChild(languageDiv1);
    decorateGoogleTranslator(languageTool);
    const languageButton = button({ class: 'translate-button' }, span('US'), img());
    languageButton.querySelector('img').src = normalizeImage('en');
    languageButton.querySelector('img').alt = 'Translate Icon';
    languageDiv.appendChild(languageButton);
    languageDiv.appendChild(languageTool);
    languageTool.querySelectorAll('li').forEach((ele, _, lis) => {
      ele.addEventListener('click', () => {
        buttonInnerText = ele.querySelector('a').getAttribute('data-code');
        imgSrc = ele.querySelector('a').getAttribute('data-lang');
        languageButton.querySelector('span').textContent = buttonInnerText;
        languageButton.querySelector('img').src = normalizeImage(imgSrc);
        lis.forEach((li) => {
          li.classList.toggle('selected', li === ele);
        });
        letsTranslate(ele);
      });
    });
    languageButton.addEventListener('click', () => {
      languageTool.classList.toggle('show');
    });
    nav.appendChild(searchDiv);
    nav.appendChild(languageDiv);
    navWrapper.querySelector('nav .nav-tools').remove();
  }
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function switchToTab(tabButton, currentMegaMenu) {
  console.log('in switchToTab');
  if (!tabButton || !currentMegaMenu) return;

  //const tabButtons = Array.from(currentMegaMenu.querySelectorAll('.tabs-tab'));
  //const tabPanels = Array.from(currentMegaMenu.querySelectorAll('.tabs-panel'));

  const tabButtons = Array.from(currentMegaMenu.querySelectorAll('.secondary-list-item'));

  // Hide all tab buttons and panels
  tabButtons.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
  //tabButtons.forEach((btn) => btn.setAttribute('aria-selected', 'false'));
  //tabPanels.forEach((panel) => panel.setAttribute('aria-hidden', 'true'));

  // Show the selected tab button and its associated panel
  //tabButton.setAttribute('aria-selected', 'true');
  tabButton.setAttribute('aria-expanded', 'true');
  // const targetPanelId = tabButton.getAttribute('aria-controls');
  // const targetPanel = currentMegaMenu.querySelector(`#${targetPanelId}`);
  // if (targetPanel) {
  //   targetPanel.setAttribute('aria-hidden', 'false');
  // }
}

// Helper function to get the first focusable element within a nav-drop
function getFirstFocusableElement(navDrop) {
  const isDesktopViewport = window.matchMedia('(min-width: 900px)').matches;
  const focusableSelectors = [
    'button:not([disabled])',
  ];

  const focusableElements = navDrop.querySelectorAll(`${isDesktopViewport ? '.nav-in-menu-wrap' : '.nav-in-menu-wrap-mobile'} ${focusableSelectors.join(', ')}`);
  return focusableElements[0] || null;
}

// Helper function to get all focusable elements within a nav-drop
function getFocusableElements(navDrop) {
  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return Array.from(navDrop.querySelectorAll(focusableSelectors.join(', ')));
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const $button = nav.querySelector('.nav-hamburger button');
  // document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || false);
  $button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  navDrops?.forEach((drop) => {
    if (!drop.hasAttribute('tabindex')) {
      drop.setAttribute('role', 'none');
      drop.setAttribute('tabindex', 0);
    }
  });
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }

  navDrops.forEach((drop) => {
    if (drop.hasAttribute('aria-expanded') && drop.getAttribute('aria-expanded') === 'true') {
      drop.setAttribute('aria-expanded', 'false');
    }
    const mobileWrap = drop.querySelector('.nav-in-menu-wrap-mobile');
    if (mobileWrap) {
      const tabButtons = mobileWrap.querySelectorAll('.tabs-tab[aria-selected="true"]');
      tabButtons?.forEach((tabBtn) => tabBtn.setAttribute('aria-selected', 'false'));
      const tabPanels = mobileWrap.querySelectorAll('.tabs-panel[aria-hidden="false"]');
      tabPanels?.forEach((panel) => panel.setAttribute('aria-hidden', 'true'));
    }
  });
}

// Helper function to handle when reaching the end of a tab panel
function handleEndOfTabPanel(tabButtons, currentTabIndex, allNavDrops, currentNavDropIndex) {
  if (currentTabIndex < tabButtons.length - 1) {
    // Move to next tabs-tab button
    tabButtons[currentTabIndex + 1].focus();
  } else {
    // Last tab, close current nav-drop and move to next nav-drop or search
    const currentNavDrop = allNavDrops[currentNavDropIndex];
    currentNavDrop.setAttribute('aria-expanded', 'false');

    if (currentNavDropIndex < allNavDrops.length - 1) {
      // Move to next nav-drop
      allNavDrops[currentNavDropIndex + 1].focus();
    } else {
      // Last nav-drop, focus search button
      const searchButton = document.querySelector('.nav-search-button');
      if (searchButton) {
        searchButton.focus();
      }
    }
  }
}

function handleDesktopKeyboardNavigation(e, focused) {
  const allNavDrops = Array.from(document.querySelectorAll('.nav-drop'));

  // Handle nav-drop Enter key - toggle the dropdown
  if (e.code === 'Enter' && focused.classList.contains('nav-drop')) {
    e.preventDefault();

    const isExpanded = focused.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      // Close the nav-drop if it's already expanded
      focused.setAttribute('aria-expanded', 'false');
    } else {
      // Close all other nav-drops
      allNavDrops.forEach((drop) => {
        if (drop !== focused) {
          drop.setAttribute('aria-expanded', 'false');
        }
      });

      // Open the current nav-drop
      focused.setAttribute('aria-expanded', 'true');

      // Focus the first secondary-list-item
      const desktopMenu = focused.querySelector('.nav-in-menu-wrap');
      const firstSecondaryItem = desktopMenu?.querySelector('.secondary-list-item');
      if (firstSecondaryItem) {
        firstSecondaryItem.focus();
      }
    }
    return;
  }

  // Handle Tab navigation within the mega menu
  if (e.code === 'Tab') {
    const currentNavDrop = focused.closest('.nav-drop');

    if (!currentNavDrop) return;

    const currentNavDropIndex = allNavDrops.indexOf(currentNavDrop);
    const desktopMenu = currentNavDrop.querySelector('.nav-in-menu-wrap');

    if (!desktopMenu) return;

    const secondaryItems = Array.from(desktopMenu.querySelectorAll('.secondary-list-item'));
    const closeButton = currentNavDrop.querySelector('.nav-close');

    // If focused on a secondary-list-item
    if (focused.classList.contains('secondary-list-item')) {
      if (!e.shiftKey) {
        // Forward tab from secondary-list-item
        e.preventDefault();
        
        // Check if there's an anchor within the secondary-list-item-text
        const anchorInText = focused.querySelector('.secondary-list-item-text > a');
        if (anchorInText) {
          anchorInText.focus();
        } else {
          // No anchor in text, find first anchor in tertiary-list
          const tertiaryList = focused.querySelector('.tertiary-list');
          if (tertiaryList) {
            const firstTertiaryLink = tertiaryList.querySelector('a');
            if (firstTertiaryLink) {
              firstTertiaryLink.focus();
            } else {
              // No links in tertiary list, focus close button
              closeButton?.focus();
            }
          } else {
            // No tertiary list, focus close button
            closeButton?.focus();
          }
        }
      } else {
        // Shift+Tab from secondary-list-item - go to previous secondary-list-item or nav-drop
        e.preventDefault();
        const currentIndex = secondaryItems.indexOf(focused);
        if (currentIndex > 0) {
          const previousSecondaryItem = secondaryItems[currentIndex - 1];
          
          // Close current expanded item and open the previous one
          focused.setAttribute('aria-expanded', 'false');
          previousSecondaryItem.setAttribute('aria-expanded', 'true');
          previousSecondaryItem.focus();
        } else {
          // First secondary item, go back to nav-drop
          currentNavDrop.focus();
        }
      }
    } else if (focused.tagName === 'A' && focused.parentElement?.classList.contains('secondary-list-item-text')) {
      // Anchor within secondary-list-item-text
      const parentSecondaryItem = focused.closest('.secondary-list-item');
      
      if (!e.shiftKey) {
        // Forward tab from anchor in secondary-list-item-text
        e.preventDefault();
        
        // Find first anchor in tertiary-list
        const tertiaryList = parentSecondaryItem.querySelector('.tertiary-list');
        if (tertiaryList) {
          const firstTertiaryLink = tertiaryList.querySelector('a');
          if (firstTertiaryLink) {
            firstTertiaryLink.focus();
          } else {
            // No links in tertiary list, focus close button
            closeButton?.focus();
          }
        } else {
          // No tertiary list, focus close button
          closeButton?.focus();
        }
      } else {
        // Shift+Tab from anchor - go back to parent secondary-list-item
        e.preventDefault();
        parentSecondaryItem.focus();
      }
    } else if (focused.tagName === 'A' && focused.closest('.tertiary-list')) {
      // Anchor within tertiary-list
      const tertiaryList = focused.closest('.tertiary-list');
      const tertiaryLinks = Array.from(tertiaryList.querySelectorAll('a'));
      const currentLinkIndex = tertiaryLinks.indexOf(focused);

      if (!e.shiftKey) {
        // Forward tab
        if (currentLinkIndex < tertiaryLinks.length - 1) {
          // Move to next link in tertiary list
          e.preventDefault();
          tertiaryLinks[currentLinkIndex + 1].focus();
        } else {
          // Last link in tertiary list - focus close button
          e.preventDefault();
          closeButton?.focus();
        }
      } else {
        // Shift+Tab from tertiary link
        e.preventDefault();
        if (currentLinkIndex > 0) {
          // Move to previous link in tertiary list
          tertiaryLinks[currentLinkIndex - 1].focus();
        } else {
          // First link in tertiary list - go back to secondary-list-item or its anchor
          const parentSecondaryItem = focused.closest('.secondary-list-item');
          const anchorInText = parentSecondaryItem.querySelector('.secondary-list-item-text > a');
          if (anchorInText) {
            anchorInText.focus();
          } else {
            parentSecondaryItem.focus();
          }
        }
      }
    } else if (focused.classList.contains('nav-close')) {
      if (!e.shiftKey) {
        // Forward tab from close button
        e.preventDefault();
        
        // Find the currently expanded secondary-list-item
        const expandedSecondaryItem = secondaryItems.find(item => 
          item.getAttribute('aria-expanded') === 'true'
        );
        
        let currentIndex = expandedSecondaryItem ? 
          secondaryItems.indexOf(expandedSecondaryItem) : -1;
        
        if (currentIndex < secondaryItems.length - 1) {
          // Move to next secondary-list-item
          const nextSecondaryItem = secondaryItems[currentIndex + 1];
          
          // Close current expanded item and open the next one
          if (expandedSecondaryItem) {
            expandedSecondaryItem.setAttribute('aria-expanded', 'false');
          }
          nextSecondaryItem.setAttribute('aria-expanded', 'true');
          nextSecondaryItem.focus();
        } else {
          // Last secondary item, close current nav-drop and move to next nav-drop or search
          currentNavDrop.setAttribute('aria-expanded', 'false');

          if (currentNavDropIndex < allNavDrops.length - 1) {
            // Move to next nav-drop
            allNavDrops[currentNavDropIndex + 1].focus();
          } else {
            // Last nav-drop, focus search button
            const searchButton = document.querySelector('.nav-search-button');
            if (searchButton) {
              searchButton.focus();
            }
          }
        }
      } else {
        // Shift+Tab from close button - go back to last link in currently expanded tertiary list
        e.preventDefault();
        
        const expandedSecondaryItem = secondaryItems.find(item => 
          item.getAttribute('aria-expanded') === 'true'
        );
        
        if (expandedSecondaryItem) {
          const tertiaryList = expandedSecondaryItem.querySelector('.tertiary-list');
          if (tertiaryList) {
            const tertiaryLinks = Array.from(tertiaryList.querySelectorAll('a'));
            if (tertiaryLinks.length > 0) {
              // Focus last link in tertiary list
              tertiaryLinks[tertiaryLinks.length - 1].focus();
            } else {
              // No links, go to anchor in secondary-list-item-text or the item itself
              const anchorInText = expandedSecondaryItem.querySelector('.secondary-list-item-text > a');
              if (anchorInText) {
                anchorInText.focus();
              } else {
                expandedSecondaryItem.focus();
              }
            }
          } else {
            // No tertiary list, go to anchor in secondary-list-item-text or the item itself
            const anchorInText = expandedSecondaryItem.querySelector('.secondary-list-item-text > a');
            if (anchorInText) {
              anchorInText.focus();
            } else {
              expandedSecondaryItem.focus();
            }
          }
        }
      }
    }
  }
}

// Helper function to move to next nav-drop
function moveToNextNavDrop(allNavDrops, currentNavDropIndex) {
  const currentNavDrop = allNavDrops[currentNavDropIndex];
  currentNavDrop.setAttribute('aria-expanded', 'false');

  if (currentNavDropIndex < allNavDrops.length - 1) {
    // Move to next nav-drop
    allNavDrops[currentNavDropIndex + 1].focus();
  } else {
    // Last nav-drop, focus search button
    const searchButton = document.querySelector('.nav-search-button');
    if (searchButton) {
      searchButton.focus();
    }
  }
}

// Helper function to handle navigation within tabs structure
function handleTabsListNavigation(
  e,
  focused,
  tabsList,
  currentNavDrop,
  allNavDrops,
  currentNavDropIndex,
) {
  const tabButtons = Array.from(tabsList.querySelectorAll('.tabs-tab'));

  // Check if focused element is a tabs-tab button
  if (focused.classList.contains('tabs-tab')) {
    if (!e.shiftKey) {
      // Forward tab from tabs-tab button should go to anchor inside it
      e.preventDefault();
      const isTabSelected = focused.getAttribute('aria-selected') === 'true';

      if (isTabSelected) {
        // If tab is active, look for its corresponding panel
        const panelId = focused.getAttribute('aria-controls');
        const correspondingPanel = tabsList.parentElement.querySelector(`#${panelId}`);
        const isPanelVisible = correspondingPanel && correspondingPanel.getAttribute('aria-hidden') === 'false';

        if (isPanelVisible) {
          // Focus first link in the active panel
          const firstLink = correspondingPanel.querySelector('a');
          if (firstLink) {
            firstLink.focus();
            return;
          }
        }
      }

      // If no active panel or no links in panel, go to anchor inside button
      const anchorInside = focused.querySelector('a');
      if (anchorInside) {
        anchorInside.focus();
      }
    } else {
      // Shift+Tab from tabs-tab button
      const currentTabIndex = tabButtons.indexOf(focused);
      if (currentTabIndex > 0) {
        // Go to previous tabs-tab button
        e.preventDefault();
        tabButtons[currentTabIndex - 1].focus();
      } else {
        // First tabs-tab, go back to nav-drop
        e.preventDefault();
        currentNavDrop.focus();
      }
    }
  } else if (focused.tagName === 'A' && focused.closest('.tabs-tab')) {
    const parentButton = focused.closest('.tabs-tab');
    const currentTabIndex = tabButtons.indexOf(parentButton);

    if (!e.shiftKey) {
      // Forward tab from anchor should go to next tabs-tab button
      e.preventDefault();
      if (currentTabIndex < tabButtons.length - 1) {
        // Go to next tabs-tab button
        tabButtons[currentTabIndex + 1].focus();
      } else {
        // Last tab, check if there are tab panels to navigate to
        const tabPanels = Array.from(tabsList.parentElement.querySelectorAll('.tabs-panel'));
        const visiblePanel = tabPanels.find((panel) => panel.getAttribute('aria-hidden') === 'false');
        if (visiblePanel) {
          const firstLink = visiblePanel.querySelector('a');
          if (firstLink) {
            firstLink.focus();
          } else {
            // No visible panel or links, move to next nav-drop
            moveToNextNavDrop(allNavDrops, currentNavDropIndex);
          }
        } else {
          // No visible panels, move to next nav-drop
          moveToNextNavDrop(allNavDrops, currentNavDropIndex);
        }
      }
    } else {
      // Shift+Tab from anchor should go back to its parent tabs-tab button
      e.preventDefault();
      parentButton.focus();
    }
  } else if (focused.tagName === 'A' && focused.closest('.tabs-panel')) {
    const currentPanel = focused.closest('.tabs-panel');
    const panelLinks = Array.from(currentPanel.querySelectorAll('a'));
    const currentLinkIndex = panelLinks.indexOf(focused);

    if (!e.shiftKey) {
      // Forward tab
      if (currentLinkIndex < panelLinks.length - 1) {
        // Move to next link in panel
        e.preventDefault();
        panelLinks[currentLinkIndex + 1].focus();
      } else {
        // Last link in panel, move to next tabs-tab button
        e.preventDefault();
        const panelId = currentPanel.getAttribute('id');
        const correspondingTab = tabsList.querySelector(`[aria-controls="${panelId}"]`);

        if (correspondingTab) {
          const currentTabIndex = tabButtons.indexOf(correspondingTab);
          if (currentTabIndex < tabButtons.length - 1) {
            // Move to next tabs-tab button
            tabButtons[currentTabIndex + 1].focus();
          } else {
            // Last tab button, move to next nav-drop
            moveToNextNavDrop(allNavDrops, currentNavDropIndex);
          }
        } else {
          // Fallback: move to next nav-drop
          moveToNextNavDrop(allNavDrops, currentNavDropIndex);
        }
      }
    } else {
      // Shift+Tab
      /* eslint-disable no-lonely-if */
      if (currentLinkIndex > 0) {
        // Move to previous link in panel
        e.preventDefault();
        panelLinks[currentLinkIndex - 1].focus();
      } else {
        // First link in panel, go back to the corresponding tabs-tab button
        e.preventDefault();
        const panelId = currentPanel.getAttribute('id');
        const correspondingTab = tabsList.querySelector(`[aria-controls="${panelId}"]`);
        if (correspondingTab) {
          correspondingTab.focus();
        }
      }
    }
  }
}

function handleMobileKeyboardNavigation(e, focused) {
  const isDesktopViewport = window.matchMedia('(min-width: 900px)').matches;
  // Handle hamburger menu button Enter key
  if (e.code === 'Enter' && focused.closest('.nav-hamburger')) {
    e.preventDefault();
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');

    // Open the menu
    toggleMenu(nav, navSections);

    // Focus the close button after a brief delay to ensure DOM is updated
    setTimeout(() => {
      const closeButton = document.querySelector('.nav-menu-close button');
      if (closeButton) {
        closeButton.focus();
      }
    }, 50);
    return;
  }

  // Handle close button Tab key - move to first nav-drop
  if (e.code === 'Tab' && !e.shiftKey && focused.closest('.nav-menu-close')) {
    e.preventDefault();
    const navSections = document.querySelector('.nav-sections');
    const firstNavDrop = navSections.querySelector('.nav-drop');
    if (firstNavDrop) {
      firstNavDrop.focus();
    }
    return;
  }

  // Handle nav-drop Enter key - expand/collapse the dropdown
  if (e.code === 'Enter' && focused.classList.contains('nav-drop')) {
    e.preventDefault();
    const isCurrentlyExpanded = focused.getAttribute('aria-expanded') === 'true';

    // Close all other nav-drops
    const allNavDrops = document.querySelectorAll('.nav-drop');
    allNavDrops.forEach((drop) => {
      if (drop !== focused) {
        drop.setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle the current nav-drop
    focused.setAttribute('aria-expanded', isCurrentlyExpanded ? 'false' : 'true');
    return;
  }

  // Handle Tab navigation between nav-drop elements and their children
  if (e.code === 'Tab') {
    const allNavDrops = Array.from(document.querySelectorAll('.nav-drop'));
    const currentNavDrop = focused.classList.contains('nav-drop') ? focused : focused.closest('.nav-drop');

    if (!currentNavDrop) return;

    const currentNavDropIndex = allNavDrops.indexOf(currentNavDrop);
    const isNavDropExpanded = currentNavDrop.getAttribute('aria-expanded') === 'true';

    // If we're on a nav-drop element
    if (focused.classList.contains('nav-drop')) {
      if (!e.shiftKey) {
        // Forward tab - first check for anchor link in strong tag
        e.preventDefault();
        const strongElement = focused.querySelector('strong');
        const anchorInStrong = strongElement ? strongElement.querySelector('a') : null;

        if (anchorInStrong) {
          // Focus the anchor link within the strong tag
          anchorInStrong.focus();
        } else if (isNavDropExpanded) {
          // No anchor in strong, but nav-drop is expanded - focus first interactive element
          const firstFocusableElement = getFirstFocusableElement(currentNavDrop);
          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        } else {
          // No anchor in strong and not expanded - move to next nav-drop
          const nextNavDrop = allNavDrops[currentNavDropIndex + 1];
          if (nextNavDrop) {
            nextNavDrop.focus();
          } else {
            // If no more nav-drops, focus search button or other navigation elements
            const searchButton = document.querySelector('.nav-search-button');
            if (searchButton) {
              searchButton.focus();
            }
          }
        }
      } else {
        // Shift+Tab (backward)
        e.preventDefault();
        const prevNavDrop = allNavDrops[currentNavDropIndex - 1];
        if (prevNavDrop) {
          prevNavDrop.focus();
        } else {
          // If first nav-drop, go back to close button
          const closeButton = document.querySelector('.nav-menu-close button');
          if (closeButton) {
            closeButton.focus();
          }
        }
      }
    } else if (currentNavDrop) {
      // Check if focused element is an anchor within a strong tag (direct child of nav-drop)
      const strongElement = focused.closest('strong');
      const isAnchorInStrong = focused.tagName === 'A' && strongElement && strongElement.parentElement.classList.contains('nav-drop');
      if (isAnchorInStrong) {
        if (!e.shiftKey) {
          // Forward tab from anchor in strong tag
          e.preventDefault();
          if (isNavDropExpanded) {
            // Nav-drop is expanded, focus first interactive element
            const firstFocusableElement = getFirstFocusableElement(currentNavDrop);
            if (firstFocusableElement) {
              firstFocusableElement.focus();
            }
          } else {
            // Nav-drop is not expanded, move to next nav-drop
            const nextNavDrop = allNavDrops[currentNavDropIndex + 1];
            if (nextNavDrop) {
              nextNavDrop.focus();
            } else {
              // If no more nav-drops, focus search button
              const searchButton = document.querySelector('.nav-search-button');
              if (searchButton) {
                searchButton.focus();
              }
            }
          }
        } else {
          // Shift+Tab from anchor in strong tag - go back to nav-drop
          e.preventDefault();
          currentNavDrop.focus();
        }
      } else if (
        currentNavDrop.querySelector(`${isDesktopViewport ? '.nav-in-menu-wrap' : '.nav-in-menu-wrap-mobile'} .tabs-list`) && (focused.closest('.nav-in-menu-wrap-mobile') || focused.closest('.nav-in-menu-wrap'))) {
        // Special handling for tabs structure
        const tabsList = currentNavDrop.querySelector('.nav-in-menu-wrap-mobile .tabs-list');
        handleTabsListNavigation(
          e,
          focused,
          tabsList,
          currentNavDrop,
          allNavDrops,
          currentNavDropIndex,
        );
      } else {
        // Handle other focusable elements normally
        const focusableElements = getFocusableElements(currentNavDrop);
        const currentElementIndex = focusableElements.indexOf(focused);

        if (!e.shiftKey) {
          // Forward tab
          if (currentElementIndex < focusableElements.length - 1) {
            // Move to next focusable element within the same nav-drop
            e.preventDefault();
            focusableElements[currentElementIndex + 1].focus();
          } else {
            // We're at the last element, move to next nav-drop
            e.preventDefault();
            const nextNavDrop = allNavDrops[currentNavDropIndex + 1];
            if (nextNavDrop) {
              nextNavDrop.focus();
            } else {
              // If no more nav-drops, focus search button
              const searchButton = document.querySelector('.nav-search-button');
              if (searchButton) {
                searchButton.focus();
              }
            }
          }
        } else {
          // Shift+Tab (backward)
          /* eslint-disable no-lonely-if */
          if (currentElementIndex > 0) {
            // Move to previous focusable element within the same nav-drop
            e.preventDefault();
            focusableElements[currentElementIndex - 1].focus();
          } else {
            // We're at the first element, move to the nav-drop itself
            e.preventDefault();
            currentNavDrop.focus();
          }
        }
      }
    }
  }
}

function handleMenuKeyboardNavigation(e) {
  const focused = document.activeElement;
  const isDesktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (isDesktopViewport) {
    handleDesktopKeyboardNavigation(e, focused);
  } else {
    handleMobileKeyboardNavigation(e, focused);
  }
}

const handleSecondaryListBehavior = (event) => {
  const listItem = event.target.classList.contains('secondary-list-item-text') ? event.target.closest('li') : event.target;
  const list = listItem.closest('ul');
  const currentlyExpanded = list.querySelector(':scope > li[aria-expanded="true"]');
  
  // Close other expanded items, but not the one we're hovering over
  if (currentlyExpanded && currentlyExpanded !== listItem) {
    currentlyExpanded.setAttribute('aria-expanded', 'false');
  }
  
  // Always expand the hovered item
  if (listItem.hasAttribute('aria-expanded')) {
    listItem.setAttribute('aria-expanded', 'true');
  }
};

function addMegaMenuAccessibilityListeners() {
  const header = document.querySelector('header');
  header?.addEventListener('keydown', handleMenuKeyboardNavigation);
}

function decorateNavItem(parent) {
  const menuUl = div({ class: 'menuul' });
  const navIn = div({ class: 'nav-in' });
  const navContent = div({ class: 'nav-content' });
  const navContentIn = div({ class: 'nav-content-in' });
  const closeBtn = button(
    { class: 'button secondary nav-close', type: 'button' },
    img(
      { src: '/icons/mega-menu-close.svg', alt: 'Close mega menu' },
    ),
  );
  closeBtn.addEventListener('click', () => {
    parent.setAttribute('aria-expanded', 'false');
  });
  navContentIn.append(closeBtn);
  navContent.append(navContentIn);
  navIn.append(navContent);
  menuUl.append(navIn);
  parent.append(menuUl);

  const navInMenuWrap = div({ class: 'nav-in-menu-wrap' });
  navIn.append(navInMenuWrap);
  const list = parent.children[1];

  // Add classes to nested list structure
  if (list && list.nodeName === 'UL') {
    list.classList.add('secondary-list');
    const secondaryItems = list.children;
    
    for (let i = 0; i < secondaryItems.length; i++) {
      const secondaryItem = secondaryItems[i];
      if (secondaryItem.nodeName === 'LI') {
        secondaryItem.classList.add('secondary-list-item');
        secondaryItem.setAttribute('tabindex', '0');
        secondaryItem.setAttribute('aria-expanded', isDesktop.matches && i === 0 ? 'true' : 'false');
        if (isDesktop.matches) {
          secondaryItem.addEventListener('mouseover', (e) => {
            // Allow mouseover on the secondary item or its direct text wrapper
            if (e.target === e.currentTarget || e.target.classList.contains('secondary-list-item-text')) {
              handleSecondaryListBehavior(e);
            }
          });
        }

        // Add click handler for mobile toggle behavior
        secondaryItem.addEventListener('click', (e) => {
          if (e.target === e.currentTarget || e.target.classList.contains('secondary-list-item-text')) {
            const list = secondaryItem.closest('ul');
            const currentlyExpanded = list.querySelector(':scope > li[aria-expanded="true"]');
            const isExpanded = secondaryItem.getAttribute('aria-expanded') === 'true';
            
            // Close any currently expanded item
            if (currentlyExpanded) {
              currentlyExpanded.setAttribute('aria-expanded', 'false');
            }
            
            // Toggle the clicked item (only expand if it wasn't already expanded)
            if (!isExpanded) {
              secondaryItem.setAttribute('aria-expanded', 'true');
            }
          }
        });
        const headerTextEl = secondaryItem.childNodes.length && secondaryItem.childNodes[0];
        const headerText = headerTextEl.nodeName === '#text' ? headerTextEl.textContent.trim() : headerTextEl.innerText;
        
        // Wrap the first child in a div with secondary-list-item-text class
        if (headerTextEl) {
          const textWrapper = div({ class: 'secondary-list-item-text' });
          if (headerTextEl.nodeName === '#text') {
            textWrapper.textContent = headerTextEl.textContent.trim();
            secondaryItem.replaceChild(textWrapper, headerTextEl);
          } else {
            textWrapper.appendChild(headerTextEl);
            secondaryItem.insertBefore(textWrapper, secondaryItem.firstChild);
          }
        } 
        
        // Check for nested tertiary list
        const tertiaryList = secondaryItem.querySelector('ul');
        if (tertiaryList) {
          const tertiaryListWrapper = div({ class: 'tertiary-list-wrapper' });
          const tertiaryListHeader = h2({ class: 'tertiary-list-header' }, headerText);
          tertiaryListWrapper.append(tertiaryListHeader);
          tertiaryListWrapper.append(tertiaryList);
          tertiaryList.classList.add('tertiary-list');
          const tertiaryItems = tertiaryList.children;
          
          for (let j = 0; j < tertiaryItems.length; j++) {
            const tertiaryItem = tertiaryItems[j];
            if (tertiaryItem.nodeName === 'LI') {
              tertiaryItem.classList.add('tertiary-list-item');
            }
          }
          secondaryItem.append(tertiaryListWrapper);
        }
      }
    }
  }
  navInMenuWrap.append(parent.children[1]);
}

function buildNavSections(navSections) {
  if (navSections) {
    navSections.setAttribute('role', 'navigation');
    const navSectionSearchItem = navSections.children[0]?.children[1];
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      decorateNavItem(navSection);
      navSection.addEventListener('mouseover', () => {
        if (isDesktop.matches) {
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', 'true');
        }
      });
      navSection.addEventListener('mouseout', () => {
        if (isDesktop.matches) {
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', 'false');
        }
      });
      navSection.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          const targetEl = e.target;
          const tabsList = targetEl.closest('.tabs-list');
          if (targetEl.classList.contains('nav-drop')) {
            const isCurrentlyExpanded = targetEl.getAttribute('aria-expanded') === 'true';
            targetEl.closest('ul')?.querySelectorAll('.nav-drop')?.forEach((drop) => {
              drop.setAttribute('aria-expanded', 'false');
            });
            if (!isCurrentlyExpanded) {
              targetEl.setAttribute('aria-expanded', 'true');
            }
          }
          if (targetEl.classList.contains('tabs-tab')) {
            const isCurrentlyExpanded = targetEl.getAttribute('aria-selected') === 'true';
            tabsList?.querySelectorAll('.tabs-tab')?.forEach((tabBtn) => {
              tabBtn.setAttribute('aria-selected', 'false');
            });
            tabsList?.querySelectorAll('.tabs-panel')?.forEach((panel) => {
              panel.setAttribute('aria-hidden', 'true');
            });
            if (!isCurrentlyExpanded) {
              targetEl.setAttribute('aria-selected', 'true');
              const targetPanel = targetEl.nextElementSibling;
              targetPanel?.setAttribute('aria-hidden', 'false');
            }
          }
        }
      });
    });
    if (navSectionSearchItem) {
      navSectionSearchItem.remove();
    }
  }
}

function updateBrandLink(brandImg) {
  const brandImgLink = a();
  brandImgLink.href = '/';
  brandImgLink.title = 'Home';
  brandImg.after(brandImgLink);
  brandImgLink.appendChild(brandImg);
}

// Add Skip to main content link
const setupSkipMainContentLink = () => {
  const skipLink = a({ href: '#main-content', class: 'skip-link' }, 'Skip to main content');
  const main = document.querySelector('main');
  main?.setAttribute('id', 'main-content');
  main?.setAttribute('tabindex', '-1');
  document.body.prepend(skipLink);
  const mainContent = document.getElementById('main-content');

  skipLink.addEventListener('click', (event) => {
    event.preventDefault();

    // Move focus to main content
    mainContent.focus();

    // Smooth scroll to main content
    mainContent.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });

  // Handle focus management for better accessibility
  mainContent.addEventListener('blur', () => {
    main.removeAttribute('tabindex');
  });

  // Re-add tabindex when skip link is used
  skipLink.addEventListener('focus', () => {
    mainContent.setAttribute('tabindex', '-1');
  });
};

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  setupSkipMainContentLink();

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  navBrand.querySelectorAll('picture').forEach((pic) => {
    updateBrandLink(pic);
  });
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }
  let navSections = nav.querySelector('.nav-sections');
  const navSectionsBackUp = navSections.cloneNode(true);

  buildNavSections(navSections);

  // Logic for resizing nav sections
  function resizeNavSections(navSec, navSecBackUp) {
    if (navSecBackUp) {
      const navSectionSearchItem = navSecBackUp.children[0]?.children[1];
      if (isDesktop.matches && navSec.querySelector('details')) {
        navSections = navSecBackUp.cloneNode(true);
        navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
          if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
          decorateNavItem(navSection, navSectionSearchItem);
          navSection.addEventListener('mouseover', () => {
            if (isDesktop.matches) {
              toggleAllNavSections(navSections);
              navSection.setAttribute('aria-expanded', 'true');
            }
          });
          navSection.addEventListener('mouseout', () => {
            if (isDesktop.matches) {
              toggleAllNavSections(navSections);
              navSection.setAttribute('aria-expanded', 'false');
            }
          });
        });
      }
      if (!isDesktop.matches && navSec.querySelector('li') && navSec.querySelector('li').classList.contains('nav-drop')) {
        navSections = navSecBackUp.cloneNode(true);
        tracker.forEach((t) => {
          t.el.addEventListener('click', () => {
            tracker.forEach((t2) => {
              if (t2 !== t && !t.parent.isEqualNode(t2.el)) {
                t2.shrink();
              }
            });
          });
        });
      }
      if (navSectionSearchItem) {
        navSectionSearchItem.remove();
      }
    }
  }

  nav.appendChild(navSections);

  function resizeFunction() {
    resizeNavSections(navSections, navSectionsBackUp.cloneNode(true));
  }

  window.addEventListener('resize', resizeFunction);

  // hamburger for mobile
  const navMenuButtons = div({ class: 'nav-menu-buttons' });
  const hamburger = div({ class: 'nav-hamburger' });
  const menuClose = div({ class: 'nav-menu-close' });
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <img src="/icons/menu-white.svg" class="nav-hamburger-icon" alt="Open navigation" />
    </button>`;
  menuClose.innerHTML = `<button type="button" aria-controls="nav" aria-label="Close navigation">
    <img src="/icons/close-white.svg" class="nav-close-icon" alt="Close navigation" />
  </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  menuClose.addEventListener('click', () => toggleMenu(nav, navSections));
  navMenuButtons.append(hamburger, menuClose);
  nav.append(navMenuButtons);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = div({ class: 'nav-wrapper' });
  navWrapper.append(nav);
  block.append(navWrapper);
  handleNavTools(navWrapper);
  // improve accessibility
  document.querySelectorAll('#nav > div.section.nav-sections > div > ul > li').forEach((li) => {
    li.removeAttribute('role');
  });

  // Initialize mega menu keyboard accessibility
  addMegaMenuAccessibilityListeners();

  tracker.forEach((t) => {
    t.el.addEventListener('click', () => {
      tracker.forEach((t2) => {
        if (t2 !== t && !t.parent.isEqualNode(t2.el)) {
          t2.shrink();
        }
      });
    });
  });
}
