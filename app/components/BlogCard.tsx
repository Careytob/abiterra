// components/BlogCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image 
          src={post.coverImage || '/images/blog/default-cover.jpg'} 
          alt={`${post.title} - Real estate insights in Lagos`} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {post.category}
          </span>
          <span className="text-gray-500 text-sm ml-2">{post.publishDate}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-teal-600 font-medium hover:text-teal-800"
            aria-label={`Read more about ${post.title}`}
          >
            Read more about {post.title}
          </Link>
          <span className="text-sm text-gray-500">{post.readTime} min read</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;