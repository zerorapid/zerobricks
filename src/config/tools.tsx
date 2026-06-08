import React from 'react';
import { Coffee, Link2, Zap } from 'lucide-react';

const BASE = import.meta.env.BASE_URL || '/';

export interface ToolConfig {
  id: string;
  name: string;
  route: string;
  description: string;
  seoDescription: string;
  status: string;
  version: string;
  
  // Dashboard Styling
  groupHoverColor: string; // e.g. 'hover:border-blue-500/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]'
  blurColor: string; // e.g. 'bg-blue-50'
  iconContainerBg: string; // e.g. 'bg-slate-900'
  iconContainerShadow: string; // e.g. 'shadow-lg'
  iconNode: React.ReactNode;
  textColorHover: string; // e.g. 'group-hover:text-blue-600'
  tagBg: string; // e.g. 'bg-blue-50'
  tagTextColor: string; // e.g. 'text-blue-600'
  tagBorder: string; // e.g. 'border-blue-100'
  
  // SEO Content
  seoH1: string;
  seoH2: string;
  seoContent: React.ReactNode;
}

export const toolsConfig: ToolConfig[] = [
  {
    id: 'codeslash',
    name: 'CodeSlash',
    route: '/codeslash',
    description: 'The ultimate prototyping editor. Write HTML/CSS/JS with a live preview and instant export capabilities.',
    seoDescription: 'The ultimate prototyping editor. Write HTML/CSS/JS with a live preview and instant export capabilities.',
    status: 'STABLE',
    version: 'V1.0',
    groupHoverColor: 'hover:border-blue-500/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]',
    blurColor: 'bg-blue-50',
    iconContainerBg: 'bg-slate-900',
    iconContainerShadow: 'shadow-lg',
    iconNode: <img src={`${BASE}codeslash_icon_only.svg`} alt="CodeSlash" className="w-full h-full object-cover" />,
    textColorHover: 'group-hover:text-blue-600',
    tagBg: 'bg-blue-50',
    tagTextColor: 'text-blue-600',
    tagBorder: 'border-blue-100',
    seoH1: 'Live HTML/CSS/JS Editor for Fast Prototyping',
    seoH2: 'What is CodeSlash?',
    seoContent: (
      <div className="space-y-4 text-slate-600">
        <p>CodeSlash is a high-performance, browser-based code editor designed for developers and designers who need to rapidly prototype web interfaces. It supports HTML, CSS, and JavaScript with syntax highlighting and a real-time live preview.</p>
        <p>Unlike heavy IDEs, CodeSlash requires no setup. You can write your code, immediately see the results, and export your entire project as a single HTML file with one click.</p>
      </div>
    )
  },
  {
    id: 'svg2code',
    name: 'SVG2Code',
    route: '/svg2code',
    description: 'Convert SVG files to clean React components or optimized SVG code instantly with live preview and color editing.',
    seoDescription: 'Convert SVG files to clean React components or optimized SVG code instantly.',
    status: 'NEW',
    version: 'V1.0',
    groupHoverColor: 'hover:border-purple-500/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]',
    blurColor: 'bg-purple-50',
    iconContainerBg: 'bg-slate-900',
    iconContainerShadow: 'shadow-lg',
    iconNode: <img src={`${BASE}svg2code_icon_only.svg`} alt="SVG2Code" className="w-full h-full object-cover" />,
    textColorHover: 'group-hover:text-purple-600',
    tagBg: 'bg-purple-50',
    tagTextColor: 'text-purple-600',
    tagBorder: 'border-purple-100',
    seoH1: 'SVG to React Component Converter',
    seoH2: 'Why use SVG2Code?',
    seoContent: (
      <div className="space-y-4 text-slate-600">
        <p>SVG2Code takes the pain out of managing SVG assets in modern web development. Instead of manually stripping out hardcoded fill colors and wrapping SVGs in React boilerplates, SVG2Code does it instantly.</p>
        <p>Simply paste your raw SVG code, and we will output a clean, prop-driven React component ready for Tailwind CSS integration.</p>
      </div>
    )
  },
  {
    id: 'coffeenote',
    name: 'CoffeeNote',
    route: '/coffeenote',
    description: 'A minimalist writing space designed for focus. Take quick notes, format them easily, and export to TXT, Word, or PDF.',
    seoDescription: 'A minimalist writing space designed for focus. Take quick notes and export to PDF.',
    status: 'PRODUCTIVE',
    version: 'V1.0',
    groupHoverColor: 'hover:border-orange-500/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]',
    blurColor: 'bg-orange-50',
    iconContainerBg: 'bg-[#26384A]',
    iconContainerShadow: 'shadow-lg',
    iconNode: <Coffee className="w-6 h-6 text-[#FDFBF6]" />,
    textColorHover: 'group-hover:text-orange-600',
    tagBg: 'bg-orange-50',
    tagTextColor: 'text-orange-600',
    tagBorder: 'border-orange-100',
    seoH1: 'Distraction-Free Minimalist Online Notepad',
    seoH2: 'How CoffeeNote Works',
    seoContent: (
      <div className="space-y-4 text-slate-600">
        <p>CoffeeNote is a zero-friction, private-by-design online notepad. There are no accounts, no logins, and no complex databases. Just open the app and start typing.</p>
        <p>Your notes are stored securely in your browser's local storage. When you are done writing, you can instantly export your thoughts to a PDF, Word document, or Plain Text file.</p>
      </div>
    )
  },
  {
    id: 'slugmakr',
    name: 'Slugmakr',
    route: '/slugmakr',
    description: 'A clean and intuitive URL slug generator. Optimize titles into SEO-compliant paths with diacritic transliteration, stop-words filtering, and bulk processing.',
    seoDescription: 'A clean and intuitive URL slug generator. Optimize titles into SEO-compliant paths.',
    status: 'SEO PRO',
    version: 'V1.0',
    groupHoverColor: 'hover:border-sky-500/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]',
    blurColor: 'bg-sky-50',
    iconContainerBg: 'bg-sky-600',
    iconContainerShadow: 'shadow-lg shadow-sky-600/20',
    iconNode: <Link2 className="w-6 h-6 text-white" />,
    textColorHover: 'group-hover:text-sky-600',
    tagBg: 'bg-sky-50',
    tagTextColor: 'text-sky-600',
    tagBorder: 'border-sky-100',
    seoH1: 'SEO-Friendly URL Slug Generator',
    seoH2: 'Creating the Perfect URL Slug',
    seoContent: (
      <div className="space-y-4 text-slate-600">
        <p>Slugmakr transforms messy blog post titles and product names into clean, SEO-optimized URL slugs. It automatically removes stop words, transliterates special characters, and formats the string for maximum search engine readability.</p>
        <p>Clean URLs are a critical ranking factor for Google and other search engines. Ensure your paths are perfectly optimized before publishing.</p>
      </div>
    )
  }
];
