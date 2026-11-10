// add delayed functionality here
import { loadScript, sampleRUM } from './aem.js';
// eslint-disable-next-line import/no-cycle
import { loadrrule } from '../templates/calendar/calendar.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// Scripts for Google Translate
function googleTranslate() {
  const s1 = document.createElement('script');
  s1.setAttribute('src', 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
  (document.body || document.head).appendChild(s1);
  const s2 = document.createElement('script');
  s2.text = `
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    }
  `;
  (document.body || document.head).appendChild(s2);
}

googleTranslate();

// ReciteMe
async function loadWidget() {
  const searchPath = '/search';
  if (!window.location.pathname.includes(searchPath)) {
    await loadScript('/widgets/accessibility/accessibility.js');
  }
}

// Script for Full Calendar
// check if windows location contains calendar
if (window.location.pathname.includes('/calendar')) {
  loadrrule();
}

/* Google Tag Manager & Google Analytics */

async function loadAnalyticsScripts() {
  // google tag manager
  const gtmId = 'GTM-5NWDH65B';
  // eslint-disable-next-line
  (function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f); })(window, document, 'script', 'dataLayer', gtmId);
}

/* SiteImprove */

async function loadSiteImproveScript() {
  const script = document.createElement('script');
  script.src = 'https://siteimproveanalytics.com/js/siteanalyze_6295639.js';
  script.async = true;
  document.body.appendChild(script);
}

async function loadPodcastStreamingAudio() {
  const uniquePaths = '/residents/family_services/divisions/foster_care/';
  if (window.location.pathname.endsWith(uniquePaths)) {
    const s1 = document.createElement('script');
    s1.setAttribute('src', 'https://tag.simpli.fi/sifitag/e034192a-8d69-47a6-9208-aaec57cf81d7');
    (document.body || document.head).appendChild(s1);
  }
}

/* Qualtrics Website Feedback */

function loadQualtricsScript() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = `
    (function(){var g=function(g){
      this.go=function(){var a=document.createElement("script");a.type="text/javascript";a.src=g;document.body&&document.body.appendChild(a)};
      this.start=function(){var t=this;"complete"!==document.readyState?window.addEventListener?window.addEventListener("load",function(){t.go()},!1):window.attachEvent&&window.attachEvent("onload",function(){t.go()}):t.go()};};
      try{(new g("https://zn1ociwo1stxgw4ie-clarkcounty.gov1.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_1ociwO1STXGw4ie")).start()}catch(i){}})();
  `;
  document.head.appendChild(script);
  const div = document.createElement('div');
  div.id = 'ZN_1ociwO1STXGw4ie';
  document.body.appendChild(div);
}

loadWidget();
loadAnalyticsScripts();
loadSiteImproveScript();
loadPodcastStreamingAudio();
loadQualtricsScript();
