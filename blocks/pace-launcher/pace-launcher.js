/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-restricted-syntax */

export default async function decorate(block) {
  // clear existing input fields from the word document... not needed here
  // since the block will not have any inputs from there.
  block.innerHTML = '';

  // Helper that waits for 1Mind to load AND then returns full merged params
  async function getLauncherParams() {
    // Wait until window.onemind exists
    while (!window.onemind || !window.onemind.launcherConfig) {
      await new Promise((r) => setTimeout(r, 200));
    }

    const rawParams = new URLSearchParams(window.location.search);
    const merged = {};

    // Include normal params
    for (const [k, v] of rawParams.entries()) {
      merged[k] = v;
    }

    // Include params 1Mind rewrites internally
    const launcherParams = window.onemind?.launcherConfig?.launcher || {};
    for (const [k, v] of Object.entries(launcherParams)) {
      merged[k] = v;
    }

    console.log('Merged launcher parameters:', merged);
    return merged;
  }

  getLauncherParams();

  // 1mind’s launcher script automatically reads the query parameters in the URL.
  const container = document.createElement('div');
  container.id = 'onemind-widget';
  block.append(container);

  // Create script element for the 1mind launcher and attach it to the block
  const script = document.createElement('script');
  script.defer = true;

  // sandbox
  script.src = 'https://launcher.1mind.com/w67t9x5w2s';

  block.appendChild(script);

  // Register onUrlClicked so chat links open in a new tab instead of
  // navigating within the iframe (which fails due to X-Frame-Options on target sites)
  function registerUrlHandler() {
    if (!window.onemind) {
      setTimeout(registerUrlHandler, 500);
      return;
    }

    window.onemind
      .onUrlClicked((data) => {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      })
      .catch(() => {
        // iframe not ready yet, retry
        setTimeout(registerUrlHandler, 1000);
      });
  }

  registerUrlHandler();
}

// staging
// script.src = 'https://launcher.1mind.com/x5ww7qtngg';

// uat
// script.src = 'https://launcher.1mind.com/ffkvwm9hdx';

// prod
// script.src = 'https://launcher.1mind.com/qp7w8lhck8';
