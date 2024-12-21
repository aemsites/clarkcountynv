export async function fetchPlaceholders() {
  window.placeholders = window.placeholders || {};
  const TRANSLATION_KEY_EVENTS = 'events';
  const loaded = window.placeholders[`${TRANSLATION_KEY_EVENTS}-loaded`];

  if (!loaded) {
    window.placeholders[`${TRANSLATION_KEY_EVENTS}-loaded`] = new Promise((resolve, reject) => {
      fetch('/featured.json?sheet=events')
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          throw new Error(`${resp.status}: ${resp.statusText}`);
        })
        .then((json) => {
          window.placeholders[TRANSLATION_KEY_EVENTS] = json;
          resolve();
        }).catch((error) => {
        // Error While Loading Placeholders
          window.placeholders[TRANSLATION_KEY_EVENTS] = {};
          reject(error);
        });
    });
  }
  await window.placeholders[`${TRANSLATION_KEY_EVENTS}-loaded`];
  return [window.placeholders[TRANSLATION_KEY_EVENTS]];
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  console.log(placeholders[0].data);
}
