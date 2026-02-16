import React, { useEffect, useState, useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const HASHNODE_API = 'https://gql.hashnode.com';
const HASHNODE_HOST = 'blog.sahilchouksey.in';

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shouldFetch, setShouldFetch] = useState(false);
    const sectionRef = useRef(null);
    
    const animation = useScrollAnimation('fadeInUp', { delay: 0, threshold: 0.1 });

    // IntersectionObserver to trigger fetch when section approaches viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !shouldFetch) {
                        setShouldFetch(true);
                    }
                });
            },
            {
                rootMargin: '200px', // Start fetching 200px before section enters viewport
                threshold: 0
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [shouldFetch]);

    // Fetch blogs only when shouldFetch is true
    useEffect(() => {
        if (!shouldFetch) return;

        const fetchBlogs = async () => {
            const query = `
                query Publication {
                    publication(host: "${HASHNODE_HOST}") {
                        posts(first: 3) {
                            edges {
                                node {
                                    id
                                    title
                                    brief
                                    slug
                                    coverImage {
                                        url
                                    }
                                    publishedAt
                                    readTimeInMinutes
                                    tags {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            try {
                const response = await fetch(HASHNODE_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query }),
                });

                const data = await response.json();
                
                if (data.errors) {
                    throw new Error(data.errors[0].message);
                }

                const posts = data.data?.publication?.posts?.edges?.map(edge => edge.node) || [];
                setBlogs(posts);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching blogs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [shouldFetch]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getGridClass = () => {
        if (blogs.length === 1) return 'blog-grid blog-grid-1';
        if (blogs.length === 2) return 'blog-grid blog-grid-2';
        return 'blog-grid blog-grid-3';
    };

    return (
        <section id="Blog" className="section" ref={(node) => {
            sectionRef.current = node;
            animation.ref.current = node;
        }}>
            <div className="container">
                <div className="blog-section-container">
                    {/* Header Row */}
                    <div className="blog-header-row">
                        <div className="blog-title-card">
                            <h2 className="sg-heading" style={{ marginBottom: '0' }}>blog.</h2>
                        </div>
                        <a 
                            href={`https://${HASHNODE_HOST}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blog-see-all-btn"
                        >
                            <span>See All</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>

                    {/* Blog Cards */}
                    {loading ? (
                        <div className="blog-loading">
                            <div className="blog-loading-spinner"></div>
                            <span>Loading posts...</span>
                        </div>
                    ) : error ? (
                        <div className="blog-error">
                            <span>Unable to load blog posts</span>
                        </div>
                    ) : (
                        <div className={getGridClass()}>
                            {blogs.map((blog) => (
                                <a
                                    key={blog.id}
                                    href={`https://${HASHNODE_HOST}/${blog.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="blog-card"
                                >
                                    {/* Cover Image */}
                                    {blog.coverImage?.url && (
                                        <div className="blog-card-image">
                                            <img 
                                                src={blog.coverImage.url} 
                                                alt={blog.title}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Content */}
                                    <div className="blog-card-content">
                                        {/* Tags */}
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="blog-card-tags">
                                                {blog.tags.slice(0, 2).map((tag, i) => (
                                                    <span key={i} className="blog-card-tag">{tag.name}</span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Title */}
                                        <h3 className="blog-card-title">{blog.title}</h3>
                                        
                                        {/* Brief */}
                                        <p className="blog-card-brief">{blog.brief}</p>
                                        
                                        {/* Meta */}
                                        <div className="blog-card-meta">
                                            <span className="blog-card-date">{formatDate(blog.publishedAt)}</span>
                                            <span className="blog-card-separator">·</span>
                                            <span className="blog-card-read-time">{blog.readTimeInMinutes} min read</span>
                                        </div>
                                    </div>

                                    {/* Arrow Icon */}
                                    <div className="blog-card-arrow">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
