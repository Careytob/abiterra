// scripts/update-blog-frontmatter.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

async function updateBlogFrontmatter() {
  const imageMap = {
    'nigeria-property-inspection': 'images/blog/nigeria-property-inspection.jpg',
    'cost-buying-property': 'images/blog/cost-buying-property.jpg',
    'lagos-property-guide': 'images/blog/lagos-property-guide.jpg',
    'rental-yield-lagos': 'images/blog/rental-yield-lagos.jpg',
  };

  const files = await fs.readdir(BLOG_DIR);
  for (const filename of files) {
    if (filename.endsWith('.md') || filename.endsWith('.mdx')) {
      const slug = filename.replace(/\.(mdx|md)$/, '') as keyof typeof imageMap;
      const newCoverImage = imageMap[slug];
      if (!newCoverImage) continue;

      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      if (data.coverImage !== newCoverImage) {
        data.coverImage = newCoverImage;
        const updatedContent = matter.stringify(content, data);
        await fs.writeFile(filePath, updatedContent);
        console.log(`Updated coverImage for ${filename} to ${newCoverImage}`);
      }
    }
  }
  console.log('Frontmatter update complete');
}

updateBlogFrontmatter();