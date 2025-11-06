import {
  loadScript,
  readBlockConfig,
} from '../../scripts/aem.js';
import {
  div,
  domEl,
} from '../../scripts/dom-helpers.js';

export function pre(...items) { return domEl('pre', ...items); }

// Azure Function URL and Key to get Power BI embed token & embed URL
const FN_URL = 'https://fn-dg-pbi-prod-westus3.azurewebsites.net/api/pbi-token-sp';

// will be read from the block parameters, see the decorate() function
let FN_KEY = null;
let WORKSPACE_ID = null;
let REPORT_ID = null;
let DATASET_ID = null;

const log = (msg, isErr = false) => {
  const el = document.getElementById('log');
  el.textContent += (el.textContent ? '\n' : '') + msg;
  if (isErr) el.classList.add('err');
};

// Build the POST body (reuse for refresh)
function buildPayload(workspaceIdVar, reportIdVar, datasetIdVar) {
  const body = {
    workspaceId: workspaceIdVar,
    reportId: reportIdVar,
    datasetId: datasetIdVar,
  };
  // If you want to include RLS, uncomment above and add here:
  // body.username = RLS_USERNAME;
  // body.roles = RLS_ROLES;
  return JSON.stringify(body);
}

// TOKEN REFRESH LOGIC (Proactive Refresh)
async function refreshToken(report) {
  try {
    const r = await fetch(FN_URL, {
      method: 'POST',
      headers: {
        'x-functions-key': FN_KEY,
        'Content-Type': 'application/json',
      },
      body: buildPayload(WORKSPACE_ID, REPORT_ID, DATASET_ID),
      cache: 'no-store',
    });
    if (!r.ok) { log(`Refresh failed HTTP ${r.status}: ${await r.text()}`, true); return; }
    const j = await r.json();
    if (!j.embedToken) { log(`Refresh returned no token: ${JSON.stringify(j)}`, true); return; }
    await report.setAccessToken(j.embedToken);

    // eslint-disable-next-line no-use-before-define
    scheduleRefresh(report, j.tokenExpiry);

    log('Token refreshed');
  } catch (e) {
    // eslint-disable-next-line prefer-template
    log('Refresh error: ' + (e?.message || e), true);
  }
}

// Schedule refresh ~5 minutes before expiry
function scheduleRefresh(report, tokenExpiryIso) {
  try {
    const now = Date.now();
    const exp = tokenExpiryIso ? new Date(tokenExpiryIso).getTime() : (now + 60 * 60 * 1000);
    const msUntilRefresh = Math.max(30_000, exp - now - 5 * 60 * 1000);
    log(`Scheduling token refresh in ${(msUntilRefresh / 60000).toFixed(1)} min`);
    setTimeout(() => refreshToken(report), msUntilRefresh);
  } catch {
    setTimeout(() => refreshToken(report), 55 * 60 * 1000);
  }
}

export default async function decorate(block) {
  // read block parameters from word document for workspace, report, and dataset IDs
  const blockCfg = readBlockConfig(block);
  FN_KEY = blockCfg.fnkey.trim() || null;
  WORKSPACE_ID = blockCfg.workspaceid.trim() || null;
  REPORT_ID = blockCfg.reportid.trim() || null;
  DATASET_ID = blockCfg.datasetid.trim() || null;

  // load the powerbi.js script using AEM loadScript() function
  await loadScript('https://cdn.jsdelivr.net/npm/powerbi-client@2.23.1/dist/powerbi.js');

  // wipe out the existing block contents?
  block.innerHTML = '';

  // create the div container for Power BI report
  const pbiVar = div({ id: 'pbi' });
  block.append(pbiVar);

  // create the pre element for logging
  const preVar = pre({ id: 'log' }, 'Starting Power BI embed...\n');
  block.append(preVar);

  try {
    // 1) Fetch embed info via POST JSON (with header key)
    const r = await fetch(FN_URL, {
      method: 'POST',
      headers: {
        'x-functions-key': FN_KEY,
        'Content-Type': 'application/json',
      },
      body: buildPayload(WORKSPACE_ID, REPORT_ID, DATASET_ID),
      cache: 'no-store',
    });
    const txt = await r.text();

    // eslint-disable-next-line no-empty
    let payload = {}; try { payload = JSON.parse(txt); } catch {}

    if (!r.ok) { log(`Token endpoint failed HTTP ${r.status}\n${txt}`, true); return; }
    const {
      embedToken,
      embedUrl,
      reportId,
      tokenExpiry,
    } = payload || {};
    if (!embedToken || !embedUrl || !reportId) {
      log(`Missing fields from function. Got:\n${txt}`, true);
      return;
    }
    log(`Token OK. reportId=${reportId}\nembedUrl=${embedUrl}`);

    // 2) Build embed configuration
    const pbi = window['powerbi-client'];
    const { models } = pbi;
    const config = {
      type: 'report',
      id: reportId,

      // eslint-disable-next-line object-shorthand
      embedUrl: embedUrl, // e.g., https://app.powerbigov.us/...

      accessToken: embedToken,
      tokenType: models.TokenType.Embed,
      permissions: models.Permissions.All,
      settings: {
        panes: { filters: { visible: false } },
        navContentPaneEnabled: true,
      },
    };

    // 3) Create Power BI service and embed the report
    const service = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory,
    );
    const container = document.getElementById('pbi');
    const report = service.embed(container, config);

    // 4) Diagnostic events
    report.on('loaded', () => log('Report loaded'));
    report.on('rendered', () => log('Report rendered'));

    // eslint-disable-next-line prefer-template
    report.on('error', (e) => log('Embed error:\n' + JSON.stringify(e?.detail || e, null, 2), true));

    // 5) Schedule proactive token refresh
    scheduleRefresh(report, tokenExpiry);
  } catch (err) {
    // eslint-disable-next-line prefer-template
    log('Unexpected error: ' + (err?.message || err), true);
  }
}
