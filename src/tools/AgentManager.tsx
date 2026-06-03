import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  Square, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Settings, 
  Plus, 
  Search, 
  Copy, 
  User, 
  Cpu, 
  Sparkles, 
  FileCode, 
  Check,
  LineChart,
  PieChart,
  FolderSync,
  DollarSign,
  Activity,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Idle' | 'Running' | 'Paused' | 'Errored';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools: string[];
  metrics: {
    runs: number;
    successRate: number;
    avgDuration: string;
    totalCost: number;
    tokensUsed: number;
  };
}

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
}

interface RunHistory {
  id: string;
  agent: string;
  project: string;
  task: string;
  status: 'Completed' | 'Running' | 'Failed';
  duration: string;
  cost: string;
  time: string;
}

interface LogLine {
  timestamp: string;
  type: 'system' | 'thought' | 'tool_call' | 'tool_output' | 'user' | 'permission_request';
  message: string;
  payload?: {
    action: string;
    target: string;
    reason: string;
  };
}

export default function AgentManager({ onBack }: { onBack: () => void }) {
  // --- Navigation States ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'console' | 'agents' | 'prompts' | 'settings'>('dashboard');
  
  // --- Agents list state ---
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agent-1",
      name: "Coder-Vibe",
      role: "Frontend Engineer",
      avatar: "🎨",
      status: "Idle",
      model: "Claude 3.5 Sonnet",
      temperature: 0.2,
      maxTokens: 8192,
      systemPrompt: "You are Coder-Vibe, an expert frontend engineer specializing in responsive, premium UI/UX layouts. Use HSL styling, rich variables, and smooth animations.",
      tools: ["filesystem", "web_search"],
      metrics: { runs: 48, successRate: 95.8, avgDuration: "42s", totalCost: 14.22, tokensUsed: 1422000 }
    },
    {
      id: "agent-2",
      name: "Architect-X",
      role: "System Designer",
      avatar: "🏗️",
      status: "Idle",
      model: "Gemini 1.5 Pro",
      temperature: 0.1,
      maxTokens: 16384,
      systemPrompt: "You are Architect-X, a rigorous systems architect. You map file dependencies, detail API contracts, design databases, and draft implementation plans.",
      tools: ["filesystem", "shell", "web_search"],
      metrics: { runs: 32, successRate: 90.6, avgDuration: "78s", totalCost: 28.54, tokensUsed: 4756000 }
    },
    {
      id: "agent-3",
      name: "Test-Sentry",
      role: "QA & Integration Specialist",
      avatar: "🛡️",
      status: "Idle",
      model: "GPT-4o",
      temperature: 0.0,
      maxTokens: 4096,
      systemPrompt: "You are Test-Sentry, a QA automation engineer. Write robust unit and integration tests using Jest, Vitest, Cypress, or Playwright.",
      tools: ["filesystem", "shell"],
      metrics: { runs: 74, successRate: 98.6, avgDuration: "24s", totalCost: 8.95, tokensUsed: 895000 }
    },
    {
      id: "agent-4",
      name: "SEO-Polish",
      role: "SEO & Content Auditor",
      avatar: "📈",
      status: "Errored",
      model: "Gemini 1.5 Flash",
      temperature: 0.5,
      maxTokens: 4096,
      systemPrompt: "You are SEO-Polish, focusing on page hierarchy, meta descriptions, image alt tags, semantic HTML tags, and Lighthouse performance profiling.",
      tools: ["web_search", "filesystem"],
      metrics: { runs: 15, successRate: 80.0, avgDuration: "19s", totalCost: 1.12, tokensUsed: 560000 }
    }
  ]);

  const [promptTemplates] = useState<PromptTemplate[]>([
    {
      id: "temp-1",
      title: "Vanilla CSS Glassmorphism Card",
      category: "CSS",
      description: "Generates modern frosted glass cards with customizable borders and backdrops.",
      prompt: "Create a modern, responsive card component with glassmorphism style. Background should be semi-transparent with a subtle white border, backdrop-filter blur, and smooth scaling hover transitions."
    },
    {
      id: "temp-2",
      title: "TypeScript API Endpoint Mock",
      category: "Backend",
      description: "Sets up standard Express/Next.js dynamic mock routes with delay testing.",
      prompt: "Draft a mock API router for Next.js app router. Support GET and POST with randomized 200ms - 800ms delays, standard request validation, and clean error structures."
    },
    {
      id: "temp-3",
      title: "Vitest Assertions Matrix",
      category: "Testing",
      description: "Creates comprehensive tests for helper utils, including edge case handlers.",
      prompt: "Write unit tests for the following utility module. Ensure 100% statement coverage, mock any external API calls using vi.mock, and explicitly test negative/null inputs."
    },
    {
      id: "temp-4",
      title: "SEO Metadata & Schema Generator",
      category: "SEO",
      description: "Injects LD+JSON structured data and optimized meta tags for portfolios.",
      prompt: "Generate standard SEO meta elements, OpenGraph, Twitter tags, and structured JSON-LD organization schema for a portfolio landing page. Keep descriptions under 160 characters."
    }
  ]);

  const [agentRunsHistory, setAgentRunsHistory] = useState<RunHistory[]>([
    { id: "run-1024", agent: "Coder-Vibe", project: "quantire-ai-resume", task: "Implement interactive skills timeline section", status: "Completed", duration: "45s", cost: "$0.48", time: "10 minutes ago" },
    { id: "run-1023", agent: "Architect-X", project: "zerosites", task: "Model relational database structure in SQL", status: "Running", duration: "1m 12s", cost: "$1.24", time: "Active" },
    { id: "run-1022", agent: "SEO-Polish", project: "advanced_news", task: "Verify semantic H1 headers and optimize img alts", status: "Failed", duration: "18s", cost: "$0.04", time: "1 hour ago" },
    { id: "run-1021", agent: "Test-Sentry", project: "coffee-note", task: "Write Vitest suite for local storage notes backup", status: "Completed", duration: "31s", cost: "$0.12", time: "3 hours ago" },
    { id: "run-1020", agent: "Coder-Vibe", project: "kirana_bill_generator", task: "Add dark mode toggle and sync HSL tokens", status: "Completed", duration: "52s", cost: "$0.55", time: "Yesterday" }
  ]);

  const mockLogStreams: LogLine[] = [
    { timestamp: "10:53:15", type: "system", message: "Initializing agent session 'Coder-Vibe' inside workspace '/zerosites'..." },
    { timestamp: "10:53:16", type: "thought", message: "I need to inspect the current landing page directory structure to locate index.html or layout.tsx. I will start by executing list_dir on the root." },
    { timestamp: "10:53:17", type: "tool_call", message: "list_dir(DirectoryPath: '/Users/Jayapalreddy/.gemini/antigravity/scratch/zerosites')" },
    { timestamp: "10:53:18", type: "tool_output", message: "[DirectoryList] found: package.json, README.md, src/, public/, tsconfig.json, next.config.ts" },
    { timestamp: "10:53:20", type: "thought", message: "This is a Next.js App Router project. The landing page is likely located at `src/app/page.tsx`. I will read this file to understand the current content." },
    { timestamp: "10:53:21", type: "tool_call", message: "view_file(AbsolutePath: '/Users/Jayapalreddy/.gemini/antigravity/scratch/zerosites/src/app/page.tsx', StartLine: 1, EndLine: 100)" },
    { timestamp: "10:53:22", type: "tool_output", message: "[FileContent] Read 82 lines. Core layout contains main landing banner with 'Zero Bricks' header and landing description." },
    { timestamp: "10:53:25", type: "thought", message: "The user wants to implement a responsive, modern card layout for 'Recent Sites' showcase. I will write a new component `src/components/ShowcaseGrid.tsx` and integrate it. First, I will create the file with beautiful vanilla styling." },
    { timestamp: "10:53:27", type: "tool_call", message: "write_to_file(TargetFile: '/Users/Jayapalreddy/.gemini/antigravity/scratch/zerosites/src/components/ShowcaseGrid.tsx', Overwrite: true)" },
    { timestamp: "10:53:28", type: "tool_output", message: "[WriteSuccess] Created ShowcaseGrid.tsx successfully. (2,430 bytes written)" },
    { timestamp: "10:53:32", type: "thought", message: "Now I need to edit the homepage `src/app/page.tsx` to import and render `<ShowcaseGrid />`. Let's perform a contiguous replacement of lines 40-52." },
    { timestamp: "10:53:33", type: "tool_call", message: "replace_file_content(TargetFile: '/Users/Jayapalreddy/.gemini/antigravity/scratch/zerosites/src/app/page.tsx', StartLine: 40, EndLine: 52)" },
    { timestamp: "10:53:34", type: "tool_output", message: "[ReplaceSuccess] Code swapped. Visual cards incorporated in page.tsx." },
    { timestamp: "10:53:38", type: "thought", message: "Before declaring victory, I must verify that the build compiles correctly. I will run the shell command `npm run build` to compile the TypeScript and Next.js project. This command is potentially risky so it triggers human review." },
    { 
      timestamp: "10:53:39", 
      type: "permission_request", 
      message: "npm run build",
      payload: {
        action: "command",
        target: "npm run build",
        reason: "Compile TypeScript and bundle code to verify there are no syntax or type checking errors before final merge."
      }
    },
    { timestamp: "10:53:45", type: "system", message: "PERMISSION GRANTED BY USER." },
    { timestamp: "10:53:46", type: "tool_call", message: "run_command(CommandLine: 'npm run build', Cwd: '/Users/Jayapalreddy/.gemini/antigravity/scratch/zerosites')" },
    { timestamp: "10:53:50", type: "tool_output", message: "Creating an optimized production build...\n✓ Compiled successfully\nRoute (app)      Size     First Load JS\n┌ ○ /            4.54 kB        82.1 kB\n└ ○ /_not-found  871 B          74.9 kB\n+ First Load JS shared by all   74 kB\n  ├ chunks/framework-348df8.js  45 kB\n  ├ chunks/main-839fdc.js       27 kB" },
    { timestamp: "10:53:52", type: "thought", message: "Excellent! The build succeeds without errors. The ShowcaseGrid behaves properly. I can now finalize the task and present the result to the user." },
    { timestamp: "10:53:53", type: "system", message: "Session Completed. Agent is now Idle." }
  ];

  // --- Runtime Simulation States ---
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-1");
  const [consoleLogs, setConsoleLogs] = useState<LogLine[]>([]);
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [isSimPaused, setIsSimPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [permissionReq, setPermissionReq] = useState<LogLine | null>(null);
  
  // Custom terminal input
  const [cliInput, setCliInput] = useState("");
  
  // Custom feedback text input
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  
  // Create Agent Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // File viewer state
  const [fileViewerName, setFileViewerName] = useState("ShowcaseGrid.tsx");
  const [fileViewerPath, setFileViewerPath] = useState("zerosites / src / components / ShowcaseGrid.tsx");
  const [fileContent, setFileContent] = useState<React.ReactNode>(
    <span className="text-slate-500">// Workspace idle. Launch an agent session to load live workspaces.</span>
  );
  
  // Prompt templates filter states
  const [promptSearch, setPromptSearch] = useState("");
  const [promptCategory, setPromptCategory] = useState("ALL");
  
  // References
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const simTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Auto Scroll Terminal ---
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    };
  }, []);

  // --- Dynamic Stats Calculations ---
  const totalRuns = agents.reduce((acc, a) => acc + a.metrics.runs, 0);
  const avgSuccessRate = (agents.reduce((acc, a) => acc + a.metrics.successRate, 0) / agents.length).toFixed(1);
  const totalCost = agents.reduce((acc, a) => acc + a.metrics.totalCost, 0).toFixed(2);
  const totalTokens = (agents.reduce((acc, a) => acc + a.metrics.tokensUsed, 0) / 1000000).toFixed(2);

  // --- Simulation Runner ---
  const startSimulation = () => {
    if (isSimRunning && !isSimPaused) return;

    if (!isSimPaused) {
      // Clear and start fresh
      setConsoleLogs([]);
      setCurrentStepIndex(0);
      setFileViewerName("ShowcaseGrid.tsx");
      setFileViewerPath("zerosites / src / components / ShowcaseGrid.tsx");
      setFileContent(<span className="text-slate-500">// Loading workspace tree...</span>);
      
      // Set status to running
      setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, status: 'Running' } : a));
      
      const now = new Date().toTimeString().split(" ")[0];
      setConsoleLogs([{
        timestamp: now,
        type: 'system',
        message: `[INIT] Agent ${agents.find(a => a.id === selectedAgentId)?.name} model session configured.`
      }]);
    } else {
      // Resuming
      const now = new Date().toTimeString().split(" ")[0];
      setConsoleLogs(prev => [...prev, {
        timestamp: now,
        type: 'system',
        message: `[RESUMED] Execution flow restarted.`
      }]);
    }

    setIsSimRunning(true);
    setIsSimPaused(false);
    
    // Trigger loop trigger
    runStep(isSimPaused ? currentStepIndex : 0);
  };

  const runStep = (index: number) => {
    if (index >= mockLogStreams.length) {
      // End simulation
      setIsSimRunning(false);
      setIsSimPaused(false);
      setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, status: 'Idle' } : a));
      
      // Update statistics for running agent
      setAgents(prev => prev.map(a => {
        if (a.id === selectedAgentId) {
          return {
            ...a,
            metrics: {
              ...a.metrics,
              runs: a.metrics.runs + 1,
              totalCost: a.metrics.totalCost + 0.45,
              tokensUsed: a.metrics.tokensUsed + 14000
            }
          };
        }
        return a;
      }));
      
      toast.success("Agent task completed successfully!");
      return;
    }

    const step = mockLogStreams[index];
    setCurrentStepIndex(index + 1);

    // Side Effects based on log content
    if (step.type === 'permission_request') {
      setPermissionReq(step);
      setIsSimPaused(true);
      setIsSimRunning(false);
      return;
    }

    handleVisualSideEffects(step);

    setConsoleLogs(prev => [...prev, step]);

    simTimeoutRef.current = setTimeout(() => {
      runStep(index + 1);
    }, 1200);
  };

  const handleVisualSideEffects = (step: LogLine) => {
    if (step.type === 'tool_call' && step.message.includes('view_file')) {
      setFileViewerName("ShowcaseGrid.tsx");
      setFileViewerPath("zerosites / src / components / ShowcaseGrid.tsx");
      setFileContent(
        <pre className="text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">
{`import React from 'react';

export default function ShowcaseGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border border-slate-800 rounded-lg p-6">
        <h3 class="text-xl">Zero Bricks Landing</h3>
        <p>Real estate template designed for modern agents.</p>
      </div>
      <div className="border border-slate-800 rounded-lg p-6">
        <h3 class="text-xl">Coffee Note Web</h3>
        <p>Personal notes database with dynamic local storage.</p>
      </div>
    </div>
  );
}`}
        </pre>
      );
    } else if (step.type === 'tool_call' && step.message.includes('replace_file_content')) {
      setFileViewerName("ShowcaseGrid.tsx (Modified)");
      setFileViewerPath("zerosites / src / components / ShowcaseGrid.tsx [WORKING DIFF]");
      setFileContent(
        <div className="text-xs font-mono leading-relaxed">
          <div className="text-slate-400 py-1">import React from 'react';</div>
          <div className="text-slate-400 py-1">export default function ShowcaseGrid() {"{"}</div>
          <div className="text-slate-400 py-1">  return (</div>
          <div className="bg-red-950/40 text-red-300 border-l-2 border-red-600 px-2 py-0.5 my-0.5">-    &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-6"&gt;</div>
          <div className="bg-green-950/40 text-green-300 border-l-2 border-green-600 px-2 py-0.5 my-0.5">+    &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in"&gt;</div>
          <div className="text-slate-400 py-1">      &lt;div className="border border-slate-800 rounded-lg p-6"&gt;</div>
          <div className="text-slate-400 py-1">        &lt;h3 class="text-xl"&gt;Zero Bricks Landing&lt;/h3&gt;</div>
          <div className="text-slate-400 py-1">      &lt;/div&gt;</div>
          <div className="bg-green-950/40 text-green-300 border-l-2 border-green-600 px-2 py-0.5 my-0.5">+      &lt;div className="border border-slate-800 rounded-lg p-6 glow-cyan"&gt;</div>
          <div className="bg-green-950/40 text-green-300 border-l-2 border-green-600 px-2 py-0.5 my-0.5">+        &lt;h3 class="text-xl text-cyan-400"&gt;Open Agent Manager&lt;/h3&gt;</div>
          <div className="bg-green-950/40 text-green-300 border-l-2 border-green-600 px-2 py-0.5 my-0.5">+        &lt;p&gt;Observability dashboard for zero rapid workflows.&lt;/p&gt;</div>
          <div className="bg-green-950/40 text-green-300 border-l-2 border-green-600 px-2 py-0.5 my-0.5">+      &lt;/div&gt;</div>
          <div className="text-slate-400 py-1">    &lt;/div&gt;</div>
          <div className="text-slate-400 py-1">  );</div>
          <div className="text-slate-400 py-1">{"}"}</div>
        </div>
      );
    } else if (step.type === 'system' && step.message.includes('Session Completed')) {
      setFileViewerName("ShowcaseGrid.tsx (Merged)");
      setFileViewerPath("zerosites / src / components / ShowcaseGrid.tsx [MAIN]");
      setFileContent(
        <pre className="text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">
{`import React from 'react';

export default function ShowcaseGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="border border-slate-800 rounded-lg p-6">
        <h3 class="text-xl">Zero Bricks Landing</h3>
        <p>Real estate template designed for modern agents.</p>
      </div>
      <div className="border border-slate-800 rounded-lg p-6">
        <h3 class="text-xl">Coffee Note Web</h3>
        <p>Personal notes database with dynamic local storage.</p>
      </div>
      <div className="border border-slate-800 rounded-lg p-6 glow-cyan">
        <h3 class="text-xl text-cyan-400">Open Agent Manager</h3>
        <p>Observability dashboard for zero rapid workflows.</p>
      </div>
    </div>
  );
}`}
        </pre>
      );
    }
  };

  const pauseSimulation = () => {
    setIsSimPaused(true);
    setIsSimRunning(false);
    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    
    setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, status: 'Paused' } : a));
    
    const now = new Date().toTimeString().split(" ")[0];
    setConsoleLogs(prev => [...prev, {
      timestamp: now,
      type: 'system',
      message: `[PAUSED] Runtime execution suspended by user.`
    }]);
  };

  const stopSimulation = () => {
    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    setIsSimRunning(false);
    setIsSimPaused(false);
    setPermissionReq(null);
    setShowFeedbackInput(false);
    setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, status: 'Idle' } : a));
    
    setConsoleLogs(prev => [...prev, {
      timestamp: new Date().toTimeString().split(" ")[0],
      type: 'system',
      message: `[TERMINATED] Session aborted. Cleaned lock files.`
    }]);
  };

  // --- Human-in-the-loop controls ---
  const handleApprove = () => {
    setPermissionReq(null);
    toast.success("Command execution approved.");
    
    const now = new Date().toTimeString().split(" ")[0];
    setConsoleLogs(prev => [...prev, {
      timestamp: now,
      type: 'system',
      message: `✓ Permission GRANTED by user to run command.`
    }]);

    setIsSimPaused(false);
    setIsSimRunning(true);
    
    // Resume loop
    runStep(currentStepIndex);
  };

  const handleDeny = () => {
    setPermissionReq(null);
    toast.error("Execution denied by user. Halting.");
    
    const now = new Date().toTimeString().split(" ")[0];
    setConsoleLogs(prev => [...prev, {
      timestamp: now,
      type: 'system',
      message: `❌ Permission REJECTED by user. Halting execution loop.`
    }]);

    setIsSimRunning(false);
    setIsSimPaused(false);
    setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, status: 'Errored' } : a));
  };

  const handleSuggestSubmit = () => {
    if (!feedbackText.trim()) {
      toast.warning("Please provide suggestions or instructions.");
      return;
    }

    const commandStr = permissionReq?.payload?.target || "npm run build";
    setPermissionReq(null);
    setShowFeedbackInput(false);
    toast.info("Sending custom suggestions to Agent...");
    
    const now = new Date().toTimeString().split(" ")[0];
    setConsoleLogs(prev => [
      ...prev,
      {
        timestamp: now,
        type: 'user',
        message: `Suggest Edits: Modified command to \`${commandStr}\`. Feedback: "${feedbackText}"`
      }
    ]);

    setFeedbackText("");
    setIsSimPaused(false);
    setIsSimRunning(true);

    // Inject agent thought & custom updated step in Console
    setTimeout(() => {
      const now2 = new Date().toTimeString().split(" ")[0];
      setConsoleLogs(prev => [...prev, {
        timestamp: now2,
        type: 'thought',
        message: `User suggested: "${feedbackText}". I will incorporate this instructions modification and execute the updated shell command.`
      }]);

      setTimeout(() => {
        const now3 = new Date().toTimeString().split(" ")[0];
        setConsoleLogs(prev => [...prev, {
          timestamp: now3,
          type: 'tool_call',
          message: `run_command(CommandLine: '${commandStr}', Cwd: '/zerosites')`
        }]);

        setTimeout(() => {
          const now4 = new Date().toTimeString().split(" ")[0];
          setConsoleLogs(prev => [...prev, {
            timestamp: now4,
            type: 'tool_output',
            message: "✓ Build completed with custom configurations. Bundle generated."
          }]);

          // Jump past the original command call and continue
          runStep(currentStepIndex + 2);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // --- CLI Input Command Simulation ---
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const cmd = cliInput.trim();
    const now = new Date().toTimeString().split(" ")[0];
    setConsoleLogs(prev => [...prev, {
      timestamp: now,
      type: 'user',
      message: cmd
    }]);

    setCliInput("");

    setTimeout(() => {
      const nowResponse = new Date().toTimeString().split(" ")[0];
      if (cmd.startsWith("help")) {
        setConsoleLogs(prev => [...prev, {
          timestamp: nowResponse,
          type: 'system',
          message: "Available commands: help, clear, status, restart, run-diagnostics"
        }]);
      } else if (cmd.startsWith("clear")) {
        setConsoleLogs([]);
      } else if (cmd.startsWith("status")) {
        const activeAgent = agents.find(a => a.id === selectedAgentId);
        setConsoleLogs(prev => [...prev, {
          timestamp: nowResponse,
          type: 'system',
          message: `Agent: ${activeAgent?.name} | Status: ${activeAgent?.status} | Engine: OK`
        }]);
      } else if (cmd.startsWith("run-diagnostics")) {
        setConsoleLogs(prev => [...prev, {
          timestamp: nowResponse,
          type: 'system',
          message: "Running full environment healthchecks..."
        }]);
        setTimeout(() => {
          const nowDiag = new Date().toTimeString().split(" ")[0];
          setConsoleLogs(prev => [...prev, {
            timestamp: nowDiag,
            type: 'system',
            message: "System Core: 100% | API gateway: 200 OK | File integrity: Verified"
          }]);
        }, 800);
      } else {
        setConsoleLogs(prev => [...prev, {
          timestamp: nowResponse,
          type: 'system',
          message: `Executed shell command: '${cmd}'. Output logged in debug file.`
        }]);
      }
    }, 600);
  };

  // --- Prompts filtering ---
  const filteredPrompts = promptTemplates.filter(temp => {
    const matchSearch = temp.title.toLowerCase().includes(promptSearch.toLowerCase()) || temp.description.toLowerCase().includes(promptSearch.toLowerCase());
    const matchCategory = promptCategory === "ALL" || temp.category.toUpperCase() === promptCategory.toUpperCase();
    return matchSearch && matchCategory;
  });

  // --- Create Agent Handler ---
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("");
  const [newAgentModel, setNewAgentModel] = useState("Gemini 1.5 Pro");
  const [newAgentTemp, setNewAgentTemp] = useState(0.2);
  const [newAgentPrompt, setNewAgentPrompt] = useState("");
  const [newAgentTools, setNewAgentTools] = useState<string[]>(["filesystem"]);

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentRole || !newAgentPrompt) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newAgent: Agent = {
      id: `agent-${agents.length + 1}`,
      name: newAgentName,
      role: newAgentRole,
      avatar: "🤖",
      status: "Idle",
      model: newAgentModel,
      temperature: newAgentTemp,
      maxTokens: 4096,
      systemPrompt: newAgentPrompt,
      tools: newAgentTools,
      metrics: {
        runs: 0,
        successRate: 100.0,
        avgDuration: "0s",
        totalCost: 0.0,
        tokensUsed: 0
      }
    };

    setAgents(prev => [...prev, newAgent]);
    toast.success(`Agent '${newAgentName}' defined successfully!`);
    setShowCreateModal(false);
    
    // Reset form
    setNewAgentName("");
    setNewAgentRole("");
    setNewAgentPrompt("");
  };

  return (
    <div className="h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#00f0ff]/10 selection:text-[#00f0ff] flex flex-col overflow-hidden relative">
      <Toaster position="top-center" theme="dark" />
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-size-[50px_50px] bg-[linear-gradient(to_right,rgba(0,240,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.012)_1px,transparent_1px)] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 h-14 flex items-center justify-between shadow-md shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="hover:bg-slate-800 p-1 rounded-lg border border-slate-800 transition-colors mr-2 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-[#00f0ff] to-[#ff007a] px-2 py-1 rounded text-black font-extrabold text-sm shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              ZR
            </div>
            <h1 className="font-extrabold text-lg flex items-center gap-2 tracking-tight">
              ZeroRapid Agent Manager <span className="font-light text-sm text-slate-500 hidden sm:inline">| Control Plane</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <div className="hidden lg:flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Telemetry: <span className="text-emerald-400 font-semibold">ACTIVE</span></span>
          </div>
          <div className="hidden sm:block">
            <span>Budget: <span className="text-cyan-400 font-mono font-bold">${totalCost}</span></span>
          </div>
          <div>
            <span>Tokens: <span className="text-pink-400 font-mono font-bold">${totalTokens}M</span></span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-grow flex overflow-hidden relative z-10">
        {/* Sidebar Nav */}
        <aside className="w-60 bg-slate-950/40 border-r border-slate-900/80 flex flex-col shrink-0">
          <div className="px-4 py-6 border-b border-slate-900/80">
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-1.5">Active Target Project</div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2">
              <FolderSync className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-semibold text-slate-300">/scratch/zerosites</span>
            </div>
          </div>
          
          <ul className="flex-grow p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LineChart },
              { id: 'console', label: 'Live Console', icon: Terminal },
              { id: 'agents', label: 'Agents Hub', icon: Cpu },
              { id: 'prompts', label: 'Prompt Library', icon: Sparkles },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.03)]' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="p-4 border-t border-slate-900/80 text-center">
            <span className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider">v1.1 Active Sandbox</span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">System Analytics Telemetry</h2>
                  <p className="text-sm text-slate-500 mt-1">Real-time usage metrics and active run parameters for ZeroRapid workflows.</p>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Runs', val: totalRuns, icon: Activity, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                    { label: 'Success Rate', val: `${avgSuccessRate}%`, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Token Expenses', val: `$${totalCost}`, icon: DollarSign, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                    { label: 'Active Requests', val: permissionReq ? '1' : '0', icon: ShieldAlert, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  ].map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <div key={i} className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md">
                        <div className={`p-3 rounded-xl border ${c.color.split(' ').slice(1).join(' ')}`}>
                          <Icon className={`w-6 h-6 ${c.color.split(' ')[0]}`} />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">{c.label}</div>
                          <div className="text-2xl font-black font-mono text-white mt-1">{c.val}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Charts (Inline SVGs using CSS animations for rich fidelity) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6">Execution Telemetry (runs / cost)</h3>
                    <div className="h-60 relative w-full flex items-end">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="h-[1px] w-full bg-slate-700" />
                        <div className="h-[1px] w-full bg-slate-700" />
                        <div className="h-[1px] w-full bg-slate-700" />
                        <div className="h-[1px] w-full bg-slate-700" />
                      </div>
                      
                      {/* SVG line chart */}
                      <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="cyan-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="pink-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff007a" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#ff007a" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area backgrounds */}
                        <path d="M 0 200 L 50 160 L 150 130 L 250 110 L 350 70 L 450 40 L 500 40 L 500 200 Z" fill="url(#cyan-gradient)" />
                        <path d="M 0 200 L 50 180 L 150 160 L 250 140 L 350 110 L 450 90 L 500 90 L 500 200 Z" fill="url(#pink-gradient)" />
                        
                        {/* Lines */}
                        <path d="M 0 200 L 50 160 L 150 130 L 250 110 L 350 70 L 450 40 L 500 40" fill="none" stroke="#00f0ff" strokeWidth="3" />
                        <path d="M 0 200 L 50 180 L 150 160 L 250 140 L 350 110 L 450 90 L 500 90" fill="none" stroke="#ff007a" strokeWidth="3" />
                      </svg>

                      {/* X Labels */}
                      <div className="absolute -bottom-6 inset-x-0 flex justify-between text-[10px] font-mono text-slate-500 px-2">
                        <span>Dec</span>
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6">Tools Frequency</h3>
                    <div className="flex-grow flex items-center justify-center">
                      <div className="relative w-40 h-40">
                        {/* Interactive SVG Pie */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                          <circle r="16" cx="16" cy="16" fill="transparent" stroke="#00f0ff" strokeWidth="32" strokeDasharray="35 100" />
                          <circle r="16" cx="16" cy="16" fill="transparent" stroke="#ff007a" strokeWidth="32" strokeDasharray="28 100" strokeDashoffset="-35" />
                          <circle r="16" cx="16" cy="16" fill="transparent" stroke="#00ff66" strokeWidth="32" strokeDasharray="15 100" strokeDashoffset="-63" />
                          <circle r="16" cx="16" cy="16" fill="transparent" stroke="#ffaa00" strokeWidth="32" strokeDasharray="12 100" strokeDashoffset="-78" />
                          <circle r="16" cx="16" cy="16" fill="transparent" stroke="#a855f7" strokeWidth="32" strokeDasharray="10 100" strokeDashoffset="-90" />
                        </svg>
                        <div className="absolute inset-4 rounded-full bg-slate-950 flex flex-col items-center justify-center border border-slate-900/80">
                          <span className="text-[10px] text-slate-500 font-extrabold uppercase">Total calls</span>
                          <span className="text-xl font-bold font-mono text-white">100</span>
                        </div>
                      </div>
                    </div>
                    {/* Tool Labels */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#00f0ff]" /> Read (35%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#ff007a]" /> Replace (28%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#00ff66]" /> Write (15%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#ffaa00]" /> Shell (12%)</div>
                    </div>
                  </div>
                </div>

                {/* Runs Table */}
                <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
                  <div className="p-6 border-b border-slate-800/80">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Recent Session Logs</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="bg-slate-950/30 border-b border-slate-900">
                          <th className="px-6 py-3 text-slate-500 font-semibold uppercase text-xs">Run ID</th>
                          <th className="px-6 py-3 text-slate-500 font-semibold uppercase text-xs">Agent</th>
                          <th className="px-6 py-3 text-slate-500 font-semibold uppercase text-xs">Workspace</th>
                          <th className="px-6 py-3 text-slate-500 font-semibold uppercase text-xs">Task description</th>
                          <th className="px-6 py-3 text-slate-500 font-semibold uppercase text-xs">Status</th>
                          <th className="px-6 py-3 text-slate-500 font-semibold uppercase text-xs">Cost</th>
                          <th className="px-6 py-3 text-slate-500 font-semibold uppercase text-xs">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {agentRunsHistory.map(run => (
                          <tr key={run.id} className="hover:bg-slate-900/10">
                            <td className="px-6 py-4 font-mono text-cyan-400 font-bold">{run.id}</td>
                            <td className="px-6 py-4 font-semibold text-slate-200">{run.agent}</td>
                            <td className="px-6 py-4 font-mono text-slate-400">{run.project}</td>
                            <td className="px-6 py-4 text-slate-300">{run.task}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                run.status === 'Completed' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' :
                                run.status === 'Running' ? 'bg-cyan-950/20 text-cyan-400 border-cyan-500/20' :
                                'bg-red-950/20 text-red-400 border-red-500/20'
                              }`}>
                                {run.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-200">{run.cost}</td>
                            <td className="px-6 py-4 text-slate-500">{run.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: LIVE CONSOLE */}
            {activeTab === 'console' && (
              <motion.div
                key="console"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col space-y-4"
              >
                {/* Action Controls Bar */}
                <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Agent:</span>
                    <select 
                      value={selectedAgentId} 
                      onChange={(e) => {
                        setSelectedAgentId(e.target.value);
                        stopSimulation();
                      }}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-sm font-semibold py-1.5 px-3 rounded-lg outline-none focus:border-cyan-500"
                    >
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.avatar} {a.name} ({a.role})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={startSimulation}
                      disabled={isSimRunning && !isSimPaused}
                      className="btn btn-primary flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold px-4 py-2 rounded-lg disabled:opacity-40 disabled:scale-100 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>{isSimPaused ? 'Resume' : 'Start Session'}</span>
                    </button>
                    <button 
                      onClick={pauseSimulation}
                      disabled={!isSimRunning}
                      className="btn btn-secondary flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg disabled:opacity-40"
                    >
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause</span>
                    </button>
                    <button 
                      onClick={stopSimulation}
                      disabled={!isSimRunning && !isSimPaused}
                      className="btn btn-secondary flex items-center gap-2 bg-red-950/20 border border-red-900/30 text-red-400 px-4 py-2 rounded-lg disabled:opacity-40"
                    >
                      <Square className="w-4 h-4 fill-red-400" />
                      <span>Stop Session</span>
                    </button>
                  </div>
                </div>

                {/* Workspace Panels Grid */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                  {/* Left Side: Code Editor Viewer */}
                  <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 flex flex-col min-h-0 backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 shrink-0">
                      <span className="font-extrabold text-sm tracking-tight text-slate-200">{fileViewerName}</span>
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">{fileViewerPath}</span>
                    </div>
                    <div className="flex-grow bg-slate-950/80 border border-slate-900 rounded-xl p-4 overflow-auto">
                      {fileContent}
                    </div>
                  </div>

                  {/* Right Side: Log Console Terminal */}
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl flex flex-col min-h-0 overflow-hidden relative shadow-2xl">
                    <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-400">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>agent_session_terminal@zerorapid</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto space-y-3 font-mono text-xs select-text">
                      {consoleLogs.map((log, index) => (
                        <div 
                          key={index}
                          className={`p-2 rounded-lg border leading-relaxed ${
                            log.type === 'system' ? 'text-emerald-400 bg-emerald-950/5 border-emerald-500/10' :
                            log.type === 'thought' ? 'text-amber-400 bg-amber-950/5 border-amber-500/10 italic' :
                            log.type === 'tool_call' ? 'text-cyan-400 bg-cyan-950/5 border-cyan-500/10' :
                            log.type === 'tool_output' ? 'text-slate-400 bg-slate-900/30 border-slate-800' :
                            log.type === 'user' ? 'text-pink-400 bg-pink-950/5 border-pink-500/10' :
                            'text-slate-200'
                          }`}
                        >
                          <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                          <span>{log.message}</span>
                        </div>
                      ))}
                      <div ref={terminalEndRef} />
                    </div>

                    {/* Permissions Alert Popup overlay */}
                    {permissionReq && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-b border-amber-500/20 px-5 py-4 flex items-center gap-3">
                            <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
                            <span className="font-extrabold text-sm uppercase tracking-wider text-amber-400">Permission Required</span>
                          </div>
                          
                          <div className="p-5 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed">{permissionReq.payload?.reason}</p>
                            
                            <div 
                              className="bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-xs text-cyan-400 break-all select-all outline-none"
                              contentEditable={showFeedbackInput}
                              onBlur={(e) => {
                                if (permissionReq.payload) permissionReq.payload.target = e.target.textContent || "";
                              }}
                            >
                              {permissionReq.payload?.target}
                            </div>

                            {showFeedbackInput && (
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Suggestions / Directions</label>
                                <textarea 
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-pink-500 min-h-16 resize-y"
                                  placeholder="Suggest command adjustments or instructions..."
                                />
                                <button 
                                  onClick={handleSuggestSubmit}
                                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold py-2 rounded-lg"
                                >
                                  Submit Instructions
                                </button>
                              </div>
                            )}

                            {!showFeedbackInput && (
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={handleDeny}
                                  className="px-4 py-2 border border-red-500/20 bg-red-950/20 text-red-400 rounded-lg text-xs font-bold"
                                >
                                  Deny Run
                                </button>
                                <button 
                                  onClick={() => setShowFeedbackInput(true)}
                                  className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                                >
                                  Suggest Edits
                                </button>
                                <button 
                                  onClick={handleApprove}
                                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                                >
                                  Approve & Run
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Console Simulated input */}
                    <form onSubmit={handleCliSubmit} className="bg-slate-950/60 border-t border-slate-800 px-4 py-2.5 flex items-center gap-2 shrink-0">
                      <span className="text-emerald-400 font-bold font-mono">$</span>
                      <input 
                        type="text" 
                        value={cliInput}
                        onChange={(e) => setCliInput(e.target.value)}
                        className="bg-transparent border-none outline-none font-mono text-xs text-slate-200 flex-grow"
                        placeholder="Type terminal command (e.g. help, clear, status, run-diagnostics)..."
                      />
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: AGENTS HUB */}
            {activeTab === 'agents' && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Active Agent Profiles</h2>
                    <p className="text-sm text-slate-500 mt-1">Configure parameters, prompt instructions, and tool access limits.</p>
                  </div>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold px-4 py-2.5 rounded-lg hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Define New Agent</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agents.map(a => (
                    <div key={a.id} className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md hover:border-slate-700/60 transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center text-2xl">
                              {a.avatar}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-200 tracking-tight">{a.name}</h4>
                              <span className="text-xs text-slate-500 font-semibold">{a.role}</span>
                            </div>
                          </div>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            a.status === 'Running' ? 'bg-cyan-950/20 text-cyan-400 border-cyan-500/20 animate-pulse' :
                            a.status === 'Paused' ? 'bg-amber-950/20 text-amber-400 border-amber-500/20' :
                            a.status === 'Errored' ? 'bg-red-950/20 text-red-400 border-red-500/20' :
                            'bg-slate-800/30 text-slate-400 border-slate-800'
                          }`}>
                            {a.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 italic">"{a.systemPrompt}"</p>
                        
                        <div className="border-t border-slate-900 pt-4 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Core Model</span>
                            <span className="font-mono text-slate-300 font-bold">{a.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Completed Sessions</span>
                            <span className="font-mono text-slate-300">{a.metrics.runs} runs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Total Run Cost</span>
                            <span className="font-mono text-slate-300">${a.metrics.totalCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 mt-5 pt-4">
                        <div className="flex gap-1">
                          {a.tools.map(tool => (
                            <span key={tool} className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-900">
                              {tool}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedAgentId(a.id);
                            setActiveTab('console');
                            stopSimulation();
                          }}
                          className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                        >
                          Launch Console
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: PROMPTS */}
            {activeTab === 'prompts' && (
              <motion.div
                key="prompts"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">System Prompt Library</h2>
                  <p className="text-sm text-slate-500 mt-1">Repository of reusable base guides and instructions for quick agent delegation.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                  <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2.5 w-full sm:max-w-xs focus-within:border-cyan-500">
                    <Search className="w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={promptSearch}
                      onChange={(e) => setPromptSearch(e.target.value)}
                      placeholder="Search templates..." 
                      className="bg-transparent border-none outline-none text-sm text-slate-200 w-full"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {['ALL', 'CSS', 'BACKEND', 'TESTING', 'SEO'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setPromptCategory(cat)}
                        className={`px-3 py-1.5 rounded-full border font-bold transition-all ${
                          promptCategory === cat 
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                            : 'bg-slate-900/30 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPrompts.map(temp => (
                    <div key={temp.id} className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-extrabold text-slate-200 tracking-tight">{temp.title}</h4>
                          <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-pink-950/20 text-pink-400 border border-pink-500/20 tracking-wider">{temp.category}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">{temp.description}</p>
                        <div className="bg-slate-950/80 border border-slate-900 p-3.5 rounded-xl font-mono text-[11px] text-slate-500 max-h-24 overflow-hidden relative">
                          {temp.prompt}
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 pt-3 border-t border-slate-900">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(temp.prompt);
                            toast.success("Copied template prompt to clipboard!");
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">System Controls</h2>
                    <p className="text-sm text-slate-500 mt-1">Configure active sandbox constraints, cost caps, and LLM routes.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Primary Provider</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none">
                        <option>Google Vertex AI (Gemini)</option>
                        <option>Anthropic (Claude)</option>
                        <option>OpenAI (GPT-4)</option>
                        <option>Ollama (Local Llama)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">API Endpoint Route</label>
                      <input 
                        type="text" 
                        defaultValue="https://api.zerorapid.in/v1/agents"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Bearer Authorization Key</label>
                    <input 
                      type="password" 
                      defaultValue="••••••••••••••••••••••••••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Max Session Cost Limit ($)</label>
                      <input 
                        type="number" 
                        defaultValue="5.00"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Global Timeout Threshold (sec)</label>
                      <input 
                        type="number" 
                        defaultValue="300"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Sandbox Execution Restrictions</label>
                    <div className="space-y-2 text-xs">
                      {[
                        { label: "Isolate filesystem writes to current workspace directory", val: true },
                        { label: "Always trigger human approval on shell commands execution", val: true },
                        { label: "Always trigger human approval on main file replacements", val: true },
                        { label: "Allow automatic style corrections (lint fixing)", val: false },
                      ].map((perm, index) => (
                        <label key={index} className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                          <input type="checkbox" defaultChecked={perm.val} className="w-4 h-4 accent-cyan-500" />
                          <span>{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-900">
                    <button 
                      onClick={() => toast.success("System controls saved successfully!")}
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-bold rounded-lg"
                    >
                      Save Controls
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                  <div className="space-y-6">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Container Diagnostics</h3>
                    
                    <div className="space-y-4 text-xs font-mono">
                      {[
                        { label: "Diagnostic Status", val: "Online", highlight: "text-emerald-400" },
                        { label: "Client Latency", val: "12ms", highlight: "" },
                        { label: "Node Runtime", val: "v18.16.0", highlight: "" },
                        { label: "Docker Core", val: "Enabled", highlight: "" },
                        { label: "Memory Allocated", val: "1.4GB / 4.0GB", highlight: "" },
                      ].map((diag, index) => (
                        <div key={index} className="flex justify-between border-b border-slate-900 pb-2">
                          <span className="text-slate-500">{diag.label}</span>
                          <span className={`font-bold ${diag.highlight || 'text-slate-300'}`}>{diag.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* DIALOG: CREATE NEW AGENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <span className="font-extrabold text-base tracking-tight text-white">Define New System Agent</span>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-red-400 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateAgent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Agent Tag Name</label>
                  <input 
                    type="text" 
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="e.g. Test-Sentry"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">System Role / Function</label>
                  <input 
                    type="text" 
                    value={newAgentRole}
                    onChange={(e) => setNewAgentRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="e.g. QA Automation"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">LLM Model Engine</label>
                  <select 
                    value={newAgentModel}
                    onChange={(e) => setNewAgentModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
                  >
                    <option>Claude 3.5 Sonnet</option>
                    <option>Gemini 1.5 Pro</option>
                    <option>GPT-4o</option>
                    <option>Llama 3 70B</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Sampling Temperature</label>
                  <input 
                    type="number" 
                    value={newAgentTemp}
                    onChange={(e) => setNewAgentTemp(parseFloat(e.target.value))}
                    min="0.0" 
                    max="1.0" 
                    step="0.1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Directive Prompt Instructions</label>
                <textarea 
                  value={newAgentPrompt}
                  onChange={(e) => setNewAgentPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 min-h-20"
                  placeholder="Define constraints, guidelines, context..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Enable Tool Permissions</label>
                <div className="flex gap-4">
                  {[
                    { label: "File system", val: "filesystem" },
                    { label: "Shell execute", val: "shell" },
                    { label: "Web search", val: "web_search" },
                  ].map(tool => (
                    <label key={tool.val} className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newAgentTools.includes(tool.val)}
                        onChange={(e) => {
                          if (e.target.checked) setNewAgentTools(prev => [...prev, tool.val]);
                          else setNewAgentTools(prev => prev.filter(t => t !== tool.val));
                        }}
                        className="w-4 h-4 accent-cyan-500" 
                      />
                      <span className="text-slate-300">{tool.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-900 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-lg font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  Define Agent
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
