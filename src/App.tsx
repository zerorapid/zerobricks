import React, { useState } from 'react';
import CodeSlash from './tools/CodeSlash';
import { 
  Code2, 
  Terminal, 
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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-black">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none mb-1">ZEROBRICKS</h1>
              <p className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em]">High-Performance Toolbox</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest">
              <a href="#" className="hover:underline underline-offset-4 decoration-2">Tools</a>
              <a href="#" className="hover:underline underline-offset-4 decoration-2">GitHub</a>
              <a href="#" className="hover:underline underline-offset-4 decoration-2">Docs</a>
            </div>
            <button className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl mb-24">
          <div className="inline-block px-3 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest mb-8">
            Build Status: Stable
          </div>
          <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 uppercase">
            Build <br />Faster.
          </h2>
          <p className="text-xl text-black font-bold leading-tight max-w-xl mb-12">
            A curated suite of high-performance tools. Pure solid logic. No gradients, no shadows, just results.
          </p>
          <div className="flex items-center gap-4">
            <button className="px-10 py-4 bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all">
              Explore Tools
            </button>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <Terminal className="w-4 h-4" /> v1.0.0
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-16">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            <input 
              type="text" 
              placeholder="SEARCH_TOOLS..." 
              className="w-full bg-white border-4 border-black py-5 pl-14 pr-6 text-sm font-black uppercase focus:outline-none placeholder:text-black/30"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ToolCard 
            title="CodeSlash"
            description="Live HTML/CSS/JS editor with instant preview. Prototyping built for speed."
            icon={<Code2 className="w-10 h-10" />}
            onClick={() => setCurrentTool('codeslash')}
            badge="ACTIVE"
          />
          
          <ToolCard 
            title="Next Brick"
            description="Architecting the next set of tools. High-contrast utilities coming soon."
            icon={<Plus className="w-10 h-10" />}
            onClick={() => {}}
            isPlaceholder
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-black tracking-tighter uppercase">ZeroBricks ToolSuite © 2026</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
            <a href="#" className="hover:underline underline-offset-4">Open Source</a>
            <a href="#" className="hover:underline underline-offset-4">Privacy</a>
            <a href="#" className="hover:underline underline-offset-4">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ToolCard({ title, description, icon, onClick, badge, isPlaceholder }: any) {
  return (
    <button 
      onClick={onClick}
      className={`group relative text-left p-10 border-4 border-black bg-white transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)] ${isPlaceholder ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div className="w-16 h-16 border-2 border-black flex items-center justify-center mb-8 bg-white group-hover:bg-black group-hover:text-white transition-colors">
        {icon}
      </div>
      
      {badge && (
        <span className="absolute top-10 right-10 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest">
          {badge}
        </span>
      )}

      <h3 className="text-3xl font-black tracking-tighter mb-4 uppercase flex items-center justify-between">
        {title}
        {!isPlaceholder && <ArrowRight className="w-6 h-6" />}
      </h3>
      <p className="text-black/70 text-sm font-bold leading-snug mb-8 uppercase">
        {description}
      </p>

      {!isPlaceholder && (
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:underline underline-offset-4 decoration-2">
          Launch Tool <ExternalLink className="w-4 h-4" />
        </div>
      )}
    </button>
  );
}
