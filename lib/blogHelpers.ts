// lib/blogHelpers.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';
import { marked } from 'marked';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

async function getSignedUrl(path: string): Promise<string> {
  if (path.startsWith('http')) {
    return path;
  }

  const defaultImage = '/images/blog/default-cover.jpg';
  if (!path) {
    console.warn('Image path is empty, returning default image');
    return defaultImage;
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/blog-images?path=${encodeURIComponent(path)}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Failed to fetch signed URL for ${path}: ${res.status} ${res.statusText}`);
      return defaultImage;
    }

    const data = await res.json();
    return data.url || defaultImage;
  } catch (error: any) {
    console.error(`Error fetching signed URL for ${path}:`, error.message);
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
  length: number; posts: BlogPost[], totalPages: number 
}> {
  try {
    await ensureBlogDir();
    let files = await fs.readdir(BLOG_DIR);
    files = files.filter(filename => filename.endsWith('.mdx') || filename.endsWith('.md'));

    const allPosts = await Promise.all(
      files.map(async filename => {
        const filePath = path.join(BLOG_DIR, filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        const slug = filename.replace(/\.(mdx|md)$/, '');
        const htmlContent = marked(content);

        const coverImage = data.coverImage || 'images/blog/default-cover.jpg';
        const signedCoverImage = await getSignedUrl(coverImage);

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
          excerpt: data.excerpt || 'Read our latest insights on the Lagos real estate market.',
          coverImage: signedCoverImage,
          readTime: data.readTime || calculateReadTime(content)
        } as BlogPost;
      })
    );

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
      length: sortedPosts.length
    };
  } catch (error) {
    console.error('Error loading blog posts:', error);
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
        console.warn(`Blog post ${slug} not found`);
        return null;
      }
    }

    if (!fileExists) {
      return null;
    }

    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const htmlContent = marked(content);

    const coverImage = data.coverImage || 'images/blog/default-cover.jpg';
    const signedCoverImage = await getSignedUrl(coverImage);

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
      excerpt: data.excerpt || 'Read our latest insights on the Lagos real estate market.',
      coverImage: signedCoverImage,
      readTime: data.readTime || calculateReadTime(content)
    } as BlogPost;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
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

export async function getPostsByCategory(category: string, page = 1, limit = 9): Promise<{ posts: BlogPost[], totalPages: number }> {
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
    totalPages
  };
}

export async function getPostsByTag(tag: string, page = 1, limit = 9): Promise<{ posts: BlogPost[], totalPages: number }> {
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
    totalPages
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