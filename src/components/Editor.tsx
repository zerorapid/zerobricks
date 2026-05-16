import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote, 
  Undo, 
  Redo,
  Underline as UnderlineIcon,
  CheckSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function Editor({ content, onChange, placeholder = 'Start typing...' }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg focus:outline-none max-w-none w-full h-full p-4 sm:p-8',
      },
    },
  });

  // Sync content if it changes externally (e.g. switching notes)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, 
    active, 
    children, 
    disabled = false,
    label
  }: { 
    onClick: () => void; 
    active?: boolean; 
    children: React.ReactNode;
    disabled?: boolean;
    label: string;
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        'p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center transition-all duration-200 rounded hover:bg-app-accent/20 disabled:opacity-30',
        active 
          ? 'text-app-navy bg-app-accent/40' 
          : 'text-app-blue hover:text-app-navy'
      )}
      title={label}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 px-4 py-2 border-b border-app-accent bg-app-secondary sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-1 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            label="Bold"
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            label="Italic"
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            label="Underline"
          >
            <UnderlineIcon size={14} />
          </ToolbarButton>
        </div>
        
        <div className="w-[1px] h-4 bg-app-accent shrink-0 mx-2" />

        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            label="H1"
          >
            <Heading1 size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            label="H2"
          >
            <Heading2 size={14} />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-4 bg-zinc-200 shrink-0 mx-2" />

        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            label="Bullet List"
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            label="Numbered List"
          >
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            label="Quote"
          >
            <Quote size={14} />
          </ToolbarButton>
        </div>

        <div className="ml-auto flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            label="Undo"
          >
            <Undo size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            label="Redo"
          >
            <Redo size={14} />
          </ToolbarButton>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto bg-white cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} className="h-full" />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--color-app-accent);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
           height: 100%;
        }
        .ProseMirror blockquote {
          border-left: 4px solid var(--color-app-accent);
          padding-left: 1.5rem;
          font-style: italic;
          color: var(--color-app-blue);
          margin-left: 0;
          margin-right: 0;
        }
        .ProseMirror h1 {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          color: var(--color-app-navy);
        }
        .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: var(--color-app-navy);
        }
        .ProseMirror ul:not([data-type="taskList"]) {
          list-style-type: disc;
          padding-left: 2rem;
          margin-bottom: 1.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 2rem;
          margin-bottom: 1.5rem;
        }
        .ProseMirror p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: var(--color-app-navy);
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul[data-type="taskList"] label {
          user-select: none;
          flex: 0 0 auto;
          margin-top: 0.25rem;
          cursor: pointer;
        }
        .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid var(--color-app-accent);
          border-radius: 0.5rem;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          display: block;
          margin: 0;
        }
        .ProseMirror ul[data-type="taskList"] input[type="checkbox"]:hover {
          border-color: var(--color-app-blue);
        }
        .ProseMirror ul[data-type="taskList"] input[type="checkbox"]:checked {
          background-color: var(--color-app-navy);
          border-color: var(--color-app-navy);
        }
        .ProseMirror ul[data-type="taskList"] input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .ProseMirror ul[data-type="taskList"] div {
          flex: 1 1 auto;
          margin: 0;
        }
        .ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div {
          text-decoration: line-through;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
