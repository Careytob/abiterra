// types/blog.ts
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    author: string;
    publishDate: string;
    category: string;
    tags: string[];
    excerpt: string;
    content: string;
    htmlContent?: string; 
    coverImage?: string;
    readTime?: number;
  }