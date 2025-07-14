export default function decorate(block) {
  // Using existing authoring - change <p> tag to either <h1> or <h2>
  const hasHomepageClass = block.classList.contains('homepage');
  const pTags = block.querySelectorAll('p');
  pTags?.forEach((tag) => {
    let newTagName = 'p';
    if (hasHomepageClass) {
      newTagName = 'h2';
    } else {
      newTagName = 'h1';
    }
    const newEl = document.createElement(newTagName);
    newEl.innerHTML = tag.innerHTML;
    tag.replaceWith(newEl);
  });
}
