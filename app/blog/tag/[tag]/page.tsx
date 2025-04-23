// app/blog/tag/[tag]/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPostsByTag, getAllCategories } from '@/lib/blogHelpers';
import BlogCard from '@/app/components/BlogCard';
import Pagination from '@/app/components/Pagination';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);

  return {
    title: `#${tag} | Abiterra Real Estate Blog`,
    description: `Explore articles tagged with ${tag} in the Lagos real estate market, including buying guides, investment tips, and market trends.`,
    keywords: [tag.toLowerCase(), 'lagos real estate', 'property insights', 'nigeria real estate'],
    alternates: {
      canonical: `https://abiterra.com/blog/tag/${encodeURIComponent(tag.toLowerCase())}`,
    },
    openGraph: {
      title: `#${tag} | Abiterra Real Estate Blog`,
      description: `Explore articles tagged with ${tag} in the Lagos real estate market.`,
      url: `https://abiterra.com/blog/tag/${encodeURIComponent(tag.toLowerCase())}`,
      images: [
        {
          url: 'https://abiterra.com/images/blog/blog-cover.jpg',
          width: 1200,
          height: 630,
          alt: `${tag} - Abiterra Real Estate Blog`,
        },
      ],
    },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { tag: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const tag = decodeURIComponent(params.tag);
  const currentPage = searchParams?.page ? parseInt(searchParams.page as string) : 1;

  const { posts, totalPages } = await getPostsByTag(tag, currentPage, 9);
  const categories = await getAllCategories();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `#${tag} - Abiterra Real Estate Blog`,
    description: `Articles tagged with ${tag} in the Lagos real estate market.`,
    url: `https://abiterra.com/blog/tag/${encodeURIComponent(tag.toLowerCase())}`,
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
          name: `#${tag}`,
          item: `https://abiterra.com/blog/tag/${encodeURIComponent(tag.toLowerCase())}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {totalPages > 1 && (
        <>
          {currentPage > 1 && (
            <link rel="prev" href={`https://abiterra.com/blog/tag/${encodeURIComponent(params.tag)}?page=${currentPage - 1}`} />
          )}
          {currentPage < totalPages && (
            <link rel="next" href={`https://abiterra.com/blog/tag/${encodeURIComponent(params.tag)}?page=${currentPage + 1}`} />
          )}
        </>
      )}
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">#{tag}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover articles tagged with {tag.toLowerCase()} in Lagos real estate.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/blog"
            className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm hover:bg-teal-700"
          >
            All Posts
          </Link>
          {categories.map(cat => (
            <Link
              key={cat}
              href={`/blog/category/${encodeURIComponent(cat.toLowerCase())}`}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-200"
            >
              {cat}
            </Link>
          ))}
        </div>

        {posts && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/blog/tag/${encodeURIComponent(params.tag)}`}
          />
        )}
      </div>
    </>
  );
}