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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          src={post.coverImage || '/images/blog/default-cover.jpg'}
          alt={`${post.title} - Lagos real estate guide`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {post.category}
          </span>
          <span className="text-gray-500 text-sm ml-3">{post.publishDate}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-block bg-teal-600 text-white font-medium py-2 px-4 rounded hover:bg-teal-700 transition duration-300"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;