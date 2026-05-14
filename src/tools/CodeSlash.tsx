import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Eye, 
  Download, 
  Upload, 
  Maximize2, 
  Minimize2,
  ExternalLink,
  Edit3,
  FileJson,
  ThumbsUp,
  ShieldCheck,
  HelpCircle,
  Braces,
  FileCode,
  Layout,
  Command,
  ChevronLeft
} from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';

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
    <div className="flex flex-col h-screen overflow-hidden bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="h-16 border-b-4 border-black flex items-center justify-between px-6 shrink-0 bg-white z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Code2 className="w-8 h-8 text-black" />
            <span className="font-black tracking-tighter text-2xl uppercase">CODESLASH</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleFullPreview}
            className="px-6 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-all"
          >
            Launch Site
          </button>
          <button 
            onClick={handleDownload}
            className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all"
          >
            Export Project
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Restored) */}
        <aside className="hidden lg:flex w-72 border-r-4 border-black flex-col bg-white overflow-y-auto">
          <div className="p-8 space-y-10">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6">Navigation</h3>
              <div className="space-y-2">
                <SidebarItem icon={<Eye className="w-4 h-4" />} label="Live Site" onClick={handleFullPreview} />
                <SidebarItem icon={<Edit3 className="w-4 h-4" />} label="Toggle Mode" onClick={() => setIsPreviewExpanded(!isPreviewExpanded)} />
              </div>
            </div>

            <div className="h-[2px] bg-black/10" />

            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6">Operations</h3>
              <div className="space-y-2">
                <SidebarItem icon={<FileJson className="w-4 h-4" />} label="Default Template" onClick={() => {}} />
                <SidebarItem icon={<Upload className="w-4 h-4" />} label="Import Source" onClick={() => {}} />
                <SidebarItem icon={<Download className="w-4 h-4" />} label="Export Code" onClick={handleDownload} />
              </div>
            </div>

            <div className="h-[2px] bg-black/10" />

            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6">Information</h3>
              <div className="space-y-2">
                <SidebarItem icon={<ShieldCheck className="w-4 h-4" />} label="Privacy Policy" onClick={() => {}} />
                <SidebarItem icon={<HelpCircle className="w-4 h-4" />} label="Developer Docs" onClick={() => {}} />
              </div>
            </div>
          </div>
          <div className="mt-auto p-8 border-t-2 border-black/5 flex flex-col items-center">
            <Code2 className="w-10 h-10 text-black/10 mb-2" />
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex overflow-hidden bg-white">
          {/* Editor Section */}
          {!isPreviewExpanded && (
            <div className="flex-1 flex flex-col border-r-4 border-black bg-white relative z-10">
              <div className="h-12 border-b-2 border-black flex items-center px-4 bg-white shrink-0">
                <div className="flex h-full font-mono">
                  <EditorTab active={activeTab === 'html'} onClick={() => setActiveTab('html')} icon={<Layout className="w-4 h-4" />} label="HTML" />
                  <EditorTab active={activeTab === 'css'} onClick={() => setActiveTab('css')} icon={<FileCode className="w-4 h-4" />} label="CSS" />
                  <EditorTab active={activeTab === 'js'} onClick={() => setActiveTab('js')} icon={<Braces className="w-4 h-4" />} label="JS" />
                </div>
              </div>
              <div className="flex-1 relative overflow-auto custom-scrollbar">
                <style dangerouslySetInnerHTML={{ __html: `
                  .token.tag, .token.selector { color: #000 !important; font-weight: 900; }
                  .token.attr-name, .token.property { color: #444 !important; font-weight: 700; }
                  .token.attr-value, .token.string { color: #888 !important; }
                  .token.punctuation { color: #ccc !important; }
                  .token.comment { color: #ddd !important; font-style: italic; }
                  .token.function { color: #000 !important; font-weight: 700; }
                  .react-simple-code-editor textarea { outline: none !important; }
                `}} />
                <Editor
                  value={getCode()}
                  onValueChange={setCode}
                  highlight={code => highlight(code, getLanguage(), activeTab)}
                  padding={32}
                  className="font-mono text-base leading-relaxed outline-none min-h-full"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                />
              </div>
            </div>
          )}

          {/* Preview Section */}
          <div className={`flex flex-col bg-white transition-all duration-500 ${isPreviewExpanded ? 'flex-[2]' : 'flex-1'}`}>
            <div className="h-12 border-b-2 border-black flex items-center justify-between px-6 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-black"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Output</span>
              </div>
              <button 
                onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all"
              >
                {isPreviewExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex-1 p-8 lg:p-12 bg-white">
               <div className="w-full h-full bg-white border-4 border-black overflow-hidden relative">
                  <iframe srcDoc={combinedHtml} title="preview" className="w-full h-full border-none" sandbox="allow-scripts" />
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="h-10 border-t-4 border-black bg-white flex items-center justify-between px-6 text-[10px] font-black uppercase tracking-widest shrink-0">
        <div className="flex items-center gap-10">
          <span className="flex items-center">
            <Command className="w-3.5 h-3.5 mr-2" /> ENGINE_READY: <span className="ml-1">SOLID_STATE</span>
          </span>
          <span className="hidden sm:inline">CHARS: {(html.length + css.length + js.length).toLocaleString()}</span>
        </div>
        <div>ZEROBRICKS_CODESLASH_V1</div>
      </footer>
    </div>
  );
}

function EditorTab({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-8 h-full text-[11px] font-black uppercase tracking-widest transition-all border-r-2 border-black ${
        active ? "bg-black text-white" : "text-black hover:bg-black/5"
      }`}
    >
      <span className={active ? "text-white" : "text-black/30"}>{icon}</span>
      {label}
    </button>
  );
}

function SidebarItem({ icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3 border-2 border-black text-[11px] font-black uppercase tracking-tight hover:bg-black hover:text-white transition-all group"
    >
      <span className="text-black group-hover:text-white transition-colors">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
