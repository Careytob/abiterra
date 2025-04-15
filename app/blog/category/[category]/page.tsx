import React from 'react';
import Link from 'next/link';
import { getPostsByCategory, getAllCategories } from '@/lib/blogHelpers';
import BlogCard from '@/app/components/BlogCard';
import Pagination from '@/app/components/Pagination';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  return {
    title: `${category} | Abiterra Real Estate Blog`,
    description: `Explore articles on ${category} in the Lagos real estate market, including buying guides, investment tips, and market trends.`,
    keywords: [category.toLowerCase(), 'lagos real estate', 'property insights', 'nigeria real estate'],
    alternates: {
      canonical: `https://www.abiterra.com/blog/category/${encodeURIComponent(category.toLowerCase())}`
    },
    openGraph: {
      title: `${category} | Abiterra Real Estate Blog`,
      description: `Explore articles on ${category} in the Lagos real estate market.`,
      url: `https://www.abiterra.com/blog/category/${encodeURIComponent(category.toLowerCase())}`,
      images: [
        {
          url: '/images/blog/blog-cover.jpg',
          width: 1200,
          height: 630,
          alt: `${category} - Abiterra Real Estate Blog`,
        },
      ],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams?: { page?: string };
}) {
  const category = decodeURIComponent(params.category);
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const { posts, totalPages } = await getPostsByCategory(category, currentPage, 9);
  const categories = await getAllCategories();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} - Abiterra Real Estate Blog`,
    description: `Articles on ${category} in the Lagos real estate market.`,
    url: `https://www.abiterra.com/blog/category/${encodeURIComponent(category.toLowerCase())}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.abiterra.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://www.abiterra.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category,
          item: `https://www.abiterra.com/blog/category/${encodeURIComponent(category.toLowerCase())}`,
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
            <link rel="prev" href={`/blog/category/${params.category}?page=${currentPage - 1}`} />
          )}
          {currentPage < totalPages && (
            <link rel="next" href={`/blog/category/${params.category}?page=${currentPage + 1}`} />
          )}
        </>
      )}
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{category}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover expert insights and guides on {category.toLowerCase()} in Lagos.
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/blog/category/${params.category}`}
        />
      </div>
    </>
  );
}