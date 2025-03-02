import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (col.querySelector('a') && col.querySelectorAll('p:not(:has(a)), h1, h2, h3, h4, h5, h6, div').length === 0) {
        const imgSrc = col.querySelector('a').href;
        const pic = createOptimizedPicture(imgSrc, imgSrc.split('/').pop());
        if (pic) {
          col.replaceWith(pic);
        }
      }
    });
  });
  const cols = [...block.firstElementChild.children];

  block.classList.add(`columns-${cols.length}-cols`);
  for (let i = 0; i < cols.length; i += 1) {
    cols[i].classList.add(`column${i + 1}`);
    [...cols[i].children].forEach((child) => {
      child.classList.remove('button-container');
      child.classList.add('columns-paragraph');
      child.classList.add(`column${i + 1}-paragraph`);
    });
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
