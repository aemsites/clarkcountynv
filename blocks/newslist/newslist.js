import ffetch from '../../scripts/ffetch.js';
import {
  div, a, li,
} from '../../scripts/dom-helpers.js';


async function getCategories(block) {
  const categories = new Set();
  const jsonDataNews = await ffetch('/news/query-index.json')
    .chunks(1000)
    .all();
  // Get category from array of Objects
  jsonDataNews.forEach((news) => {
    if (news.category) {
      categories.add(news.category);
    }
  });
  return categories;
}


export default async function decorate(block) {
  block.innerHTML = '';
  const newscontrol = div({ class: 'news-control' });
  const newsbox = div({ class: 'news-box' });
  newscontrol.innerHTML = `
  <div id="news-controls">
    <label for="news-categories">Show : </label>
    <select id="news-filter" name="news-categories">                 
    </select>
</div>`;
  block.append(newscontrol);
  const categories = await getCategories(block);
  console.log(categories);
  // Allot options to the select element
  const select = block.querySelector('#news-filter');
  const firstOption = document.createElement('option');
  firstOption.textContent = 'All News';
  select.append(firstOption);
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.toLowerCase();
    option.textContent = category;
    select.append(option);
  });
}
