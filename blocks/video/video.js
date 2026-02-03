/*
 * Video Block
 * Show a video referenced by a link
 * https://www.hlx.live/developer/block-collection/video
 */

// TODO: - Width/Height adjustable DAM videos (DONE)
//       - Placeholder image DAM videos (DONE)
//       - Placeholder image support on width/height adjustable videos (DONE)
//       - Placeholder image support on left-align option (DONE)
//       - Fix the height stretch bug on video (left align) load (DONE)

//       - Fix width/height adjustable DAM video letterboxing
//         This can be done with ?isLetterBoxed=true on the URL (DONE)

//       - Video (height-350) isnt working??? its rendering as height-506 (DONE)

//       - Try the "poster" attribute for placeholder images? Instead of
//         using a custom solution, maybe we can utilize the built-in
//         video.js functionality for it instead.
//         See https://videojs.org/guides/options/

//       - Utilize the suffixParams options to keep the code consistent with other functions

//       - Delete all debug comments and unused lines of code + lint
//       - Test all videos on kitchen sink page: http://localhost:3000/drafts/jlui/dam-video-test

import {
  div,
} from '../../scripts/dom-helpers.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function embedYoutube(url, autoplay, background, hasAlignment) {
  const usp = new URLSearchParams(url.search);
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      mute: background ? '1' : '0',
      controls: background ? '0' : '1',
      disablekb: background ? '1' : '0',
      loop: background ? '1' : '0',
      playsinline: background ? '1' : '0',
    };
    suffix = `&${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }

  const temp = document.createElement('div');
  temp.innerHTML = `<div class="video-player" style="left: 0; width: 100%; position: relative; ${!hasAlignment ? 'height: 0; padding-bottom: 56.25%;' : ''}">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function embedVimeo(url, autoplay, background, hasAlignment) {
  const [, video] = url.pathname.split('/');
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      background: background ? '1' : '0',
    };
    suffix = `?${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; position: relative; ${!hasAlignment ? 'height: 0; padding-bottom: 56.25%;' : ''}">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function embedAdobeDAM(url, autoplay, background, hasAlignment, customWidth, customHeight, placeholder, shouldCenter) {
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      mute: background ? '1' : '0',
      controls: background ? '0' : '1',
      disablekb: background ? '1' : '0',
      loop: background ? '1' : '0',
      playsinline: background ? '1' : '0',
    };
    suffix = `&${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }

  console.log('custom width: ', customWidth);

  let width = '100%';
  let height = '100%';

  if (customWidth.some((style) => style.startsWith('width'))) {
    const widthStyle = customWidth.find((style) => style.startsWith('width'));
    width = `${widthStyle.replace('width-', '')}px`;
  }

  if (customHeight.some((style) => style.startsWith('height'))) {
    const heightStyle = customHeight.find((style) => style.startsWith('height'));
    height = `${heightStyle.replace('height-', '')}px`;
  }

  console.log('width: ', width);
  console.log('height: ', height);

  const temp = document.createElement('div');





  const params = new URLSearchParams();

  if (placeholder) {
    params.set('autoplay', '1');
  }

  if (width != '100%' || height != '100%') {
    params.set('isLetterBoxed', 'true');
  }

  console.log("has: ", hasAlignment);

  const src = `${url.href}${params.toString() ? `?${params.toString()}` : ''}`;

  const content = `<div class="video-player" style="width: ${width}; position: relative; ${!hasAlignment ? `height: ${height};` : ''} ">
    <iframe src="${src}" style="border: 0; top: 0; left: 0; width: ${width}; height: ${height}; position: absolute;" 
    allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Adobe DAM" loading="lazy"></iframe>
  </div>`;
  
  temp.innerHTML = shouldCenter
    ? `<div style="display: flex; justify-content: center;">${content}</div>`
    : content;

    // temp.innerHTML = `<div style="display: flex; justify-content: center;"> <div class="video-player" style="width: ${width}; position: relative; ${!hasAlignment ? 'padding-bottom: 56.25%;' : ''} height: ${height};">
    //   <iframe src="${src}" style="border: 0; top: 0; left: 0; width: ${width}; height: ${height}; position: absolute;" 
    //   allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Adobe DAM" loading="lazy"></iframe>
    // </div> </div>`;

  // temp.innerHTML = `<div style="display: flex; justify-content: center;"> <div class="video-player" style="width: 100%; position: relative; ${!hasAlignment ? `height: ${height};` : ''}">
  //   <iframe src="${src}" style="border: 0; top: 0; left: 0; width: ${width}; height: ${height}; position: absolute;" 
  //   allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Adobe DAM" loading="lazy"></iframe>
  // </div> </div>`;


  // /// ////// working
  // if (hasAlignment) {
  //   temp.innerHTML = `<div class="video-player" style="left: 0; width: 100%; position: relative; ${!hasAlignment ? 'height: 0; padding-bottom: 56.25%;' : ''}">
  //     <iframe src="${src}" style="border: 0; top: 0; left: 0; width: ${width}; height: ${height}; position: absolute;" 
  //     allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Adobe DAM" loading="lazy"></iframe>
  //   </div>`;
  // } else if (placeholder) {
  //   // temp.innerHTML = `
  //   // <div style="display: flex; justify-content: center;"> <div class="video-player" style=" width: ${iframeWidth}; height: ${iframeHeight}; aspect-ratio: 16 / 9; "> <iframe src="${url.href}?autoplay=1" style="width: 100%; height: 100%; border: 0; object-fit: contain;" allowfullscreen loading="lazy"> </iframe> </div> </div>
  //   // `;

  //   temp.innerHTML = `<div style="display: flex; justify-content: center;"> <div class="video-player" style="width: ${width}; position: relative; ${!hasAlignment ? 'padding-bottom: 56.25%;' : ''} height: ${height};">
  //     <iframe src="${src}" style="border: 0; top: 0; left: 0; width: ${width}; height: ${height}; position: absolute;" 
  //     allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Adobe DAM" loading="lazy"></iframe>
  //   </div> </div>`;
  // } else {
  //   temp.innerHTML = `<div style="display: flex; justify-content: center;"> <div class="video-player" style="width: ${width}; position: relative; ${!hasAlignment ? 'padding-bottom: 56.25%;' : ''} height: ${height};">
  //     <iframe src="${src}" style="border: 0; top: 0; left: 0; width: ${width}; height: ${height}; position: absolute;" 
  //     allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Adobe DAM" loading="lazy"></iframe>
  //   </div> </div>`;
  // }
  //   /// //////


  console.log(temp.innerHTML);

  return temp.children.item(0);
}

function getVideoElement(source, autoplay, background) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  if (autoplay) video.setAttribute('autoplay', '');
  if (background) {
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    video.addEventListener('canplay', () => {
      video.muted = true;
      if (autoplay) video.play();
    });
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', `video/${source.split('.').pop()}`);
  video.append(sourceEl);

  return video;
}

const loadVideoEmbed = (block, link, autoplay, background, placeholder) => {
  if (block.dataset.embedLoaded === 'true') {
    return;
  }
  const url = new URL(link);

  console.log('url: ', link);

  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  const isVimeo = link.includes('vimeo');
  const isDAM = link.includes('clarkcountynv.gov/adobe/assets');

  console.log('isDAM?: ', isDAM);
  const hasAlignment = block.classList.contains('left-align') || block.classList.contains('right-align');
  const shouldCenter = block.classList.contains('center');

  if (isYoutube) {
    const embedWrapper = embedYoutube(url, autoplay, background, hasAlignment);
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else if (isVimeo) {
    const embedWrapper = embedVimeo(url, autoplay, background, hasAlignment);
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else if (isDAM) {
    console.log('isDAM block tripped');

    const customWidth = [...block.classList].filter((className) => className.startsWith('width-'));
    const customHeight = [...block.classList].filter((className) => className.startsWith('height-'));

    const embedWrapper = embedAdobeDAM(url, autoplay, background, hasAlignment, customWidth, customHeight, placeholder, shouldCenter);
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else {
    console.log('else block tripped');
    const videoEl = getVideoElement(link, autoplay, background);
    block.append(videoEl);
    videoEl.addEventListener('canplay', () => {
      block.dataset.embedLoaded = true;
    });
  }
};

function videoEnablement(block) {
  let detailsv1 = null;
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  if (block.querySelector('h4')) {
    const details = block.querySelector('h4').textContent;
    detailsv1 = div({ class: 'text' }, `${details}`);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(block.innerHTML, 'text/html');
  const textElements = doc.body && doc.body.children.length && doc.body.children.length > 1 ? doc.body.children[1] : '';
  block.textContent = '';
  if (textElements) {
    textElements.classList.add('video-content');
    block.append(textElements);
  }
  if (detailsv1) {
    block.append(detailsv1);
  }
  block.dataset.embedLoaded = false;

  const customWidth = [...block.classList].filter((className) => className.startsWith('width-'));
  const customHeight = [...block.classList].filter((className) => className.startsWith('height-'));
  let widthVar = '100%';
  let heightVar = '100%';

  if (customWidth.some((style) => style.startsWith('width'))) {
    const widthStyle = customWidth.find((style) => style.startsWith('width'));
    widthVar = `${widthStyle.replace('width-', '')}px`;
  }

  if (customHeight.some((style) => style.startsWith('height'))) {
    const heightStyle = customHeight.find((style) => style.startsWith('height'));
    heightVar = `${heightStyle.replace('height-', '')}px`;
  }

  const autoplay = block.classList.contains('autoplay');
  if (placeholder) {
    console.log('placeholder tripped');

    block.classList.add('placeholder');
    const wrapper = document.createElement('div');
    wrapper.className = 'video-placeholder';

    if (!block.classList.contains('left-align')) {
    wrapper.style.width = widthVar;
    wrapper.style.height = heightVar;
    }

    wrapper.append(placeholder);

    if (!autoplay) {
      wrapper.insertAdjacentHTML(
        'beforeend',
        '<div class="video-placeholder-play"><button type="button" title="Play"></button></div>',
      );
      wrapper.addEventListener('click', () => {
        wrapper.remove();
        loadVideoEmbed(block, link, true, false, placeholder);
      });
    }
    block.append(wrapper);
  }

  if (!placeholder || autoplay) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        const playOnLoad = autoplay && !prefersReducedMotion.matches;
        loadVideoEmbed(block, link, playOnLoad, autoplay);
      }
    });
    observer.observe(block);
  }
}

export default async function decorate(block) {
  if (block.classList.contains('table')) {
    [...block.children].forEach((row) => {
      [...row.children].forEach((col) => {
        videoEnablement(col);
      });
    });
  } else {
    videoEnablement(block);
  }
}
