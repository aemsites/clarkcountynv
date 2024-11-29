import { p, button, pre } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  /* exported gapiLoaded */
  /* exported gisLoaded */
  /* exported handleAuthClick */
  /* exported handleSignoutClick */

  // TODO(developer): Set to client ID and API key from the Developer Console
  const CLIENT_ID = '<YOUR_CLIENT_ID>';
  const API_KEY = '<YOUR_API_KEY>';

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }
    // Flatten to string to display
    const output = events.reduce((str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`, 'Events:\n');
    document.getElementById('content').innerText = output;
  }


  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      await listUpcomingEvents();
    };
    if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
    // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  /**
       * Callback after Google Identity Services are loaded.
       */
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  }

  /**
     *  Sign out the user upon button click.
     */
  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
  }

  function deferScript1() {
    const s1 = document.createElement('script');
    s1.setAttribute('src', 'https://apis.google.com/js/api.js');
    s1.onload = gapiLoaded();
    (document.body || document.head).appendChild(s1);
  }

  function deferScript2() {
    const s2 = document.createElement('script');
    s2.setAttribute('src', 'https://accounts.google.com/gsi/client');
    s2.onload = gisLoaded();
    (document.body || document.head).appendChild(s2);
  }

  deferScript1();
  deferScript2();

  p('Google Calendar API Quickstart');
  button({ id: 'authorize_button', onclick: handleAuthClick() }, 'Authorize');
  button({ id: 'signout_button', onclick: handleSignoutClick() }, 'Sign Out');
  pre({ id: 'content', style: 'white-space: pre-wrap' });

  document.getElementById('authorize_button').style.visibility = 'hidden';
  document.getElementById('signout_button').style.visibility = 'hidden';
}
