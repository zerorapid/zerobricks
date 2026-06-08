import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, Home, ExternalLink } from 'lucide-react';
import { BlogPost, fetchBlogPosts, deleteBlogPost } from '../../lib/blogApi';
import { format } from 'date-fns';

export default function BlogAdminList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    const data = await fetchBlogPosts();
    setPosts(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const success = await deleteBlogPost(id);
      if (success) {
        loadPosts();
      } else {
        alert('Failed to delete post.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600/10 selection:text-blue-600 antialiased">
      <Helmet>
        <title>Admin - Blog Posts | ZeroBricks</title>
      </Helmet>

      {/* Admin Navbar */}
      <nav className="sticky top-0 bg-slate-900 text-white z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tight uppercase italic">ZB Admin</h1>
            <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-bold rounded">BLOG</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" /> Go to Site
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Blog Posts</h2>
            <p className="text-sm font-medium text-slate-500">Manage your website's journal entries.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/blogs/new')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Post
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                        No blog posts found. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    posts.map(post => (
                      <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {post.title}
                          <div className="text-xs text-slate-400 font-normal mt-0.5 font-mono">{post.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200 uppercase">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                          {format(new Date(post.created), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <button 
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Public Post"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/blogs/edit/${post.id}`)}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Post"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
