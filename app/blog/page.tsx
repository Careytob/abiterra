// app/blog/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getAllCategories } from '@/lib/blogHelpers';
import BlogCard from '@/app/components/BlogCard';
import Pagination from '@/app/components/Pagination';

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: 'Real Estate Blog | Property Insights & Guides | Abiterra',
  description: 'Expert insights on the Lagos property market, home buying guides, and real estate investment tips to help you make informed decisions.',
  keywords: [
    'real estate blog',
    'property insights',
    'Lagos real estate',
    'Nigeria real estate',
    'real estate investment tips',
    'home buying tips',
    'property buying guide',
    'real estate market trends',
    'Lagos property insights',
    'real estate news',
    'real estate advice',
    'Buying property in Nigeria',
    'property market',
    'home buying guide',
    'buying property in Lagos',
    'Lagos property market trends',
    'Nigeria real estate investment',
  ],
  alternates: {
    canonical: 'https://abiterra.com/blog',
  },
  openGraph: {
    title: 'Real Estate Blog | Property Insights & Guides | Abiterra',
    description: 'Expert insights on the Lagos property market, home buying guides, and real estate investment tips.',
    url: 'https://abiterra.com/blog',
    type: 'website',
    images: [
      {
        url: '/images/blog/blog-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Abiterra Real Estate Blog - Lagos Property Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Blog | Property Insights & Guides | Abiterra',
    description: 'Expert insights on the Lagos property market, home buying guides, and real estate investment tips.',
    images: ['/images/blog/blog-cover.jpg'],
  },
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
  const { posts: blogPosts, totalPages } = await getBlogPosts(currentPage, 9);
  const categories = await getAllCategories();

  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Abiterra Real Estate Blog',
    description: 'Expert insights on the Lagos property market, home buying guides, and real estate investment tips.',
    url: `https://abiterra.com/blog${currentPage > 1 ? `?page=${currentPage}` : ''}`,
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
      ],
    },
    hasPart: blogPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.publishDate,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      url: `https://abiterra.com/blog/${post.slug}`,
      image: {
        '@type': 'ImageObject',
        url: post.coverImage || '/images/blog/default-cover.jpg',
        width: 1200,
        height: 630,
        caption: post.title,
      },
      description: post.excerpt,
      keywords: post.tags.join(', '),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      {totalPages > 1 && (
        <>
          {currentPage > 1 && (
            <link rel="prev" href={`/blog?page=${currentPage - 1}`} />
          )}
          {currentPage < totalPages && (
            <link rel="next" href={`/blog?page=${currentPage + 1}`} />
          )}
        </>
      )}

      <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Real Estate Blog</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Expert insights, buying guides, and market trends to help you navigate the property market with confidence.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/blog"
            className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm hover:bg-teal-700"
          >
            All Posts
          </Link>
          {categories.map(category => (
            <Link
              key={category}
              href={`/blog/category/${encodeURIComponent(category.toLowerCase())}`}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-200"
            >
              {category}
            </Link>
          ))}
        </div>

        {blogPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Featured Post</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64">
                  {/* Log the image loading outside of JSX rendering */}
                  {blogPosts[0].coverImage ? (
                    console.log(`[BlogPage] Loading featured image: ${blogPosts[0].coverImage}`),
                    null
                  ) : null}
                  <Image
                    src={blogPosts[0].coverImage || '/images/blog/default-cover.jpg'}
                    alt={`${blogPosts[0].title} - Lagos real estate guide`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-6 md:w-1/2">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {blogPosts[0].category}
                    </span>
                    <span className="text-gray-500 text-sm ml-3">{blogPosts[0].publishDate}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{blogPosts[0].title}</h3>
                  <p className="text-gray-600 mb-4">{blogPosts[0].excerpt}</p>
                  <Link
                    href={`/blog/${blogPosts[0].slug}`}
                    className="inline-block bg-teal-600 text-white font-medium py-2 px-4 rounded hover:bg-teal-700 transition duration-300"
                  >
                    Read Full Article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/blog" />

        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
          <p className="mb-6">Subscribe to our newsletter for the latest property insights and market updates.</p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" aria-label="Newsletter subscription">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-teal-600 text-white font-medium py-2 px-6 rounded hover:bg-teal-700 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:justify-center gap-4">
          <Link
            href="/buy"
            className="w-full sm:w-auto bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 text-center"
          >
            Explore Properties for Sale
          </Link>
        </div>
      </div>
    </>
  );
}