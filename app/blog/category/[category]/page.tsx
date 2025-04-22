// app/blog/category/[category]/page.tsx
import React from 'react';
import Link from 'next/link';
// Import Metadata type for generateMetadata
import { type Metadata } from 'next';

import { getPostsByCategory, getAllCategories } from '@/lib/blogHelpers';
import BlogCard from '@/app/components/BlogCard';
import Pagination from '@/app/components/Pagination';

// Use Metadata type for generateMetadata return
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> { // params is plain object
    const category = decodeURIComponent(params.category);
    return {
        title: `${category} | Abiterra Real Estate Blog`,
        description: `Explore articles on ${category} in the Lagos real estate market, including buying guides, investment tips, and market trends.`,
        keywords: [category.toLowerCase(), 'lagos real estate', 'property insights', 'nigeria real estate'],
        alternates: {
            canonical: `https://abiterra.com/blog/category/${encodeURIComponent(category.toLowerCase())}` // Absolute canonical
        },
        openGraph: {
            title: `${category} | Abiterra Real Estate Blog`,
            description: `Explore articles on ${category} in the Lagos real estate market.`,
            url: `https://abiterra.com/blog/category/${encodeURIComponent(category.toLowerCase())}`, // Absolute URL
            images: [
                {
                    url: 'https://abiterra.com/images/blog/blog-cover.jpg', // Ensure absolute URL
                    width: 1200,
                    height: 630,
                    alt: `${category} - Abiterra Real Estate Blog`,
                },
            ],
        },
         // Add twitter metadata if desired
    };
}

// Corrected page component signature
export default async function Page({
    params, // params is plain object
    searchParams, // searchParams is plain object
}: {
    params: { category: string };
    searchParams?: { [key: string]: string | string[] | undefined }; // Use standard Record type
}) {
    const category = decodeURIComponent(params.category);
    // Access searchParams.page directly with optional chaining and casting
    const currentPage = searchParams?.page ? parseInt(searchParams.page as string) : 1;

    const { posts, totalPages } = await getPostsByCategory(category, currentPage, 9);
    const categories = await getAllCategories();

     // Ensure structured data URLs are absolute
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category} - Abiterra Real Estate Blog`,
        description: `Articles on ${category} in the Lagos real estate market.`,
        url: `https://abiterra.com/blog/category/${encodeURIComponent(category.toLowerCase())}`, // Absolute URL
        breadcrumb: { // Ensure absolute URLs in breadcrumb
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
                    name: category,
                    item: `https://abiterra.com/blog/category/${encodeURIComponent(category.toLowerCase())}`,
                },
            ],
        },
    };

    return (
        <>
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* Prev/Next Links */}
            {totalPages > 1 && (
                <>
                    {currentPage > 1 && (
                        <link rel="prev" href={`https://abiterra.com/blog/category/${params.category}?page=${currentPage - 1}`} /> // Absolute URL
                    )}
                    {currentPage < totalPages && (
                        <link rel="next" href={`https://abiterra.com/blog/category/${params.category}?page=${currentPage + 1}`} /> // Absolute URL
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

                {/* Blog Posts Grid */}
                 {posts && posts.length > 0 && ( // Check if posts exist and have items
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                 )}


                {/* Pagination */}
                 {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        baseUrl={`/blog/category/${params.category}`}
                    />
                 )}
            </div>
        </>
    );
}