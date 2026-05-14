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
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-50 font-sans">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-slate-900 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-brand-primary" />
            <span className="font-black tracking-tighter text-xl">CODESLASH</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleFullPreview}
            className="px-4 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 rounded-lg transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Live View
          </button>
          <button 
            onClick={handleDownload}
            className="px-4 py-1.5 text-xs font-bold bg-brand-primary text-black hover:bg-brand-primary/90 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20"
          >
            <Download className="w-3.5 h-3.5" /> Export HTML
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor/Workspace */}
        <main className="flex-1 flex overflow-hidden">
          {/* Editor Section */}
          {!isPreviewExpanded && (
            <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-950 relative z-10">
              <div className="h-10 border-b border-slate-800 flex items-center px-2 bg-slate-900/50 shrink-0">
                <div className="flex gap-1 h-full">
                  <EditorTab active={activeTab === 'html'} onClick={() => setActiveTab('html')} icon={<Layout className="w-3.5 h-3.5" />} label="HTML" />
                  <EditorTab active={activeTab === 'css'} onClick={() => setActiveTab('css')} icon={<FileCode className="w-3.5 h-3.5" />} label="CSS" />
                  <EditorTab active={activeTab === 'js'} onClick={() => setActiveTab('js')} icon={<Braces className="w-3.5 h-3.5" />} label="JS" />
                </div>
              </div>
              <div className="flex-1 relative overflow-auto custom-scrollbar">
                <style dangerouslySetInnerHTML={{ __html: `
                  .token.tag, .token.selector { color: #00f2ff !important; }
                  .token.attr-name, .token.property { color: #7000ff !important; }
                  .token.attr-value, .token.string { color: #eab308 !important; }
                  .token.punctuation { color: #94a3b8 !important; }
                  .token.comment { color: #475569 !important; font-style: italic; }
                  .token.function { color: #22d3ee !important; }
                  .react-simple-code-editor textarea { outline: none !important; }
                `}} />
                <Editor
                  value={getCode()}
                  onValueChange={setCode}
                  highlight={code => highlight(code, getLanguage(), activeTab)}
                  padding={24}
                  className="font-mono text-sm leading-relaxed outline-none min-h-full"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                />
              </div>
            </div>
          )}

          {/* Preview Section */}
          <div className={`flex flex-col bg-slate-100 transition-all duration-500 ${isPreviewExpanded ? 'flex-[2]' : 'flex-1'}`}>
            <div className="h-10 border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preview Mode</span>
              </div>
              <button 
                onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                className="p-1.5 hover:bg-slate-100 rounded-md transition-all text-slate-400 hover:text-slate-900"
              >
                {isPreviewExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex-1 p-4 lg:p-8 bg-slate-200">
               <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300">
                  <iframe srcDoc={combinedHtml} title="preview" className="w-full h-full border-none" sandbox="allow-scripts" />
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-8 border-t border-slate-800 bg-slate-900 flex items-center justify-between px-6 text-[10px] text-slate-500 font-black uppercase tracking-widest shrink-0">
        <div className="flex items-center gap-6">
          <span className="flex items-center">
            <Command className="w-3 h-3 mr-2" /> ENGINE: <span className="text-brand-primary ml-1">STABLE</span>
          </span>
          <span>CHARS: {(html.length + css.length + js.length).toLocaleString()}</span>
        </div>
        <div>ZEROBRICKS v1.0</div>
      </footer>
    </div>
  );
}

function EditorTab({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
        active ? "border-brand-primary text-slate-50 bg-slate-800/50" : "border-transparent text-slate-500 hover:text-slate-300"
      }`}
    >
      <span className={active ? "text-brand-primary" : "text-slate-600"}>{icon}</span>
      {label}
    </button>
  );
}
