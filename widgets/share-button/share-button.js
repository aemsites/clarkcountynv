function widget() {
  // class default-content-wrapper
  // const btn = document.createElement('div');
  const a = document.createElement('a');
  const img = document.createElement('div');
  const txt = document.createElement('span');

  img.innerHTML = '<img data-icon-name="share" src="/icons/share.svg" alt="" loading="lazy">';
  a.setAttribute('href', '/modals/share-with-social-network');
  a.setAttribute('class', 'floating-share-btn');
  // img.setAttribute('class', 'share-float');
  a.append(img);
  txt.innerHTML = 'Share';
  a.append(txt);
  console.log(window.location.href);
  (document.body || document.head).appendChild(a);
}

widget();
