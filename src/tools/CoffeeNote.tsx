import React, { useState, useEffect } from 'react';
import { 
  Clock,
  Download,
  Plus,
  FileText,
  Trash2,
  Search,
  Share2,
  FileUp,
  Bot,
  Settings,
  MoreHorizontal,
  Save,
  Archive,
  History,
  Maximize,
  Coffee,
  ChevronLeft,
  SeparatorHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, Toaster } from 'sonner';

import { Note } from '../types';
import { cn } from '../lib/utils';
import Editor from '../components/Editor';

// Simplified UI components for integration
import { Button } from "../components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";

const STORAGE_KEY = 'realnotez_all_notes';

export default function CoffeeNote({ onBack }: { onBack: () => void }) {
  const [note, setNote] = useState<Note>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed[0] : parsed;
      } catch (e) {
        console.error("Failed to parse saved note", e);
      }
    }
    return {
      id: 'default',
      title: '',
      content: '',
      updatedAt: Date.now(),
      createdAt: Date.now(),
      history: []
    };
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([note]));
  }, [note]);

  const createNote = () => {
    setNote({
      id: uuidv4(),
      title: '',
      content: '',
      updatedAt: Date.now(),
      createdAt: Date.now(),
      history: []
    });
    toast.success('New note started');
  };

  const updateNote = (updates: Partial<Note>) => {
    setNote(prev => ({ ...prev, ...updates, updatedAt: Date.now() }));
  };

  // Export functions
  const exportAsTxt = () => {
    const plainText = note.content.replace(/<[^>]*>/g, '\n').replace(/\n\n+/g, '\n');
    const blob = new Blob([(note.title || 'Untitled') + '\n\n' + plainText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${note.title || 'note'}.txt`);
    toast.success('Exported as Text file');
  };

  const exportAsDoc = () => {
    const htmlData = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${note.title || 'Untitled'}</title></head>
      <body>
        <h1>${note.title || 'Untitled'}</h1>
        ${note.content}
      </body>
      </html>
    `;
    const blob = new Blob([htmlData], { type: 'application/msword' });
    saveAs(blob, `${note.title || 'note'}.doc`);
    toast.success('Exported as Word file');
  };

  const exportAsPdf = async () => {
    const element = document.querySelector('.ProseMirror') as HTMLElement;
    if (!element) return;
    toast.loading('Generating PDF...', { id: 'pdf-gen' });
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.setFontSize(24);
      pdf.text(note.title || 'Untitled Note', 10, 20);
      pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight);
      pdf.save(`${note.title || 'note'}.pdf`);
      toast.success('Exported as PDF', { id: 'pdf-gen' });
    } catch (err) {
      toast.error('Failed to export PDF', { id: 'pdf-gen' });
    }
  };

  return (
    <div className="h-screen bg-[#FDFBF6] font-sans selection:bg-[#4F6D88]/20 flex flex-col overflow-hidden">
      <Toaster position="top-center" theme="light" />
      
      {/* Header */}
      <header className="bg-[#26384A] text-white px-4 md:px-8 h-14 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="hover:bg-white/10 p-1 rounded-md transition-colors mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
                <Coffee className="text-[#26384A]" size={18} />
              </motion.div>
            </div>
            <h1 className="font-bold text-lg flex items-center gap-2">
              Coffee Note <span className="font-normal text-sm opacity-80 hidden sm:inline">- free online notepad</span>
            </h1>
          </div>
        </div>
        
        <nav className="flex items-center gap-4 text-xs font-medium tracking-tight">
          <a 
            href="mailto:hello@zerorapid.in" 
            className="text-white/90 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
          >
            Reach out us: hello@zerorapid.in
          </a>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center p-4 overflow-hidden">
        <div className="w-full max-w-6xl h-full flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-md shadow-sm border border-[#D9C4AA] p-4 sm:p-6 flex flex-col gap-4 flex-grow overflow-hidden">
            
            {/* Note Title Input */}
            <div className="w-full shrink-0">
              <input 
                type="text"
                value={note.title}
                onChange={(e) => updateNote({ title: e.target.value })}
                className="w-full border border-[#D9C4AA] rounded px-4 py-2 text-lg font-bold text-[#26384A] placeholder:text-zinc-400 focus:outline-none focus:border-[#4F6D88] focus:ring-1 focus:ring-[#4F6D88]/20 transition-all font-sans"
                placeholder="Note Title"
              />
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-1 shrink-0">
              <button 
                onClick={createNote}
                className="flex items-center gap-1.5 text-[#4F6D88] hover:underline text-sm font-medium py-1"
              >
                <Plus size={16} strokeWidth={3} /> New Note
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-[#4F6D88] hover:underline text-sm font-medium py-1">
                  <Share2 size={16} strokeWidth={3} /> Export / Share
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white border border-slate-200 shadow-xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400 p-2">Format</DropdownMenuLabel>
                    <DropdownMenuItem onClick={exportAsTxt} className="p-2 hover:bg-slate-50 cursor-pointer">Plain Text (.txt)</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportAsDoc} className="p-2 hover:bg-slate-50 cursor-pointer">Word Document (.doc)</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100 h-[1px] my-1" />
                    <DropdownMenuItem onClick={exportAsPdf} className="p-2 hover:bg-slate-50 cursor-pointer">PDF Document (.pdf)</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Editor Container */}
            <div className="border border-[#D9C4AA] rounded relative group flex-grow overflow-hidden flex flex-col">
               <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity z-20">
                  <Maximize size={16} className="text-zinc-500 cursor-pointer hover:text-zinc-900" />
               </div>
               <div className="flex-grow overflow-hidden">
                 <Editor 
                    content={note.content}
                    onChange={(content) => updateNote({ content })}
                    placeholder="Note Content"
                 />
               </div>
               
               {/* Content Resizer handle simulation (purely visual) */}
               <div className="absolute bottom-0 right-0 p-1 cursor-nwse-resize opacity-50 z-20 pointer-events-none">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M15 19l-7-7 7-7"/><path d="M19 19l-7-7 7-7"/></svg>
               </div>
            </div>

            <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-100 shrink-0">
               <div className="text-[10px] text-zinc-400">
                  Last edited {format(note.updatedAt, 'MMM d, yyyy h:mm a')}
               </div>
               <div className="flex h-4 items-center space-x-2 sm:space-x-4 text-[10px] text-zinc-400">
                  <div className="hidden xs:block">UTF-8</div>
                  <Separator orientation="vertical" />
                  <div>No Account Needed</div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t border-[#D9C4AA] bg-[#EFE3D3] text-center flex flex-col items-center gap-2 shrink-0">
         <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#26384A] font-medium">
            <span>Built with ❤️ by</span>
            <a 
              href="https://www.zerorapid.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#4F6D88] hover:underline font-bold"
            >
              ZeroRapid
            </a>
            <span className="opacity-30 mx-1">|</span>
            <span className="font-bold opacity-40 uppercase tracking-widest text-[9px]">Coffee Note &copy; 2026</span>
         </div>
      </footer>
    </div>
  );
}
