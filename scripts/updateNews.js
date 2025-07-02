import fs from 'fs/promises';


const RSS_URL = 'https://hnrss.org/frontpage';

function parseFeed(xml) {
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g));
  return items.slice(0, 10).map(([, item], idx) => {
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
    return {
      title: titleMatch ? titleMatch[1].trim() : `News ${idx + 1}`,
      link: linkMatch ? linkMatch[1].trim() : '',
      image: 'https://placehold.co/600x400?text=News'
    };
  });
}

async function fetchNews() {
  const res = await fetch(RSS_URL);
  const xml = await res.text();
  return parseFeed(xml);

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
