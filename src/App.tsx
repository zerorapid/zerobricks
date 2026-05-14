import React, { useState } from 'react';
import CodeSlash from './tools/CodeSlash';
import { 
  Code2, 
  Terminal, 
  Zap, 
  Settings,
  Plus,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';

type ToolType = 'dashboard' | 'codeslash';

export default function App() {
  const [currentTool, setCurrentTool] = useState<ToolType>('dashboard');

  if (currentTool === 'codeslash') {
    return <CodeSlash onBack={() => setCurrentTool('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-600 selection:text-white">
      {/* Premium Navbar */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 bg-[#0F172A] rounded-ui flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none mb-1">ZeroBricks</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Dev Toolbox</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500 mr-6">
              <a href="#" className="hover:text-black transition-colors">Tools</a>
              <a href="#" className="hover:text-black transition-colors">Community</a>
              <a href="#" className="hover:text-black transition-colors">Github</a>
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-ui hover:bg-slate-50 transition-all shadow-sm">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm text-blue-600">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span> v1.0 Production
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 text-[#0F172A]">
            Elevate Your <br />
            <span className="text-slate-400 italic">Workflow.</span>
          </h2>
          <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl mb-12">
            A specialized suite of developer utilities designed for precision and speed. All the tools you need, none of the noise.
          </p>
          <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-[#0F172A] text-white rounded-ui font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-3">
              Browse Tools <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 z-0" />
      </header>

      {/* Main Tools Area */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Available Bricks</h3>
          <div className="h-[1px] flex-1 bg-slate-200 mx-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ToolCard 
            title="CodeSlash"
            description="Professional live HTML/CSS/JS editor. Instant preview for high-speed UI prototyping."
            icon={<Code2 className="w-8 h-8" />}
            badge="POPULAR"
            onClick={() => setCurrentTool('codeslash')}
          />
          
          <ToolCard 
            title="Coming Soon"
            description="We are architecting the next set of bricks. Stay tuned for more powerful tools."
            icon={<Plus className="w-8 h-8" />}
            isPlaceholder
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">© 2026 ZeroBricks Toolsuite</span>
          </div>
          <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-black transition-colors">Documentation</a>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Changelog</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ToolCard({ title, description, icon, onClick, badge, isPlaceholder }: any) {
  return (
    <div 
      onClick={!isPlaceholder ? onClick : undefined}
      className={`group bg-white p-8 rounded-ui border border-slate-200 transition-all duration-300 relative overflow-hidden ${
        isPlaceholder ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer'
      }`}
    >
      {/* Decorative background circle */}
      {!isPlaceholder && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors z-0" />
      )}

      <div className={`w-14 h-14 rounded-ui flex items-center justify-center mb-8 relative z-10 transition-colors ${
        isPlaceholder ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white group-hover:bg-blue-600'
      }`}>
        {icon}
      </div>
      
      {badge && (
        <span className="absolute top-8 right-8 px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
          {badge}
        </span>
      )}

      <div className="relative z-10">
        <h3 className="text-2xl font-black tracking-tight mb-4 flex items-center justify-between">
          {title}
          {!isPlaceholder && <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />}
        </h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
          {description}
        </p>
        
        {!isPlaceholder && (
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-widest transition-colors">
            Launch Instance <Terminal className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
}
