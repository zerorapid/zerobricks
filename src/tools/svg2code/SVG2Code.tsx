/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileCode, 
  Upload, 
  Code2, 
  Copy, 
  Check, 
  Download,
  RefreshCw,
  ChevronLeft,
  Command,
  Monitor
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

import { 
  convertToUniversalCode,
  convertToStandardSVG,
  extractColors,
  replaceColor,
  normalizeToHex
} from './lib/svg-utils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SAMPLE_SVG = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="#007AFF" stroke-width="2" />
  <path d="M30 50L45 65L70 35" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

export default function SVG2Code({ onBack }: { onBack: () => void }) {
  const [svgInput, setSvgInput] = useState(SAMPLE_SVG);
  const [name, setName] = useState('Icon');
  const [format, setFormat] = useState<'react' | 'standard'>('standard');
  const [outputCode, setOutputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [darkPreview, setDarkPreview] = useState(false);

  useEffect(() => {
    try {
      const code = format === 'react' 
        ? convertToUniversalCode(svgInput, name)
        : convertToStandardSVG(svgInput);
      setOutputCode(code);
      setColors(extractColors(svgInput));
      setTimeout(() => Prism.highlightAll(), 0);
    } catch (e) {
      setOutputCode('// Error processing SVG. Please check your image.');
    }
  }, [svgInput, name, format]);

  const handleColorChange = (index: number, newColor: string) => {
    if (!newColor) return;
    setSvgInput(prev => {
      const currentColors = extractColors(prev);
      if (index >= currentColors.length) return prev;
      return replaceColor(prev, currentColors[index], newColor);
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('<svg')) {
        setSvgInput(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setSvgInput(text);
          setName(file.name.replace('.svg', '').replace(/[^a-zA-Z0-9]/g, ''));
        }
      };
      reader.readAsText(file);
    }
  }, []);

  // @ts-ignore
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/svg+xml': ['.svg'] },
    multiple: false
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ext = format === 'react' ? '.tsx' : '.svg';
    a.download = `${name || 'Icon'}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSvgInput(SAMPLE_SVG);
    setName('Icon');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Header */}
      <header className="h-14 bg-[#0F172A] flex items-center justify-between px-4 shrink-0 text-white shadow-lg z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="hover:bg-white/10 p-1 rounded-md transition-colors mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 h-8">
            <img src="/zerobricks/svg2code_full.svg" alt="SVG2Code" className="h-full w-auto invert" />
          </div>
          <div className="h-6 w-[1px] bg-white/20 mx-2" />
          <div className="flex items-center gap-4">
             <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-md text-sm transition-colors">
                <Download className="w-4 h-4" /> Download
             </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 bg-[#007AFF] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0062CC] transition-all active:scale-95 shrink-0"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto p-4 md:p-8 space-y-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload & Preview */}
          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={cn(
                "relative aspect-[4/3] md:aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-3xl transition-all group shadow-sm overflow-hidden",
                isDragActive ? "border-[#007AFF] bg-blue-50/50" : "border-[#D2D2D7] bg-white hover:border-[#86868B]"
              )}
            >
              <input {...getInputProps()} />
              
              {/* Checkerboard Backdrop */}
              <div className={cn(
                "absolute inset-0 transition-opacity",
                darkPreview ? "bg-[#1D1D1F]" : "bg-white",
                !darkPreview && "[background-image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
              )} />

              <div 
                className="relative z-10 w-full h-full flex items-center justify-center p-12 drop-shadow-sm"
                dangerouslySetInnerHTML={{ __html: svgInput }} 
              />

              {/* Float Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                <button 
                  onClick={(e) => { e.stopPropagation(); setDarkPreview(!darkPreview); }}
                  className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-xl text-gray-500 hover:text-black border border-gray-200"
                  title="Toggle Dark Mode Preview"
                >
                  <RefreshCw size={16} className={cn("transition-transform", darkPreview && "rotate-180")} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePaste(); }}
                  className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-xl text-gray-500 hover:text-black border border-gray-200"
                  title="Paste SVG from Clipboard"
                >
                  <FileCode size={16} />
                </button>
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center pointer-events-none transition-opacity opacity-40 group-hover:opacity-100">
                 <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-1">
                   <Upload size={16} />
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Drop to Replace</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#D2D2D7]/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-between">
               <div className="flex flex-col flex-1">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B] mb-1">Component Name</span>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                   placeholder="e.g. Logo"
                   className="text-sm font-semibold focus:outline-none bg-transparent min-w-0 placeholder:text-gray-300"
                 />
               </div>
               <div className="flex gap-2">
                 <button 
                   onClick={handleReset}
                   className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                   title="Reset"
                 >
                   <RefreshCw size={18} />
                 </button>
               </div>
            </div>

            {colors.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#D2D2D7]/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B] block mb-4">Edit Colors</span>
                <div className="grid grid-cols-2 gap-4">
                  {colors.map((color, idx) => {
                    const hexValue = normalizeToHex(color);
                    return (
                      <div key={`${color}-${idx}`} className="flex items-center gap-3">
                        <div className="relative group/color">
                          <input 
                            type="color" 
                            value={hexValue} 
                            onChange={(e) => handleColorChange(idx, e.target.value)}
                            className="w-10 h-10 rounded-lg border-none p-0 bg-transparent cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-lg"
                          />
                          <div className="absolute inset-0 rounded-lg border border-black/5 pointer-events-none" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-gray-400 font-mono truncate uppercase">{color}</span>
                          <input 
                            type="text" 
                            value={color}
                            onChange={(e) => handleColorChange(idx, e.target.value)}
                            className="text-xs font-mono focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Code Viewer */}
          <div className="flex flex-col bg-white border border-[#D2D2D7]/50 rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] h-[400px] md:h-auto">
             <div className="px-5 py-3 border-b border-[#D2D2D7]/30 flex flex-col sm:flex-row sm:items-center justify-between bg-white sticky top-0 z-10 gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} className="text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#86868B]">Output</span>
                  </div>
                  
                  <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => setFormat('react')}
                      className={cn(
                        "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                        format === 'react' ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
                      )}
                    >
                      React
                    </button>
                    <button
                      onClick={() => setFormat('standard')}
                      className={cn(
                        "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                        format === 'standard' ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
                      )}
                    >
                      Standard
                    </button>
                  </div>
                </div>
                <button 
                  onClick={handleDownload}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-all self-end sm:self-auto"
                  title="Download File"
                >
                  <Download size={18} />
                </button>
             </div>
             
             <div className="flex-1 overflow-auto p-5 scrollbar-hide text-[13px] leading-relaxed">
                <pre className={cn("language-tsx", format === 'standard' ? 'language-markup' : 'language-tsx')}>
                  <code className={cn(format === 'standard' ? 'language-markup' : 'language-tsx')}>
                    {outputCode}
                  </code>
                </pre>
             </div>

             <div className="p-4 bg-gray-50 border-t border-[#D2D2D7]/20 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ready to use</span>
                <button 
                  onClick={handleCopy}
                  className="text-xs font-bold text-[#007AFF] hover:underline"
                >
                  Copy to clipboard
                </button>
             </div>
          </div>
        </div>
      </main>

      <footer className="h-8 bg-[#0F172A] border-t border-white/5 flex items-center justify-between px-4 text-[10px] font-medium text-white/50 tracking-wider uppercase">
        <div className="flex items-center gap-6">
          <span className="flex items-center"><Command className="w-3 h-3 mr-1.5" /> ENGINE: STABLE</span>
          <span>BUILT FOR RAPID FRONTEND DEVELOPMENT</span>
        </div>
        <div>ZEROBRICKS v1.0</div>
      </footer>
    </div>
  );
}
