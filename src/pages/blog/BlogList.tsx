import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { BlogPost, fetchBlogPosts } from '../../lib/blogApi';
import { format } from 'date-fns';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPosts() {
      const data = await fetchBlogPosts();
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600/10 selection:text-blue-600 antialiased overflow-x-hidden">
      <Helmet>
        <title>Blog | ZeroBricks</title>
        <meta name="description" content="Read the latest articles, tutorials, and updates from the ZeroBricks team." />
      </Helmet>

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
      </div>

      {/* Modern Navbar */}
      <nav className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-black tracking-tighter leading-none text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">ZeroBricks</h1>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-600">
            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>Home</span>
            <span className="text-blue-600">Blog</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative z-10">
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm text-blue-600">
            Insights & Updates
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6 text-slate-900">
            The ZeroBricks <span className="text-slate-300">Journal.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Discover articles, engineering deep-dives, and updates from the creators of ZeroBricks.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white p-8 rounded-[32px] border border-slate-200 h-[300px]">
                <div className="w-24 h-6 bg-slate-100 rounded-lg mb-6"></div>
                <div className="w-full h-10 bg-slate-100 rounded-xl mb-4"></div>
                <div className="w-3/4 h-10 bg-slate-100 rounded-xl mb-8"></div>
                <div className="w-full h-4 bg-slate-100 rounded-md mb-2"></div>
                <div className="w-2/3 h-4 bg-slate-100 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[32px] border border-dashed border-slate-300">
            <h3 className="text-xl font-bold text-slate-400 mb-2">No posts yet</h3>
            <p className="text-slate-500">Check back later for new articles!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div 
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group bg-white p-8 rounded-[32px] border border-slate-200 transition-all duration-500 cursor-pointer relative overflow-hidden hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3 flex-grow">
                    {post.meta_description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(post.created), 'MMM dd, yyyy')}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
