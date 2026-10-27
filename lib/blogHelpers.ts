// lib/blogHelpers.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';
import { marked } from 'marked';
import { createClient } from '@supabase/supabase-js';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getPublicUrl(imagePath: string): Promise<string> {
  const defaultImage = '/images/blog/default-cover.jpg';
  // Absolute URLs and site-relative paths (e.g. /images/blog/cover.jpg served from
  // /public) are used as-is. Only bare paths are looked up in Supabase Storage.
  if (!imagePath) return defaultImage;
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;

  try {
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    const { data } = await supabase.storage.from('blog-images').getPublicUrl(cleanPath);

    if (!data?.publicUrl) {
      console.error(`[Blog] No public URL returned for ${cleanPath}`);
      return defaultImage;
    }

    console.log(`[Blog] Generated public URL: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error: any) {
    console.error(`[Blog] Error fetching public URL for ${imagePath}:`, {
      message: error.message,
      stack: error.stack,
      path: imagePath,
    });
    return defaultImage;
  }
}

async function ensureBlogDir() {
  try {
    await fs.access(BLOG_DIR);
  } catch (error) {
    await fs.mkdir(BLOG_DIR, { recursive: true });
    console.log(`Created blog directory at ${BLOG_DIR}`);
  }
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export async function getBlogPosts(page = 1, limit = 9): Promise<{
  length: number;
  posts: BlogPost[];
  totalPages: number;
}> {
  try {
    await ensureBlogDir();
    let files = await fs.readdir(BLOG_DIR);
    files = files.filter(filename => filename.endsWith('.mdx') || filename.endsWith('.md'));

    const parsed = await Promise.all(
      files.map(async filename => {
       try {
        const filePath = path.join(BLOG_DIR, filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        const slug = filename.replace(/\.(mdx|md)$/, '');
        const htmlContent = marked(content);

        const coverImage = data.coverImage || '/images/blog/default-cover.jpg';
        const publicCoverImage = await getPublicUrl(coverImage);

        return {
          id: slug,
          slug,
          content,
          htmlContent,
          title: data.title || 'Untitled Post',
          author: data.author || 'Admin',
          publishDate: data.publishDate || new Date().toISOString(),
          category: data.category || 'Real Estate',
          tags: data.tags || [],
          excerpt: data.excerpt || 'Read our latest real estate insights and guides.',
          coverImage: publicCoverImage,
          readTime: data.readTime || calculateReadTime(content),
        } as BlogPost;
       } catch (err) {
        // A malformed post (e.g. invalid front matter) is skipped instead of hiding every post.
        console.error(`[Blog] Skipping ${filename}: ${err instanceof Error ? err.message.split('\n')[0] : err}`);
        return null;
       }
      })
    );
    const allPosts = parsed.filter((post): post is BlogPost => post !== null);

    const sortedPosts = allPosts.sort((a, b) => {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedPosts.length / limit);

    return {
      posts: paginatedPosts,
      totalPages,
      length: sortedPosts.length,
    };
  } catch (error) {
    console.error('[Blog] Error loading blog posts:', error);
    return { posts: [], totalPages: 0, length: 0 };
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    await ensureBlogDir();
    let filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    let fileExists = false;

    try {
      await fs.access(filePath);
      fileExists = true;
    } catch {
      filePath = path.join(BLOG_DIR, `${slug}.md`);
      try {
        await fs.access(filePath);
        fileExists = true;
      } catch {
        console.warn(`[Blog] Blog post ${slug} not found`);
        return null;
      }
    }

    if (!fileExists) {
      return null;
    }

    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const htmlContent = marked(content);

    const coverImage = data.coverImage || '/images/blog/default-cover.jpg';
    const publicCoverImage = await getPublicUrl(coverImage);

    return {
      id: slug,
      slug,
      content,
      htmlContent,
      title: data.title || 'Untitled Post',
      author: data.author || 'Admin',
      publishDate: data.publishDate || new Date().toISOString(),
      category: data.category || 'Real Estate',
      tags: data.tags || [],
      excerpt: data.excerpt || 'Read our latest real estate insights and guides.',
      coverImage: publicCoverImage,
      readTime: data.readTime || calculateReadTime(content),
    } as BlogPost;
  } catch (error) {
    console.error(`[Blog] Error loading blog post ${slug}:`, error);
    return null;
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 3
): Promise<BlogPost[]> {
  const { posts } = await getBlogPosts();

  const otherPosts = posts.filter(post => post.slug !== currentSlug);

  const scoredPosts = otherPosts.map(post => {
    let score = 0;

    if (post.category === category) {
      score += 5;
    }

    const sharedTags = post.tags.filter(tag => tags.includes(tag));
    score += sharedTags.length * 2;

    return { post, score };
  });

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

export async function getPostsByCategory(category: string, page = 1, limit = 9): Promise<{
  posts: BlogPost[];
  totalPages: number;
}> {
  const { posts: allPosts } = await getBlogPosts();

  const filteredPosts = allPosts.filter(post =>
    post.category.toLowerCase() === category.toLowerCase()
  );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPosts.length / limit);

  return {
    posts: paginatedPosts,
    totalPages,
  };
}

export async function getPostsByTag(tag: string, page = 1, limit = 9): Promise<{
  posts: BlogPost[];
  totalPages: number;
}> {
  const { posts: allPosts } = await getBlogPosts();

  const filteredPosts = allPosts.filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPosts.length / limit);

  return {
    posts: paginatedPosts,
    totalPages,
  };
}

export async function getAllCategories(): Promise<string[]> {
  const { posts } = await getBlogPosts();
  const categoriesSet = new Set(posts.map(post => post.category));
  return Array.from(categoriesSet);
}

export async function getAllTags(): Promise<string[]> {
  const { posts } = await getBlogPosts();
  const tagsSet = new Set(posts.flatMap(post => post.tags));
  return Array.from(tagsSet);
}

export async function getSitemapUrls() {
  const { posts } = await getBlogPosts();
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return [
    { url: '/', lastmod: new Date().toISOString(), priority: 1.0 },
    { url: '/blog', lastmod: new Date().toISOString(), priority: 0.8 },
    { url: '/buy', lastmod: new Date().toISOString(), priority: 0.9 },
    { url: '/rent', lastmod: new Date().toISOString(), priority: 0.9 },
    ...posts.map(post => ({
      url: `/blog/${post.slug}`,
      lastmod: post.publishDate,
      priority: 0.7,
    })),
    ...categories.map(category => ({
      url: `/blog/category/${encodeURIComponent(category.toLowerCase())}`,
      lastmod: new Date().toISOString(),
      priority: 0.6,
    })),
    ...tags.map(tag => ({
      url: `/blog/tag/${encodeURIComponent(tag.toLowerCase())}`,
      lastmod: new Date().toISOString(),
      priority: 0.5,
    })),
  ];
}