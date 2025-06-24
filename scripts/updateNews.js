import fs from 'fs/promises';
import Parser from 'rss-parser';

const parser = new Parser();
const RSS_URL = 'https://hnrss.org/frontpage';

async function fetchNews() {
  const feed = await parser.parseURL(RSS_URL);
  return feed.items.slice(0, 10).map((item, idx) => ({
    title: item.title || `News ${idx + 1}`,
    link: item.link || '',
    image: item.enclosure?.url || 'https://placehold.co/600x400?text=News'
  }));
}

async function update() {
  const news = await fetchNews();
  await fs.writeFile('./app/data/latestNews.json', JSON.stringify(news, null, 2));
  console.log('Latest news updated');
}

update().catch(err => {
  console.error('Failed to update news', err);
  process.exit(1);
});
