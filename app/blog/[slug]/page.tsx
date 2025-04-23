// app/blog/[slug]/page.tsx
import React from 'react';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blogHelpers';
import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '@/app/components/BlogCard';
import SocialShareButtons from '@/app/components/SocialShareButtons';

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: 'Blog Post | Abiterra Real Estate',
  description: 'Explore our real estate blog for insights on Lagos property market.',
};

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-lg mb-8">Sorry, the blog post you're looking for doesn't exist.</p>
        <Link href="/blog" className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700">
          Back to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category, post.tags, 3);

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    image: post.coverImage
      ? {
          '@type': 'ImageObject',
          url: post.coverImage,
          width: 1200,
          height: 630,
          caption: post.title,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Abiterra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://abiterra.com/logo.png',
        width: 200,
        height: 60,
      },
    },
    description: post.excerpt,
    keywords: post.tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://abiterra.com/blog/${post.slug}`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://abiterra.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://abiterra.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://abiterra.com/blog/${post.slug}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl flex flex-col md:flex-row gap-8">
        <article className="prose lg:prose-xl max-w-4xl mb-12">
          <header className="mb-8">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {post.category}
            </span>
            <h1 className="text-4xl font-bold mt-4 mb-2">{post.title}</h1>
            <div className="flex items-center text-gray-500 text-sm">
              <span>{post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.publishDate}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime} min read</span>
            </div>
            {post.coverImage && (
              <>
                {post.coverImage && console.log(`[BlogPost] Loading cover image: ${post.coverImage}`)}
                <Image
                  src={post.coverImage}
                  alt={`${post.title} - Lagos real estate article`}
                  width={1200}
                  height={630}
                  className="w-full h-64 object-cover rounded-lg mt-4"
                  priority
                />
              </>
            )}
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.htmlContent ?? '' }} />
        </article>

        <aside className="md:w-1/3 sticky top-28 self-start">
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-3">Explore Properties</h3>
            <p className="mb-4">Find your dream home in Lagos today.</p>
            <Link href="/buy" className="block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 mb-2 text-center">
              Browse Properties for Sale
            </Link>
          </div>
        </aside>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <SocialShareButtons slug={post.slug} title={post.title} />

        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-8 rounded-lg text-center mt-12 mb-10">
          <h3 className="text-2xl font-bold mb-3">Looking for properties?</h3>
          <p className="mb-6">Explore our exclusive listings of properties for sale and rent.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/buy" className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700">
              Browse Properties for Sale
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}