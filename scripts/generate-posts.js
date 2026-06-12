const fs   = require('fs');
const path = require('path');

function parseMeta(html) {
  const title    = (html.match(/class="article-title">([^<]+)</)             || [])[1] || '';
  const excerpt  = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
  const category = (html.match(/class="article-tag">([^<]+)</)               || [])[1] || '';
  return { title: title.trim(), excerpt: excerpt.trim(), category: category.trim() };
}

const blogDir = path.join(__dirname, '..', 'blog');

const posts = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(filename => {
    const filePath = path.join(blogDir, filename);
    const mtime    = fs.statSync(filePath).mtimeMs;
    const html     = fs.readFileSync(filePath, 'utf8');
    return { slug: filename.replace('.html', ''), mtime, ...parseMeta(html) };
  })
  .sort((a, b) => b.mtime - a.mtime)
  .map(({ slug, title, excerpt, category }) => ({ slug, title, excerpt, category }));

fs.writeFileSync(
  path.join(blogDir, 'posts.json'),
  JSON.stringify(posts, null, 2)
);

console.log(`✓ ${posts.length} artigo(s) indexado(s) em blog/posts.json`);
