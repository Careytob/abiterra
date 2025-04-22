// app/blog/[slug]/page.tsx
import React from 'react';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blogHelpers';
import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '@/app/components/BlogCard';
import SocialShareButtons from '@/app/components/SocialShareButtons';
import { type Metadata } from 'next'; // Import Metadata type

// Corrected generateMetadata function
export async function generateMetadata({
    params, // params is a plain object, not a Promise
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const { slug } = params; // Access slug directly, no await

    // Fetch post data to get dynamic metadata
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        // Optionally return a basic metadata or throw notFound()
        return {
             title: 'Post Not Found | Abiterra Real Estate',
             description: 'The requested blog post was not found.',
        };
    }

    return {
        title: `${post.title} | Abiterra Real Estate Blog`, // Use post data for title
        description: post.excerpt, // Use post excerpt for description
        keywords: post.tags.join(', ') + ', lagos real estate blog, nigeria property insights', // Use post tags
        alternates: {
            canonical: `https://abiterra.com/blog/${post.slug}` // Canonical URL
        },
        openGraph: {
            title: `${post.title} | Abiterra Real Estate Blog`,
            description: post.excerpt,
            url: `https://abiterra.com/blog/${post.slug}`,
            type: 'article', // Use article type for blog posts
            images: post.coverImage ? [{ // Ensure absolute URL for OG image
                 url: `https://abiterra.com${post.coverImage}`, // Make absolute
                 width: 1200,
                 height: 630,
                 alt: `${post.title} - Lagos real estate article`,
            }] : [], // Provide empty array if no image
            publishedTime: post.publishDate ? new Date(post.publishDate).toISOString() : undefined, // ISO format
            modifiedTime: post.publishDate ? new Date(post.publishDate).toISOString() : undefined, // ISO format (or use update date if available)
        },
        twitter: {
            card: 'summary_large_image',
            title: `${post.title} | Abiterra Real Estate Blog`,
            description: post.excerpt,
             images: post.coverImage ? [`https://abiterra.com${post.coverImage}`] : [], // Ensure absolute URL
        },
         // Consider adding article:publisher, article:author etc. for OG/Twitter if desired
    };
}

// Corrected page component signature
export default async function BlogPostPage({
    params, // params is a plain object, not a Promise
}: {
    params: { slug: string };
}) {
    const { slug } = params; // Access slug directly, no await
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        // Use Next.js's notFound function for a better 404 experience
        // import { notFound } from 'next/navigation';
        // notFound();
        // Or render a custom not found message as you were doing
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

    // Ensure Schema.org dates are in ISO 8601 format and image URL is absolute
    const articleStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.publishDate ? new Date(post.publishDate).toISOString() : undefined,
        dateModified: post.publishDate ? new Date(post.publishDate).toISOString() : undefined, // Use update date if available
        author: {
            '@type': 'Person',
            name: post.author
        },
        image: post.coverImage
            ? {
                '@type': 'ImageObject',
                url: `https://abiterra.com${post.coverImage}`, // Make absolute for Schema.org
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
                url: 'https://abiterra.com/logo.png', // Ensure absolute URL
                width: 200,
                height: 60,
            }
        },
        description: post.excerpt,
        keywords: post.tags.join(', '),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://abiterra.com/blog/${post.slug}` // Use absolute URL
        },
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
                    name: post.title,
                    item: `https://abiterra.com/blog/${post.slug}`,
                },
            ],
        },
    };

    return (
        <>
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
            />

            <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl flex flex-col md:flex-row gap-8">
                {/* Using max-w-none here if prose applies max-width */}
                <article className="prose lg:prose-xl max-w-none md:max-w-4xl mb-12">
                    <header className="mb-8">
                        {/* Display category */}
                        {post.category && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block mb-2">
                                {post.category}
                            </span>
                        )}
                        <h1 className="text-4xl font-bold mt-0 mb-2">{post.title}</h1> {/* Adjust margin-top if category added margin-bottom */}
                        <div className="flex items-center text-gray-500 text-sm">
                            {/* Display author if available */}
                             {post.author && <span>{post.author}</span>}
                             {post.author && post.publishDate && <span className="mx-2">•</span>}
                            {/* Display formatted publish date if available */}
                             {post.publishDate && (
                                <span>
                                    {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            )}
                            {post.readTime && (post.author || post.publishDate) && <span className="mx-2">•</span>} {/* Add dot only if author or date exists */}
                             {/* Display read time if available */}
                            {post.readTime && <span>{post.readTime} min read</span>}
                        </div>
                        {/* Cover Image */}
                        {post.coverImage && (
                            <Image
                                src={post.coverImage} // Path should be relative to public or handle absolute if stored externally
                                alt={`${post.title} - Lagos real estate article`}
                                width={1200} // Use actual dimensions or adjust layout
                                height={630} // Use actual dimensions or adjust layout
                                className="w-full h-64 object-cover rounded-lg mt-4"
                                priority
                                unoptimized={false} // Set unoptimized to false unless you have a specific reason
                            />
                        )}
                    </header>
                    {/* Blog Post Content */}
                    {/* Check if post.htmlContent exists before using dangerouslySetInnerHTML */}
                    {post.htmlContent && <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />}
                </article>

                 {/* Sidebar/Aside - Keep as is */}
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
                {/* Tags Section */}
                {post.tags && post.tags.length > 0 && ( // Check if tags exist and have items
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
                )}

                 {/* Social Share Buttons - Keep as is */}
                {/* Ensure SocialShareButtons component handles potential null/undefined post props */}
                <SocialShareButtons slug={post.slug} title={post.title} />

                {/* Related Articles Section */}
                {relatedPosts && relatedPosts.length > 0 && ( // Check if relatedPosts exist and have items
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map(relatedPost => (
                                <BlogCard key={relatedPost.slug} post={relatedPost} />
                            ))}
                        </div>
                    </div>
                )}

                 {/* Call to Action - Keep as is */}
                <div className="bg-blue-50 p-8 rounded-lg text-center mt-12 mb-10">
                    <h3 className="text-2xl font-bold mb-3">Looking for properties?</h3>
                    <p className="mb-6">Explore our exclusive listings of properties for sale and rent.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/buy" className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700">
                            Browse Properties for Sale
                        </Link>
                         {/* Rental Link - Keep commented out */}
                         {/*
                             <Link href="/rent" className="bg-white text-teal-600 border border-teal-600 px-6 py-3 rounded hover:bg-gray-50">
                           View Rental Properties
                         </Link>
                         */}

                    </div>
                </div>
            </div>
        </>
    );
}

// Remove the duplicate static metadata export at the bottom
// export const metadata = {
//   title: 'Blog Post | Abiterra Real Estate',
//   description: 'Explore our real estate blog for insights on Lagos property market.',
// };