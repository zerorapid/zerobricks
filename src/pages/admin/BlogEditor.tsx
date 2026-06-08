import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { fetchBlogPostById, createBlogPost, updateBlogPost, BlogPostInput } from '../../lib/blogApi';

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogPostInput>({
    title: '',
    slug: '',
    category: '',
    meta_title: '',
    meta_description: '',
    keywords: '',
    content: ''
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your amazing article here...',
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[400px] focus:outline-none bg-white p-6 rounded-xl border border-slate-200'
      }
    }
  });

  useEffect(() => {
    if (isEditing && id) {
      loadPost(id);
    }
  }, [id, isEditing]);

  async function loadPost(postId: string) {
    const post = await fetchBlogPostById(postId);
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        category: post.category,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        keywords: post.keywords,
        content: post.content
      });
      editor?.commands.setContent(post.content);
    }
    setLoading(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title if it's not editing and user types in title
      ...(name === 'title' && !isEditing ? { slug: generateSlug(value) } : {})
    }));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      alert("Title and Slug are required!");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && id) {
        await updateBlogPost(id, formData);
      } else {
        await createBlogPost(formData);
      }
      navigate('/admin/blogs');
    } catch (error: any) {
      alert("Failed to save post: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600/10 selection:text-blue-600 antialiased">
      <Helmet>
        <title>{isEditing ? 'Edit Post' : 'New Post'} | ZeroBricks Admin</title>
      </Helmet>

      {/* Admin Navbar */}
      <nav className="sticky top-0 bg-slate-900 text-white z-50 shadow-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/blogs')}
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold tracking-tight">
              {isEditing ? 'Edit Blog Post' : 'Create New Post'}
            </h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-8 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Post Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Content</label>
            {/* Editor Toolbar */}
            <div className="bg-white border border-slate-200 border-b-0 rounded-t-xl p-2 flex items-center gap-1">
              <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-slate-100 ${editor?.isActive('bold') ? 'bg-slate-100 text-blue-600' : 'text-slate-600'}`}><b>B</b></button>
              <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-slate-100 italic ${editor?.isActive('italic') ? 'bg-slate-100 text-blue-600' : 'text-slate-600'}`}>I</button>
              <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-slate-100 font-bold ${editor?.isActive('heading', { level: 2 }) ? 'bg-slate-100 text-blue-600' : 'text-slate-600'}`}>H2</button>
              <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-slate-100 font-bold ${editor?.isActive('heading', { level: 3 }) ? 'bg-slate-100 text-blue-600' : 'text-slate-600'}`}>H3</button>
              <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-slate-100 ${editor?.isActive('bulletList') ? 'bg-slate-100 text-blue-600' : 'text-slate-600'}`}>• List</button>
            </div>
            {/* TipTap Content */}
            <div className="[&>.ProseMirror]:min-h-[400px] [&>.ProseMirror]:border-t-0 [&>.ProseMirror]:rounded-t-none">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Right Column: Meta & Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Post Settings</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Slug (URL)</label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="my-post-slug"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <input 
                type="text" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Engineering, News"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">SEO Details</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meta Title</label>
              <input 
                type="text" 
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                placeholder="SEO Title (50-60 chars)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <p className="text-[10px] text-slate-400">{formData.meta_title.length} chars</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meta Description</label>
              <textarea 
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief summary for search engines..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
              />
              <p className="text-[10px] text-slate-400">{formData.meta_description.length} chars (ideal ~150-160)</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Keywords</label>
              <input 
                type="text" 
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="react, web dev, tools..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
