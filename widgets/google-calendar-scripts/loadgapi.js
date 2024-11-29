function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

function deferScript1() {
  const s1 = document.createElement('script');
  s1.setAttribute('src', 'https://apis.google.com/js/api.js');
  s1.onload = gapiLoaded();
  (document.body || document.head).appendChild(s1);
}

deferScript1();
