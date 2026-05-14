import React, { useState } from 'react';
import CodeSlash from './tools/CodeSlash';
import { 
  Code2, 
  Terminal, 
  Layout, 
  Zap, 
  Settings,
  Plus,
  Search,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

type ToolType = 'dashboard' | 'codeslash';

export default function App() {
  const [currentTool, setCurrentTool] = useState<ToolType>('dashboard');

  if (currentTool === 'codeslash') {
    return <CodeSlash onBack={() => setCurrentTool('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-brand-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center border border-brand-primary/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none mb-1">ZEROBRICKS</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Premium Dev Toolbox</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-brand-primary transition-colors">Tools</a>
              <a href="#" className="hover:text-brand-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Support</a>
            </div>
            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-20">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
            Build Faster. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
              Zero Friction.
            </span>
          </h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg mb-10">
            A curated suite of high-performance tools for developers. Light on resources, heavy on productivity. Open source and free forever.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/5 text-xs font-bold text-slate-400">
              <Terminal className="w-4 h-4 text-brand-primary" />
              v1.0.0 STABLE
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <FilterChip label="All Tools" active />
            <FilterChip label="Development" />
            <FilterChip label="Design" />
            <FilterChip label="Data" />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard 
            title="CodeSlash"
            description="Live HTML/CSS/JS editor with instant preview. Perfect for prototyping UI components."
            icon={<Code2 className="w-8 h-8" />}
            onClick={() => setCurrentTool('codeslash')}
            badge="Popular"
            color="cyan"
          />
          
          <ToolCard 
            title="Coming Soon"
            description="We are architecting the next set of bricks. Stay tuned for more powerful tools."
            icon={<Plus className="w-8 h-8" />}
            onClick={() => {}}
            isPlaceholder
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-black tracking-widest uppercase">ZeroBricks 2026</span>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ToolCard({ title, description, icon, onClick, badge, color, isPlaceholder }: any) {
  return (
    <button 
      onClick={onClick}
      className={`group relative text-left p-8 rounded-[24px] border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all hover:border-brand-primary/20 hover:bg-slate-900/60 overflow-hidden ${isPlaceholder ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
        {icon}
      </div>
      
      {badge && (
        <span className="absolute top-8 right-8 px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-brand-primary/20">
          {badge}
        </span>
      )}

      <h3 className="text-2xl font-black tracking-tight mb-3 flex items-center gap-2">
        {title}
        {!isPlaceholder && <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-primary" />}
      </h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
        {description}
      </p>

      {!isPlaceholder && (
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Launch Tool <ExternalLink className="w-3 h-3" />
        </div>
      )}

      {/* Card Glow */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <button className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${active ? 'bg-brand-primary text-black border-brand-primary shadow-lg shadow-brand-primary/20' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'}`}>
      {label}
    </button>
  );
}
