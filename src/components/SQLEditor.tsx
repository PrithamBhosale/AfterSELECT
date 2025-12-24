import { useState, useCallback, useRef, useEffect } from 'react';
import Editor, { OnMount, BeforeMount } from '@monaco-editor/react';
import { Play, Copy, RotateCcw, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { editor } from 'monaco-editor';

interface SQLEditorProps {
  initialQuery: string;
  onRun: (query: string) => void;
  practiceMode?: boolean;
}

const SQLEditor = ({ initialQuery, onRun, practiceMode = true }: SQLEditorProps) => {
  const [query, setQuery] = useState(practiceMode ? '' : initialQuery);
  const [copied, setCopied] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const userQueryRef = useRef<string>('');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Detect if user is on Mac/iOS
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Configure Monaco before mount
  const handleBeforeMount: BeforeMount = (monaco) => {
    // Define a custom dark theme for SQL
    monaco.editor.defineTheme('sql-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '60a5fa', fontStyle: 'bold' }, // sky-400
        { token: 'keyword.sql', foreground: '60a5fa', fontStyle: 'bold' },
        { token: 'operator.sql', foreground: '94a3b8' }, // slate-400
        { token: 'number', foreground: 'fbbf24' }, // amber-400
        { token: 'string', foreground: '34d399' }, // emerald-400
        { token: 'string.sql', foreground: '34d399' },
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' }, // slate-500
        { token: 'identifier', foreground: 'f1f5f9' }, // slate-100
        { token: 'predefined.sql', foreground: 'e879f9' }, // fuchsia-400 for functions
      ],
      colors: {
        'editor.background': '#0f172a', // slate-900
        'editor.foreground': '#f1f5f9', // slate-100
        'editor.lineHighlightBackground': '#1e293b80', // slate-800 with opacity
        'editor.lineHighlightBorder': '#3b82f6', // blue-500
        'editorLineNumber.foreground': '#64748b', // slate-500
        'editorLineNumber.activeForeground': '#60a5fa', // sky-400
        'editor.selectionBackground': '#3b82f650', // blue-500 with opacity
        'editor.inactiveSelectionBackground': '#3b82f630',
        'editorCursor.foreground': '#60a5fa', // sky-400
        'editorWhitespace.foreground': '#334155', // slate-700
        'editorIndentGuide.background': '#334155',
        'editorIndentGuide.activeBackground': '#475569', // slate-600
        'editor.wordHighlightBackground': '#3b82f630',
        'editorBracketMatch.background': '#3b82f640',
        'editorBracketMatch.border': '#3b82f6',
      },
    });
  };

  // Handle editor mount
  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Add keyboard shortcut for running query
    editor.addAction({
      id: 'run-query',
      label: 'Run Query',
      keybindings: [
        monaco.KeyMod.Alt | monaco.KeyCode.KeyX, // Alt + X
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, // Ctrl/Cmd + Enter
      ],
      run: () => {
        onRun(editor.getValue());
      },
    });

    // Focus the editor
    editor.focus();
  };

  // Handle editor change
  const handleEditorChange = (value: string | undefined) => {
    setQuery(value || '');
  };

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [query]);

  const handleReset = useCallback(() => {
    const newValue = practiceMode ? '' : initialQuery;
    setQuery(newValue);
    setShowSolution(false);
    userQueryRef.current = '';
    if (editorRef.current) {
      editorRef.current.setValue(newValue);
      editorRef.current.focus();
    }
  }, [initialQuery, practiceMode]);

  const handleRun = useCallback(() => {
    onRun(query);
  }, [query, onRun]);

  const handleShowSolution = useCallback(() => {
    if (!showSolution) {
      userQueryRef.current = query;
      setQuery(initialQuery);
      setShowSolution(true);
      if (editorRef.current) {
        editorRef.current.setValue(initialQuery);
      }
    } else {
      setQuery(userQueryRef.current);
      setShowSolution(false);
      if (editorRef.current) {
        editorRef.current.setValue(userQueryRef.current);
      }
    }
  }, [showSolution, initialQuery, query]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'x') || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
        e.preventDefault();
        onRun(query);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [query, onRun]);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
          </div>
          <span className="text-xs font-medium text-slate-400">query.sql</span>
          {showSolution && (
            <span className="text-[10px] px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full font-medium animate-pulse">
              SOLUTION
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {practiceMode && (
            <button
              onClick={handleShowSolution}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                showSolution
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              )}
            >
              {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{showSolution ? 'Hide' : 'Solution'}</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors ml-1 shadow-lg shadow-green-500/20"
            title={isMac ? 'Run query (⌘ + Enter)' : 'Run query (Ctrl + Enter)'}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run</span>
            <span className="hidden sm:inline text-[10px] opacity-70 ml-1 bg-green-600/50 px-1.5 py-0.5 rounded">
              {isMac ? '⌘↵' : 'Ctrl+↵'}
            </span>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0 relative">
        {!isEditorReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading editor...</span>
            </div>
          </div>
        )}
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={handleEditorChange}
          beforeMount={handleBeforeMount}
          onMount={handleEditorMount}
          theme="sql-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Monaco, 'Courier New', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: true,
            snippetSuggestions: 'inline',
            wordBasedSuggestions: 'currentDocument',
            parameterHints: { enabled: true },
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'mouseover',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            lineDecorationsWidth: 8,
            renderLineHighlight: 'all',
            renderLineHighlightOnlyWhenFocus: false,
            occurrencesHighlight: 'singleFile',
            selectionHighlight: true,
            links: false,
            contextmenu: true,
            mouseWheelZoom: true,
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            // SQL-specific suggestions
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
              showVariables: true,
              showWords: true,
              insertMode: 'insert',
              filterGraceful: true,
              snippetsPreventQuickSuggestions: false,
            },
          }}
        />
      </div>

      {/* Status bar */}
      <div className="h-6 bg-slate-800 border-t border-slate-700 flex items-center justify-between px-3 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span>{query.split('\n').length} lines</span>
          <span className="text-slate-600">|</span>
          <span>{query.length} chars</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-2 text-slate-500">
            <span>Ctrl+Space = suggestions</span>
            <span className="text-slate-600">•</span>
            <span>Ctrl+/ = comment</span>
            <span className="text-slate-600">•</span>
            <span>Ctrl+F = find</span>
          </span>
          <span className="text-blue-400 font-semibold">SQL</span>
        </div>
      </div>
    </div>
  );
};

export default SQLEditor;
