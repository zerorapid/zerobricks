import { useState, useEffect, useCallback } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Settings2, 
  Globe, 
  Languages, 
  Download, 
  ListPlus, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  ChevronLeft,
  Link2,
  Type,
  Trash2,
  Activity,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface SlugOptions {
  separator: string;
  lowercase: boolean;
  removeStopWords: boolean;
  trim: boolean;
  removeAccents: boolean;
  prefixType: 'none' | 'date-ymd' | 'date-ym' | 'custom';
  customPrefix: string;
  customSuffix: string;
  domainName: string;
}

interface BulkItem {
  id: string;
  title: string;
  slug: string;
}

const COMMON_STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with']);

export default function Slugmakr({ onBack }: { onBack: () => void }) {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Single Input States
  const [title, setTitle] = useState('10 Best Practices for Modern Frontend Engineering in 2026!');
  const [slug, setSlug] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Bulk States
  const [bulkInput, setBulkInput] = useState("How to Deploy a React App\nGetting Started with Tailwind CSS v4\nCreating Node JS Express Backends");
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);
  const [bulkCopied, setBulkCopied] = useState(false);

  // Settings & Options
  const [options, setOptions] = useState<SlugOptions>({
    separator: '-',
    lowercase: true,
    removeStopWords: true,
    trim: true,
    removeAccents: true,
    prefixType: 'none',
    customPrefix: 'blog',
    customSuffix: '',
    domainName: 'yoursite.com'
  });

  // Accent & diacritic normalization helper
  const cleanAccentsAndSymbols = useCallback((text: string) => {
    let result = text;
    // Common multi-character ligatures and German umlauts
    result = result
      .replace(/æ/gi, 'ae')
      .replace(/ø/gi, 'o')
      .replace(/å/gi, 'a')
      .replace(/ß/gi, 'ss')
      .replace(/ö/gi, 'o')
      .replace(/ä/gi, 'a')
      .replace(/ü/gi, 'u')
      .replace(/Ö/gi, 'O')
      .replace(/Ä/gi, 'A')
      .replace(/Ü/gi, 'U')
      .replace(/ñ/gi, 'n')
      .replace(/Ñ/gi, 'N')
      .replace(/ç/gi, 'c')
      .replace(/Ç/gi, 'C');
    
    // NFD decomposition to separate characters from their diacritics, then filter diacritics
    return result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }, []);

  // Main Slug generator logic
  const generateSlug = useCallback((text: string, opts: SlugOptions) => {
    let result = text;

    if (opts.removeAccents) {
      result = cleanAccentsAndSymbols(result);
    }

    if (opts.removeStopWords) {
      result = result
        .split(/\s+/)
        .filter(word => !COMMON_STOP_WORDS.has(word.toLowerCase()))
        .join(' ');
    }

    if (opts.lowercase) {
      result = result.toLowerCase();
    }

    // Replace non-alphanumeric characters with the separator
    result = result
      .replace(/[^a-z0-9\s-]/gi, '') // Remove symbols
      .replace(/\s+/g, opts.separator) // Replace spaces with separator
      .replace(new RegExp(`\\${opts.separator}+`, 'g'), opts.separator); // Eliminate consecutive separators

    if (opts.trim) {
      // Trim leading/trailing separators
      result = result.replace(new RegExp(`^\\${opts.separator}+|\\${opts.separator}+$`, 'g'), '');
    }

    // Dynamic Prefix handling
    let finalPrefix = '';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    if (opts.prefixType === 'date-ymd') {
      finalPrefix = `${year}-${month}-${day}${opts.separator}`;
    } else if (opts.prefixType === 'date-ym') {
      finalPrefix = `${year}-${month}${opts.separator}`;
    } else if (opts.prefixType === 'custom' && opts.customPrefix.trim()) {
      // Slugify the custom prefix too
      let slugifiedPrefix = opts.customPrefix.trim()
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, opts.separator);
      finalPrefix = `${slugifiedPrefix}${opts.separator}`;
    }

    // Suffix handling
    let finalSuffix = '';
    if (opts.customSuffix.trim()) {
      let slugifiedSuffix = opts.customSuffix.trim()
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, opts.separator);
      finalSuffix = `${opts.separator}${slugifiedSuffix}`;
    }

    // Assemble final output
    let finalSlug = `${finalPrefix}${result}${finalSuffix}`;
    
    // Final check for multiple separators that might be joined from prefix & suffix
    if (opts.separator) {
      finalSlug = finalSlug.replace(new RegExp(`\\${opts.separator}+`, 'g'), opts.separator);
    }
    
    return finalSlug;
  }, [cleanAccentsAndSymbols]);

  // Sync single slug
  useEffect(() => {
    if (!isCustomizing && activeTab === 'single') {
      setSlug(generateSlug(title, options));
    }
  }, [title, options, isCustomizing, activeTab, generateSlug]);

  // Sync batch/bulk generator
  useEffect(() => {
    if (activeTab === 'bulk') {
      const lines = bulkInput.split('\n').filter(line => line.trim() !== '');
      const items = lines.map(line => ({
        id: uuidv4(),
        title: line,
        slug: generateSlug(line, options)
      }));
      setBulkItems(items);
    }
  }, [bulkInput, options, activeTab, generateSlug]);

  // SEO Score & compliance checklists
  const getSEOAudit = (currentSlug: string) => {
    if (!currentSlug) return { score: 0, grade: 'Pending', checks: [] };

    const checks = [
      {
        id: 'length',
        label: 'Ideal Slug Length (3-55 chars)',
        passed: currentSlug.length >= 3 && currentSlug.length <= 55,
        tip: currentSlug.length > 55 ? 'A bit too long; search index might truncate it.' : 'Ideal URL length.'
      },
      {
        id: 'separator',
        label: 'Hyphen Separators Preferred',
        passed: options.separator === '-',
        tip: 'Google explicitly recommends using hyphens (-) over underscores.'
      },
      {
        id: 'lowercase',
        label: 'Casing is Lowercase',
        passed: currentSlug === currentSlug.toLowerCase(),
        tip: 'Universal lowercase standard.'
      },
      {
        id: 'stopwords',
        label: 'Stop Words Filtered',
        passed: options.removeStopWords,
        tip: 'Removes filler words automatically for high SEO relevance.'
      },
      {
        id: 'accents',
        label: 'Accent Transliteration Clean',
        passed: options.removeAccents,
        tip: 'Diacritics and accents are cleaned automatically for maximum compatibility.'
      }
    ];

    const passedCount = checks.filter(c => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);
    const grade = score >= 80 ? 'Optimal' : score >= 60 ? 'Moderate' : 'Needs Optimization';

    return { score, grade, checks };
  };

  const auditResult = getSEOAudit(slug);

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBulk = (format: 'txt' | 'csv' | 'json') => {
    if (bulkItems.length === 0) return;
    let textToCopy = '';

    if (format === 'txt') {
      textToCopy = bulkItems.map(item => item.slug).join('\n');
    } else if (format === 'csv') {
      textToCopy = 'Title,Slug\n' + bulkItems.map(item => `"${item.title.replace(/"/g, '""')}",${item.slug}`).join('\n');
    } else if (format === 'json') {
      textToCopy = JSON.stringify(bulkItems.map(item => ({ title: item.title, slug: item.slug })), null, 2);
    }

    navigator.clipboard.writeText(textToCopy);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2000);
  };

  const downloadBulkCSV = () => {
    if (bulkItems.length === 0) return;
    const csvContent = 'data:text/csv;charset=utf-8,Title,Slug\n' + bulkItems.map(item => `"${item.title.replace(/"/g, '""')}",${item.slug}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'slugmakr_bulk_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setTitle('');
    setBulkInput('');
    setSlug('');
    setIsCustomizing(false);
  };

  // Bulk statistics calculations
  const avgSlugLength = bulkItems.length > 0 
    ? Math.round(bulkItems.reduce((acc, item) => acc + item.slug.length, 0) / bulkItems.length)
    : 0;

  const longestSlugItem = bulkItems.length > 0
    ? [...bulkItems].sort((a, b) => b.slug.length - a.slug.length)[0]
    : null;

  const shortestSlugItem = bulkItems.length > 0
    ? [...bulkItems].sort((a, b) => a.slug.length - b.slug.length)[0]
    : null;

  return (
    <div className="min-h-screen lg:h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col lg:overflow-hidden">
      {/* Navigation Bar / Sleek Header */}
      <nav className="min-h-[4rem] bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-3 md:py-0 gap-3 md:gap-0 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="hover:bg-slate-100 p-1.5 rounded-lg transition-colors mr-1 text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Link2 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight lowercase">
            slug<span className="text-blue-600">makr</span>
          </span>
        </div>
        
        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-sm md:w-auto">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 md:flex-initial px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'single' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Single <span className="hidden xs:inline sm:inline">Generator</span></span>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 md:flex-initial px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'bulk' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ListPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Bulk <span className="hidden xs:inline sm:inline">Generator</span></span>
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button 
            onClick={resetAll}
            className="w-full md:w-auto justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset State</span>
          </button>
        </div>
      </nav>

      {/* Main Grid Wrapper */}
      <main className="flex-grow p-4 sm:p-6 grid grid-cols-12 gap-4 sm:gap-6 max-w-[1536px] mx-auto w-full lg:overflow-hidden lg:h-full">
        
        {/* Left Side Content Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 lg:overflow-hidden lg:h-full">
          
          <AnimatePresence mode="wait">
            {activeTab === 'single' ? (
              /* Single Generator Container */
              <motion.div
                key="single-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col flex-grow lg:overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4 shrink-0">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Single URL Generator</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Transform any title or text into clean, optimized SEO-compliant slugs instantly.</p>
                  </div>
                </div>
                
                <div className="space-y-4 lg:flex-grow lg:overflow-y-auto pr-1">
                  {/* Title Input area */}
                  <div>
                    <label htmlFor="title-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Article or Page Title</label>
                    <textarea
                      id="title-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your publication title, folder name or documentation topic here..."
                      className="w-full h-20 px-3 sm:px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Action buttons matching parent visual layout elements */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <button 
                      onClick={handleCopy}
                      disabled={!slug}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale cursor-pointer shadow-sm animate-pulse-slow"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Slug to Clipboard</span>
                    </button>
                    <button 
                      onClick={() => setIsCustomizing(!isCustomizing)}
                      className={`px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 border shadow-xs cursor-pointer ${
                        !isCustomizing 
                          ? 'bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-yellow-500' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                      }`}
                    >
                      <RotateCcw className={`w-4 h-4 ${!isCustomizing ? 'animate-pulse' : ''}`} />
                      <span>{isCustomizing ? 'Manual Mode' : 'Auto-Sync Active'}</span>
                    </button>
                  </div>

                  {/* Slug output visually mimicking the sleek format */}
                  <div className="pt-4 border-t border-slate-100 shrink-0">
                    <label htmlFor="slug-output" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Generated Output</label>
                    <div className="relative group">
                      <input
                        id="slug-output"
                        type="text"
                        value={slug}
                        onChange={(e) => {
                          setSlug(e.target.value);
                          setIsCustomizing(true);
                        }}
                        placeholder="your-generated-slug-will-appear-here"
                        className="w-full px-3 sm:px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-base font-mono text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-20 sm:pr-28"
                      />
                      <button 
                        onClick={handleCopy}
                        className={`absolute right-2 top-2 bottom-2 px-2.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-50 transition-colors ${copied ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Rich Visual Mock Web URL address bar */}
                    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-sm text-slate-500">
                      <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-400">Preview:</span>
                      <span className="font-mono truncate select-all">
                        https://{options.domainName || 'yoursite.com'}/
                        <span className="text-blue-600 font-bold">{slug || '...'}</span>
                      </span>
                    </div>

                    {/* Advanced Settings */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Advanced Slug Customization</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Domain */}
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Preview Domain</label>
                          <input
                            type="text"
                            value={options.domainName}
                            onChange={(e) => setOptions({ ...options, domainName: e.target.value })}
                            placeholder="yoursite.com"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Prefix Format */}
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Date Prefix</label>
                          <select
                            value={options.prefixType}
                            onChange={(e) => setOptions({ ...options, prefixType: e.target.value as any })}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="none">No Prefix (Default)</option>
                            <option value="date-ymd">Year-Month-Day (YYYY-MM-DD)</option>
                            <option value="date-ym">Year-Month (YYYY-MM)</option>
                          </select>
                        </div>

                        {/* Stop Words Toggle */}
                        <div className="flex flex-col justify-end">
                          <button
                            onClick={() => setOptions({ ...options, removeStopWords: !options.removeStopWords })}
                            className={`w-full py-1.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                              options.removeStopWords
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <span>Filter Stop Words</span>
                            <div className={`w-7 h-3.5 rounded-full relative transition-colors shrink-0 ${options.removeStopWords ? 'bg-blue-600' : 'bg-slate-300'}`}>
                              <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${options.removeStopWords ? 'right-0.5' : 'left-0.5'}`} />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>Total: {slug.length} characters</span>
                      {isCustomizing && (
                        <button 
                          onClick={() => setIsCustomizing(false)} 
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Re-engage Auto-Sync
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Bulk / Batch URL Generator Tab Content */
              <motion.div
                key="bulk-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col flex-grow lg:overflow-hidden"
              >
                <div className="shrink-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Bulk & Batch Processor</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Produce and manage dozens of slugs at once. Perfect for CMS migrations, e-commerce imports, and marketing campaigns.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 lg:flex-grow lg:overflow-hidden">
                  {/* Multi-line input column */}
                  <div className="flex flex-col lg:h-full lg:overflow-hidden">
                    <label htmlFor="bulk-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 shrink-0">
                      Input Article Titles / Rows (one per line)
                    </label>
                    <textarea
                      id="bulk-input"
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      placeholder="Paste continuous headlines, one title on each line..."
                      className="w-full flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-sans leading-relaxed"
                    />
                  </div>

                  {/* Production Real-time Outputs column */}
                  <div className="flex flex-col lg:h-full lg:overflow-hidden">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between shrink-0">
                      <span>Live Batch Slugs Preview</span>
                      <span className="text-blue-600 font-semibold lowercase">Total rows: {bulkItems.length}</span>
                    </label>
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 overflow-y-auto h-48 lg:h-auto lg:flex-grow space-y-3 font-mono text-xs text-slate-200">
                      {bulkItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
                          <FileText className="w-6 h-6 mb-2 text-slate-600" />
                          <span>Waiting for input rows...</span>
                        </div>
                      ) : (
                        bulkItems.map((item, index) => (
                          <div key={item.id} className="flex items-start justify-between gap-4 border-b border-slate-800/40 pb-2 last:border-0 last:pb-0">
                            <span className="text-slate-500 shrink-0 select-none">#{index + 1}</span>
                            <span className="text-blue-300 truncate flex-1 hover:text-white transition-colors" title={item.slug}>
                              {item.slug}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.slug);
                              }}
                              className="text-slate-500 hover:text-white transition-colors p-0.5 cursor-pointer"
                              title="Copy this Slug"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Bulk Export & format actions */}
                {bulkItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 sm:mb-0">Copy Entire Batch:</span>
                      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 justify-between">
                        <button
                          onClick={() => handleCopyBulk('txt')}
                          className="flex-1 sm:flex-none px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white rounded-md transition-all cursor-pointer"
                        >
                          Raw Text
                        </button>
                        <button
                          onClick={() => handleCopyBulk('csv')}
                          className="flex-1 sm:flex-none px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white rounded-md transition-all cursor-pointer"
                        >
                          CSV Format
                        </button>
                        <button
                          onClick={() => handleCopyBulk('json')}
                          className="flex-1 sm:flex-none px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white rounded-md transition-all cursor-pointer"
                        >
                          JSON Array
                        </button>
                      </div>
                      {bulkCopied && (
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1 sm:mt-0 ml-1">
                          <Check className="w-3 h-3" /> Batch Copied!
                        </span>
                      )}
                    </div>

                    <button
                      onClick={downloadBulkCSV}
                      className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4" />
                      Download .CSV Spreadsheet File
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>        </div>

        {/* Right Side Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 lg:overflow-hidden lg:h-full">
          {activeTab === 'single' ? (
            /* SEO Score Visual Audit Compliance Panel */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-sm flex flex-col lg:overflow-hidden lg:flex-grow">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3 shrink-0">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                  SEO Compliance Audit
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  auditResult.score >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {auditResult.grade}
                </span>
              </div>

              {/* High Contrast Score Display */}
              <div className="flex items-center gap-4 mb-4 shrink-0">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-14 h-14">
                    <circle className="text-slate-800" strokeWidth="5" stroke="currentColor" fill="transparent" r="22" cx="28" cy="28" />
                    <circle className={auditResult.score >= 80 ? "text-green-400" : "text-yellow-400"} strokeWidth="5" strokeDasharray={138.2} strokeDashoffset={138.2 - (138.2 * auditResult.score) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="22" cx="28" cy="28" />
                  </svg>
                  <span className="absolute text-xs font-bold text-yellow-400">{auditResult.score}%</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Crawler Visibility Index</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Calculated based on search guidelines.</p>
                </div>
              </div>

              {/* Dynamic checks */}
              <div className="space-y-3 lg:flex-grow lg:overflow-y-auto pr-1 text-slate-300">
                {auditResult.checks.map(item => (
                  <div key={item.id} className="flex gap-2 text-xs">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`font-semibold ${item.passed ? 'text-slate-100' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{item.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Bulk Statistics Panel */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-sm flex flex-col lg:overflow-hidden lg:flex-grow">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3 shrink-0">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                  Batch Slugs Analytics
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Active
                </span>
              </div>

              <div className="space-y-4 lg:flex-grow lg:overflow-y-auto pr-1">
                {/* Stat 1 */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Rows Processed</span>
                  <div className="text-xl font-bold text-white mt-1">{bulkItems.length}</div>
                </div>

                {/* Stat 2 */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Average Slug Length</span>
                  <div className="text-xl font-bold text-yellow-400 mt-1">{avgSlugLength} chars</div>
                </div>

                {/* Longest Slug */}
                {longestSlugItem && (
                  <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Longest Slug ({longestSlugItem.slug.length} chars)</span>
                    <p className="text-xs font-mono text-blue-300 truncate mt-1" title={longestSlugItem.slug}>
                      {longestSlugItem.slug}
                    </p>
                  </div>
                )}

                {/* Shortest Slug */}
                {shortestSlugItem && (
                  <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Shortest Slug ({shortestSlugItem.slug.length} chars)</span>
                    <p className="text-xs font-mono text-blue-300 truncate mt-1" title={shortestSlugItem.slug}>
                      {shortestSlugItem.slug}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ad Space Placeholder / Sponsor Block */}
          <div className="bg-gradient-to-br from-blue-500/5 via-yellow-500/5 to-amber-500/5 border border-dashed border-blue-200 rounded-2xl p-4 flex flex-col justify-center items-center text-center shrink-0 min-h-[140px] relative overflow-hidden group">
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

            <span className="bg-yellow-400/20 text-yellow-800 border border-yellow-300/40 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase mb-1.5 z-10">
              Sponsor Showcase
            </span>
            <h4 className="text-xs font-extrabold text-slate-700 tracking-tight z-10">Premium Advertisement Slot</h4>
            <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] leading-normal z-10">
              Reserved space for sponsorships, carbon ads, or promotional banners.
            </p>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-3 py-1 rounded-lg mt-3 transition-colors shadow-xs z-10 cursor-pointer">
              Configure Ad Slots
            </button>
          </div>
        </div>
      </main>

      {/* Feature Blocks footer section */}
      <footer className="bg-white border-t border-slate-200 mt-auto shrink-0 shadow-xs">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 font-medium text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5">
            <span className="text-[10px] font-bold uppercase tracking-widest">Client Version: v3.0.0</span>
            <span className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Optimal engine status
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-widest flex items-center justify-center gap-1.5">
            <span>Built with ❤️ by</span>
            <a href="https://www.zerorapid.in" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-blue-600 hover:underline transition-colors font-extrabold">ZeroRapid</a>
          </span>
        </div>
      </footer>

      {/* Solid blue bottom accent bar representing the Sleek Pro theme */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-blue-600 z-50" />
    </div>
  );
}
