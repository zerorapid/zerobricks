import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CodeSlash from './tools/CodeSlash';
import SVG2Code from './tools/svg2code/SVG2Code';
import CoffeeNote from './tools/CoffeeNote';
import Slugmakr from './tools/Slugmakr';
import BlogList from './pages/blog/BlogList';
import BlogPost from './pages/blog/BlogPost';
import BlogAdminList from './pages/admin/BlogAdminList';
import BlogEditor from './pages/admin/BlogEditor';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import { 
  Settings,
  ArrowRight,
  ArrowUpRight,
  Monitor,
  Plus
} from 'lucide-react';
import { toolsConfig, ToolConfig } from './config/tools';

const BASE = import.meta.env.BASE_URL;

export default function App() {
  return (
    <HelmetProvider>
      <Router basename={import.meta.env.VITE_BASE_PATH || "/zerobricks"}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/codeslash" element={<ToolWrapper id="codeslash" Component={CodeSlash} />} />
          <Route path="/svg2code" element={<ToolWrapper id="svg2code" Component={SVG2Code} />} />
          <Route path="/coffeenote" element={<ToolWrapper id="coffeenote" Component={CoffeeNote} />} />
          <Route path="/slugmakr" element={<ToolWrapper id="slugmakr" Component={Slugmakr} />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin/blogs" element={<BlogAdminList />} />
          <Route path="/admin/blogs/new" element={<BlogEditor />} />
          <Route path="/admin/blogs/edit/:id" element={<BlogEditor />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

// Universal Wrapper to safely inject SEO content below full-screen tools
function ToolWrapper({ id, Component }: { id: string, Component: React.ElementType }) {
  const navigate = useNavigate();
  const config = toolsConfig.find(t => t.id === id)!;
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative">
      <Helmet>
        <title>{config.seoH1} | ZeroBricks</title>
        <meta name="description" content={config.seoDescription} />
      </Helmet>
      
      {/* Tool Container (Restricted to 100vh so it acts like a full app) */}
      <div className="h-screen w-full shrink-0">
        <Component onBack={() => navigate('/')} />
      </div>

    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>ZeroBricks - Intelligent ToolSuite</title>
        <meta name="description" content="A high-performance collection of developer utilities built for speed." />
      </Helmet>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600/10 selection:text-blue-600 antialiased overflow-x-hidden">
        {/* Background Decor */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
        </div>

        {/* Modern Navbar */}
        <nav className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-2xl font-black tracking-tighter leading-none text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">ZeroBricks</h1>
            </div>

            <div className="flex items-center gap-4">
              <span 
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 text-slate-500 hover:text-blue-600 font-bold text-sm cursor-pointer transition-colors"
                onClick={() => navigate('/blog')}
              >
                Blog
              </span>
              <a 
                href="https://www.zerorapid.in" 
                target="_blank" 
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                Hire ZeroRapid Agency
              </a>
              <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                <Settings className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-12 pb-32 relative z-10">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="max-w-2xl relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 shadow-sm text-blue-600">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span> Intelligent ToolSuite
              </div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-slate-900">
                Universal Tools <br />
                <span className="text-slate-300">Zero Complexity.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
                A high-performance collection of developer utilities built for speed. 
                Lightweight, portable, and refined for the modern web.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => document.getElementById('bricks-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:bg-blue-600 hover:scale-[1.02] transition-all flex items-center gap-2 group"
                >
                  Explore Bricks <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-400 flex items-center gap-3">
                  <Monitor className="w-4 h-4" /> v1.0 Stable
                </div>
              </div>
            </div>

            {/* Large Interactive Robot Column */}
            <div className="relative h-[400px] lg:h-[700px] flex items-center justify-center overflow-visible group">
              {/* Floating Meow Bubble */}
              <div className="absolute top-[25%] left-[55%] bg-slate-900 px-6 py-3 rounded-2xl rounded-bl-none shadow-2xl z-30 animate-bounce transition-all transform hover:scale-110">
                <span className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  Meow! <span className="animate-pulse">🐾</span>
                </span>
                <div className="absolute -bottom-2 left-0 w-0 h-0 border-t-[10px] border-t-slate-900 border-r-[10px] border-r-transparent"></div>
              </div>
              
              <DotLottiePlayer
                src={`${BASE}cat-meow.json?v=${Date.now()}`}
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </section>

          {/* Tools Grid */}
          <section id="bricks-grid" className="relative z-20">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">The Collection</h3>
                <div className="hidden sm:block h-[1px] w-32 bg-slate-200/60" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Dynamically Rendered Scalable Tools */}
              {toolsConfig.map((tool: ToolConfig) => (
                <div 
                  key={tool.id}
                  onClick={() => navigate(tool.route)}
                  className={`group bg-white p-8 rounded-[32px] border border-slate-200 transition-all duration-500 cursor-pointer relative overflow-hidden ${tool.groupHoverColor}`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity ${tool.blurColor}`} />
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 overflow-hidden ${tool.iconContainerBg} ${tool.iconContainerShadow}`}>
                    {tool.iconNode}
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-2xl font-black tracking-tight transition-colors ${tool.textColorHover}`}>
                        {tool.name}
                      </h3>
                      <ArrowUpRight className={`w-5 h-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 ${tool.textColorHover}`} />
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 h-16">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-lg border ${tool.tagBg} ${tool.tagTextColor} ${tool.tagBorder}`}>
                        {tool.status}
                      </span>
                      <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg">
                        {tool.version}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="group bg-white/40 p-8 rounded-[32px] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-400 mb-2">Build With Us</h3>
                <p className="text-xs text-slate-400 font-medium max-w-[200px] mb-4">
                  Need a custom internal tool like these?
                </p>
                <a href="https://www.zerorapid.in" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
                  Contact ZeroRapid Agency
                </a>
              </div>

            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <a 
                href="https://www.zerorapid.in" 
                target="_blank" 
                rel="noreferrer" 
                className="group flex flex-col sm:flex-row items-center gap-3 px-8 py-4 bg-slate-50 border border-slate-200 rounded-3xl hover:border-blue-500/30 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 text-center"
              >
                <span className="text-slate-500 font-medium transition-colors group-hover:text-slate-600">Need Custom Software? Built with ❤️ by</span>
                <span className="text-slate-900 font-black tracking-tight text-xl italic group-hover:text-blue-600 transition-colors">ZeroRapid Agency</span>
              </a>
              <a 
                href="mailto:hello@zerorapid.in" 
                className="text-slate-400 hover:text-blue-600 transition-colors font-medium tracking-tight mt-2"
              >
                hello@zerorapid.in
              </a>
            </div>
            <div className="flex items-center gap-3 opacity-30 select-none">
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">ZeroBricks Portfolio © {new Date().getFullYear()}</span>
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
