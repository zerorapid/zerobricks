import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { BlogPost as IBlogPost, fetchBlogPostBySlug } from '../../lib/blogApi';
import { format } from 'date-fns';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (slug) {
        const data = await fetchBlogPostBySlug(slug);
        setPost(data);
      }
      setLoading(false);
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <span className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">404</h2>
        <p className="text-xl text-slate-500 font-medium mb-8">This article could not be found.</p>
        <button 
          onClick={() => navigate('/blog')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600/10 selection:text-blue-600 antialiased overflow-x-hidden">
      <Helmet>
        <title>{post.meta_title} | ZeroBricks Blog</title>
        <meta name="description" content={post.meta_description} />
        <meta name="keywords" content={post.keywords} />
      </Helmet>

      {/* Modern Navbar */}
      <nav className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-black tracking-tighter leading-none text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">ZeroBricks</h1>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-600">
            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>Home</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/blog')}>Blog</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-32">
        <button 
          onClick={() => navigate('/blog')}
          className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all articles
        </button>

        <article>
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 flex items-center gap-1.5 uppercase tracking-widest">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(post.created), 'MMMM dd, yyyy')}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-8 text-slate-900">
              {post.title}
            </h1>
            
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              {post.meta_description}
            </p>
          </header>

          {/* Render Rich Text HTML */}
          <div 
            className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-slate-200 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </div>
  );
}
