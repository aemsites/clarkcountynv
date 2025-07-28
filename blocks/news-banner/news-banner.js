function setMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  if (placeholder) {
    const image = placeholder.querySelectorAll('source')[0].srcset;
    setMetaTag('bannerurl', image);
  }
  const currentUL = block.querySelector('div');
  currentUL.parentElement.parentElement.remove();
}
