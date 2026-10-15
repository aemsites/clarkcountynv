/* eslint-disable no-unused-vars */

export default async function decorate(block) {
  // clear existing input fields from the word document... not needed here
  // since the block will not have any inputs from there.
  block.innerHTML = '';

  // Helper to read both normal params (localhost) and onemind_ params (AEM)
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);

    // First try the raw key
    if (params.has(name)) {
      return params.get(name);
    }

    // Then try the 1Mind-prefixed key (AEM .page behavior)
    const prefixed = `onemind_${name}`;
    if (params.has(prefixed)) {
      return params.get(prefixed).replace(/\+/g, ' ');
    }

    return null;
  }

  // 1mind’s launcher script automatically reads the query parameters in the URL.
  // e.g., ?applicantName=John&applicantEmail=john@example.com&...
  // The 1mind team will configure the conversation to use these query parameters.
  const container = document.createElement('div');
  container.id = 'onemind-widget';
  block.append(container);

  // Create script element for the 1mind launcher and attach it to the block
  const script = document.createElement('script');
  script.defer = true;
  // sandbox
  script.src = 'https://launcher.1mind.com/w67t9x5w2s';

  // staging
  // script.src = 'https://launcher.1mind.com/x5ww7qtngg';

  // uat
  // script.src = 'https://launcher.1mind.com/ffkvwm9hdx';

  // prod
  // script.src = 'https://launcher.1mind.com/qp7w8lhck8';
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
