import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CodeSlash from './tools/CodeSlash';
import SVG2Code from './tools/svg2code/SVG2Code';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import Rive, { Layout as RiveLayout, Fit, Alignment } from '@rive-app/react-canvas';
import { 
  Code2, 
  Zap, 
  Settings,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Github,
  Monitor,
  FileCode
} from 'lucide-react';

type ToolType = 'dashboard' | 'codeslash' | 'svg2code';

export default function App() {
  return (
    <Router basename="/zerobricks">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/codeslash" element={<CodeSlashWrapper />} />
        <Route path="/svg2code" element={<SVG2CodeWrapper />} />
      </Routes>
    </Router>
  );
}

function CodeSlashWrapper() {
  const navigate = useNavigate();
  return <CodeSlash onBack={() => navigate('/')} />;
}

function SVG2CodeWrapper() {
  const navigate = useNavigate();
  return <SVG2Code onBack={() => navigate('/')} />;
}

function Dashboard() {
  const navigate = useNavigate();
  return (
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
            <div className="h-10 flex items-center justify-center group-hover:scale-105 transition-all">
              <img src="/zerobricks/zerobricks_logo.svg" alt="ZeroBricks" className="h-8 w-auto invert" />
            </div>
            <h1 className="text-xl font-black tracking-tight leading-none text-slate-900">ZeroBricks</h1>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/zerorapid/zerobricks" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Github className="w-4 h-4" /> Source
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
              {/* Triangle pointer */}
              <div className="absolute -bottom-2 left-0 w-0 h-0 border-t-[10px] border-t-slate-900 border-r-[10px] border-r-transparent"></div>
            </div>
            
            <DotLottiePlayer
              src={`/zerobricks/cat-meow.json?v=${Date.now()}`}
              autoplay
              loop
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </section>

        {/* Tools Grid */}
        <section id="bricks-grid" className="relative z-20">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">The Collection</h3>
            <div className="h-[1px] w-full bg-slate-200/60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/codeslash')}
              className="group bg-white p-8 rounded-[32px] border border-slate-200 hover:border-blue-500/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 shadow-lg overflow-hidden">
                <img src="/zerobricks/codeslash_icon_only.svg" alt="CodeSlash" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-600 transition-colors">CodeSlash</h3>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                  The ultimate prototyping editor. Write HTML/CSS/JS with a live preview and instant export capabilities.
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">STABLE</span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg">V1.0</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/svg2code')}
              className="group bg-white p-8 rounded-[32px] border border-slate-200 hover:border-purple-500/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 shadow-lg overflow-hidden">
                <img src="/zerobricks/svg2code_icon_only.svg" alt="SVG2Code" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-purple-600 transition-colors">SVG2Code</h3>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                  Convert SVG files to clean React components or optimized SVG code instantly with live preview and color editing.
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-lg border border-purple-100">NEW</span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg">V1.0</span>
                </div>
              </div>
            </div>

            <div className="group bg-white/40 p-8 rounded-[32px] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-400 mb-2">Next Brick</h3>
              <p className="text-xs text-slate-400 font-medium max-w-[200px]">
                Architecting more powerful utilities for your workflow.
              </p>
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
              className="group flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500/30 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
            >
              <span className="text-slate-500 font-medium transition-colors group-hover:text-slate-600">Built with ❤️ by</span>
              <span className="text-slate-900 font-black tracking-tight text-lg italic">ZeroRapid</span>
            </a>
            <a 
              href="mailto:hello@zerorapid.in" 
              className="text-slate-400 hover:text-blue-600 transition-colors font-medium tracking-tight"
            >
              hello@zerorapid.in
            </a>
          </div>
          <div className="flex items-center gap-3 opacity-30 select-none">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">ZeroBricks Lab © {new Date().getFullYear()}</span>
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}
