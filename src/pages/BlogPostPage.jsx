import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Clock, ArrowLeft, ThumbsUp, Bookmark, Share2, Tag, Sparkles, ArrowRight } from "lucide-react";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import { motion, AnimatePresence } from "framer-motion";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [error, setError] = useState(null);

  // Get a random tech class for tags with color scheme similar to HeroSection
  const getTechClass = (tag) => {
    const classes = [
      "bg-cyan-400/20 text-cyan-200 border-cyan-400/30",
      "bg-green-400/20 text-green-200 border-green-400/30",
      "bg-blue-400/20 text-blue-200 border-blue-400/30",
      "bg-emerald-400/20 text-emerald-200 border-emerald-400/30",
      "bg-amber-400/20 text-amber-200 border-amber-400/30",
      "bg-indigo-400/20 text-indigo-200 border-indigo-400/30",
      "bg-fuchsia-400/20 text-fuchsia-200 border-fuchsia-400/30"
    ];
    
    // Ensure the same tag always gets the same style
    const tagIndex = tag.length % classes.length;
    return classes[tagIndex];
  };

  useEffect(() => {
    // Reset scroll position when the blog post changes
    window.scrollTo(0, 0);
    
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the API endpoint to get the specific blog post
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog post. Status: ${response.status}`);
        }
        
        const blogData = await response.json();
        
        // Format the blog post data
        const formattedPost = {
          id: blogData._id,
          _id: blogData._id,
          title: blogData.title,
          content: blogData.content,
          excerpt: blogData.content.substring(0, 150) + "...",
          date: new Date(blogData.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          author: blogData.author || "Anonymous",
          readTime: `${Math.ceil(blogData.content.split(' ').length / 200)} min read`,
          category: blogData.category || "General",
          imageUrl: blogData.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
          tags: blogData.tags || ["Web Development"],
          likes: blogData.likes || 0,
          createdAt: blogData.createdAt
        };
        
        setPost(formattedPost);
        
        // Fetch related posts (same category)
        if (formattedPost.category) {
          const relatedResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/blogs?category=${formattedPost.category}`
          );
          
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            
            // Filter out the current post and format the data
            const formattedRelated = relatedData
              .filter((blog) => blog._id !== id)
              .map((blog) => ({
                id: blog._id,
                _id: blog._id,
                title: blog.title,
                excerpt: blog.content.substring(0, 150) + "...",
                date: new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }),
                author: blog.author || "Anonymous",
                readTime: `${Math.ceil(blog.content.split(' ').length / 200)} min read`,
                category: blog.category || "General",
                imageUrl: blog.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                tags: blog.tags || ["Web Development"],
                likes: blog.likes || 0
              }))
              .slice(0, 3); // Limit to 3 related posts
              
            setRelatedPosts(formattedRelated);
          }
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError("Failed to load the blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [id]);

  // Generate table of contents from content
  const generateToc = () => {
    if (!post || !post.content) return [];
    
    const headingRegex = /<h([2-3])[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h\1>/g;
    const toc = [];
    let match;

    while ((match = headingRegex.exec(post.content)) !== null) {
      toc.push({
        level: parseInt(match[1], 10),
        id: match[2],
        title: match[3].trim()
      });
    }

    return toc;
  };

  const toc = generateToc();

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow homepage-section flex items-center justify-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-300 opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin"></div>
            <p className="mt-24 text-cyan-300 animate-pulse text-lg font-medium">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow homepage-section flex items-center justify-center">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-12 max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              {error ? "Error Loading Blog Post" : "Blog Post Not Found"}
            </h1>
            <p className="mt-2 text-slate-300 mb-6">
              {error || "The blog post you're looking for doesn't exist or has been removed."}
            </p>
            <Link 
              to="/blog" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow homepage-section overflow-hidden text-white">
        {/* Hero Banner */}
        <div className="relative">
          {/* Background Image with Overlay */}
          <div 
            className="w-full h-[60vh] relative bg-cover bg-center bg-fixed"
            style={{ 
              backgroundImage: `url(${post.imageUrl})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30"></div>
            
            {/* Radial gradient for additional depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 mix-blend-multiply"></div>
            
            {/* Content Container */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center space-x-2 mb-6"
                >
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-400/20 text-indigo-200 font-medium text-sm border border-indigo-400/30">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    {post.category}
                  </span>
                </motion.div>
                
                <motion.h1 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-white-cyan-indigo mb-6"
                  variants={itemVariants}
                >
                  {post.title}
                </motion.h1>
                
                <motion.div 
                  className="flex flex-wrap justify-center items-center gap-6 text-slate-300 text-sm"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-indigo-300 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-indigo-300 mr-2" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-300 mr-2" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-5 w-5 text-indigo-300 mr-2" />
                    <span>{post.likes} likes</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Floating Action Buttons */}
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center space-x-3">
            <button 
              onClick={() => setLiked(!liked)}
              className={`p-3 rounded-full backdrop-blur-md flex items-center space-x-2 transition-all ${
                liked 
                  ? "bg-indigo-500/50 text-white border border-indigo-400/50" 
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <ThumbsUp className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              <span className="hidden md:inline">{liked ? "Liked" : "Like"}</span>
            </button>
            
            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-3 rounded-full backdrop-blur-md flex items-center space-x-2 transition-all ${
                bookmarked 
                  ? "bg-amber-500/50 text-white border border-amber-400/50" 
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
              <span className="hidden md:inline">{bookmarked ? "Saved" : "Save"}</span>
            </button>
            
            <button 
              className="p-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </button>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Table of Contents - Desktop */}
            {toc.length > 0 && (
              <div className="hidden lg:block col-span-1">
                <div className="sticky top-24">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6">
                    <button 
                      className="flex items-center justify-between w-full text-left mb-4"
                      onClick={() => setShowToc(!showToc)}
                    >
                      <h3 className="text-lg font-medium text-white">Table of Contents</h3>
                    </button>
                    <nav>
                      <ul className="space-y-3">
                        {toc.map((heading, index) => (
                          <li key={index} className={`${heading.level === 3 ? "ml-4" : ""}`}>
                            <a
                              href={`#${heading.id}`}
                              className="text-slate-300 hover:text-cyan-300 transition-colors text-sm block py-1"
                            >
                              {heading.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={toc.length > 0 ? "col-span-1 lg:col-span-3" : "col-span-1 lg:col-span-4"}>
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-3">
                  {post.tags.map(tag => (
                    <Link 
                      key={tag} 
                      to={`/blog?tag=${tag}`}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all hover:-translate-y-1 border ${getTechClass(tag)}`}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Table of Contents - Mobile */}
              {toc.length > 0 && (
                <div className="lg:hidden mb-8">
                  <button 
                    onClick={() => setShowToc(!showToc)} 
                    className="flex items-center justify-between w-full p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white mb-2"
                  >
                    <span className="font-medium">Table of Contents</span>
                    <span className={`transform transition-transform ${showToc ? 'rotate-180' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {showToc && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4"
                      >
                        <nav>
                          <ul className="space-y-3">
                            {toc.map((heading, index) => (
                              <li key={index} className={`${heading.level === 3 ? "ml-4" : ""}`}>
                                <a
                                  href={`#${heading.id}`}
                                  className="text-slate-300 hover:text-cyan-300 transition-colors text-sm block py-1"
                                >
                                  {heading.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Post Content */}
              <motion.article 
                className="prose prose-lg prose-invert max-w-none backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 md:p-10"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: post.content || '' }}
                  className="prose-headings:text-white prose-headings:scroll-mt-24 prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-white/10 prose-pre:backdrop-blur-md prose-code:text-cyan-300"
                ></div>
              </motion.article>
              
              {/* Post Actions */}
              <div className="mt-10 flex flex-wrap justify-between items-center">
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-indigo-300 hover:text-indigo-200 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> 
                  <span>Back to all articles</span>
                </Link>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center space-x-2 ${
                      liked ? "text-indigo-300" : "text-slate-400 hover:text-indigo-300"
                    } transition-colors`}
                  >
                    <ThumbsUp className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                    <span>{post.likes} {liked ? "Liked" : "Likes"}</span>
                  </button>
                  
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`flex items-center space-x-2 ${
                      bookmarked ? "text-amber-300" : "text-slate-400 hover:text-amber-300"
                    } transition-colors`}
                  >
                    <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
                    <span>{bookmarked ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gradient-white-cyan-indigo mb-8 flex items-center">
                <Tag className="h-6 w-6 mr-2 text-cyan-300" />
                Related Articles
              </h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {relatedPosts.map((post) => (
                  <motion.article 
                    key={post.id} 
                    variants={itemVariants}
                    className="backdrop-blur-xl bg-white/10 rounded-xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                  >
                    <Link to={`/blog/${post.id}`} className="block relative overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 w-full">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                      
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-indigo-500/30 text-indigo-100 rounded-full text-xs font-medium border border-indigo-500/40 backdrop-blur-sm">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </Link>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center gap-3 text-sm text-slate-300 mb-2">
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-indigo-300" />
                          {post.readTime}
                        </span>
                      </div>
                      
                      <Link to={`/blog/${post.id}`} className="block group mt-1">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-slate-300 mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto">
                        <Link
                          to={`/blog/${post.id}`}
                          className="inline-flex items-center text-sm text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
                        >
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;