import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Eye, 
  Download, 
  Upload, 
  Maximize2, 
  Minimize2,
  Edit3,
  FileJson,
  ThumbsUp,
  ShieldCheck,
  HelpCircle,
  Braces,
  FileCode,
  Layout,
  Command,
  ChevronLeft,
  RefreshCcw,
  Monitor
} from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css'; // Using the original dark theme for editor

const DEFAULT_HTML = `<main class="min-h-screen flex items-center justify-center p-6 bg-slate-50">
  <div class="max-w-xl w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
    <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
    </div>
    <h1 class="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Start Smarter</h1>
    <p class="text-slate-500 text-lg leading-relaxed mb-10">Advanced Frontend Editor. Support for HTML, CSS, and JS with live preview.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md">Get Started</button>
      <button class="px-8 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all">Learn More</button>
    </div>
  </div>
</main>`;

const DEFAULT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

body { 
  font-family: 'Plus Jakarta Sans', sans-serif;
  margin: 0;
  -webkit-font-smoothing: antialiased;
}`;

const DEFAULT_JS = `console.log("Welcome to CodeSlash!");`;

type TabType = 'html' | 'css' | 'js';

export default function CodeSlash({ onBack }: { onBack: () => void }) {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [combinedHtml, setCombinedHtml] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${js}<\/script>
  </body>
</html>`;
      setCombinedHtml(fullHtml);
    }, 300);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const handleFullPreview = () => {
    const blob = new Blob([combinedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownload = () => {
    const blob = new Blob([combinedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codeslash-project.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetCode = () => {
    if (confirm("Are you sure you want to reset all code?")) {
      setHtml(DEFAULT_HTML);
      setCss(DEFAULT_CSS);
      setJs(DEFAULT_JS);
    }
  };

  const getCode = () => {
    if (activeTab === 'html') return html;
    if (activeTab === 'css') return css;
    return js;
  };

  const setCode = (val: string) => {
    if (activeTab === 'html') setHtml(val);
    else if (activeTab === 'css') setCss(val);
    else setJs(val);
  };

  const getLanguage = () => {
    if (activeTab === 'html') return languages.markup;
    if (activeTab === 'css') return languages.css;
    return languages.javascript;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-slate-900">
      {/* Original Header Style */}
      <header className="h-14 bg-[#0F172A] flex items-center justify-between px-4 shrink-0 text-white shadow-lg z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="hover:bg-white/10 p-1 rounded-md transition-colors mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/zerobricks/codeslash_logo.svg" alt="CodeSlash" className="w-6 h-6 invert" />
            <span className="font-bold tracking-tight text-lg uppercase italic">CODESLASH</span>
          </div>
          <div className="h-6 w-[1px] bg-white/20 mx-2" />
          <div className="flex items-center gap-1">
             <button onClick={handleFullPreview} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-md text-sm transition-colors">
                <Monitor className="w-4 h-4" /> Live View
             </button>
             <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-md text-sm transition-colors">
                <Download className="w-4 h-4" /> Export HTML
             </button>
          </div>
        </div>

        <div className="flex bg-[#1E293B] p-1 rounded-lg">
          <TabButton active={activeTab === 'html'} onClick={() => setActiveTab('html')} icon={<Layout className="w-4 h-4" />} label="HTML" />
          <TabButton active={activeTab === 'css'} onClick={() => setActiveTab('css')} icon={<FileCode className="w-4 h-4" />} label="CSS" />
          <TabButton active={activeTab === 'js'} onClick={() => setActiveTab('js')} icon={<Braces className="w-4 h-4" />} label="JS" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Original Sidebar Style */}
        <aside className="w-64 bg-[#F8FAFC] border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Preview Mode</h3>
              <div className="space-y-1">
                <SidebarAction icon={<Maximize2 className="w-4 h-4" />} label="Expand Editor" onClick={() => setIsPreviewExpanded(false)} active={!isPreviewExpanded} />
                <SidebarAction icon={<Minimize2 className="w-4 h-4" />} label="Expand Preview" onClick={() => setIsPreviewExpanded(true)} active={isPreviewExpanded} />
              </div>
            </div>

            <div className="h-[1px] bg-slate-200" />

            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Source Control</h3>
              <div className="space-y-1">
                <SidebarAction icon={<RefreshCcw className="w-4 h-4" />} label="Reset Project" onClick={resetCode} />
                <SidebarAction icon={<Upload className="w-4 h-4" />} label="Import Code" onClick={() => {}} />
                <SidebarAction icon={<Download className="w-4 h-4" />} label="Download All" onClick={handleDownload} />
              </div>
            </div>

            <div className="h-[1px] bg-slate-200" />

            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Utility</h3>
              <div className="space-y-1">
                <SidebarAction icon={<HelpCircle className="w-4 h-4" />} label="Documentation" onClick={() => {}} />
                <SidebarAction icon={<ShieldCheck className="w-4 h-4" />} label="Privacy Status" onClick={() => {}} />
              </div>
            </div>
          </div>
          <div className="mt-auto p-4 border-t border-slate-200 text-center">
             <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">ZeroBricks v1.0</div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex overflow-hidden">
          {/* Editor Section */}
          <div className={`flex flex-col bg-[#1E293B] transition-all duration-300 ${isPreviewExpanded ? 'w-0 overflow-hidden opacity-0' : 'flex-1 opacity-100'}`}>
            <div className="flex-1 relative overflow-auto">
              <Editor
                value={getCode()}
                onValueChange={setCode}
                highlight={code => highlight(code, getLanguage(), activeTab)}
                padding={24}
                className="font-mono text-sm leading-relaxed text-white min-h-full"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className={`flex flex-col bg-white transition-all duration-300 ${isPreviewExpanded ? 'flex-1' : 'flex-1 border-l border-slate-200'}`}>
            <div className="flex-1 p-4 bg-slate-100 relative">
               <div className="w-full h-full bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
                  <iframe srcDoc={combinedHtml} title="preview" className="w-full h-full border-none" sandbox="allow-scripts" />
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-8 bg-[#0F172A] border-t border-white/5 flex items-center justify-between px-4 text-[10px] font-medium text-white/50 tracking-wider uppercase">
        <div className="flex items-center gap-6">
          <span className="flex items-center"><Command className="w-3 h-3 mr-1.5" /> ENGINE: STABLE</span>
          <span>CHARS: {(html.length + css.length + js.length).toLocaleString()}</span>
        </div>
        <div>ZEROBRICKS v1.0</div>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
        active ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function SidebarAction({ icon, label, onClick, active }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
        active ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm border border-transparent'
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}
