"use client";

import { useState, useEffect, useRef } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/Editor";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
    Play,
    Save,
    Upload,
    Download,
    File,
    FolderPlus,
    ChevronDown,
    Settings,
    User,
    Send,
    MessageSquare,
    Bot,
    LogOut,
    FolderOpen,
    Copy
} from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface CodeEditorProps {
    session: Session | null;
}

interface FileTab {
    name: string;
    content: string;
    language: string;
}

interface AiMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function CodeEditor({ session }: CodeEditorProps) {
    // File Management State
    const [openFiles, setOpenFiles] = useState<FileTab[]>([
        { name: 'main.py', content: '', language: 'python' }
    ]);
    const [activeFileIndex, setActiveFileIndex] = useState(0);

    // Code Editor State
    const [language, setLanguage] = useState('71'); // Python 3.8.1 as default
    const [output, setOutput] = useState('');
    const [programInput, setProgramInput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [executionStats, setExecutionStats] = useState<any>(null);

    // UI State
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');
    const [isAiEnabled, setIsAiEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [targetRepo, setTargetRepo] = useState('codeer_data');

    // AI Assistant State
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
    const [availableModels, setAvailableModels] = useState<any[]>([]);

    // Ref for auto-scrolling chat
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Load API key from localStorage on component mount
    useEffect(() => {
        const savedApiKey = localStorage.getItem('openrouter-api-key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
        }
    }, []);

    // Save API key to localStorage when it changes
    const handleApiKeyChange = (newKey: string) => {
        setApiKey(newKey);
        if (newKey) {
            localStorage.setItem('openrouter-api-key', newKey);
        } else {
            localStorage.removeItem('openrouter-api-key');
        }
    };

    // Copy message content to clipboard
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    };

    // Get current file
    const currentFile = openFiles[activeFileIndex];
    const code = currentFile?.content || '';

    const setCode = (newCode: string) => {
        const updatedFiles = [...openFiles];
        updatedFiles[activeFileIndex] = {
            ...updatedFiles[activeFileIndex],
            content: newCode
        };
        setOpenFiles(updatedFiles);
    };

    // Fetch available AI models
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('/api/openrouter-models');
                const result = await response.json();
                if (result.success) {
                    setAvailableModels(result.models);
                }
            } catch (error) {
                console.error('Failed to fetch AI models:', error);
            }
        };
        fetchModels();
    }, []);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages, isAiLoading]);

    // Language mapping for Judge0
    const getLanguageId = (lang: string): number => {
        // Since language is now the actual Judge0 API ID as a string, just parse it
        const id = parseInt(lang, 10);
        return isNaN(id) ? 71 : id; // Default to Python 3.8.1 if invalid
    };

    // File operations
    const createNewFile = () => {
        const newFileName = prompt('Enter file name:') || `file${openFiles.length + 1}.py`;
        const newFile: FileTab = {
            name: newFileName,
            content: '',
            language: language
        };
        setOpenFiles([...openFiles, newFile]);
        setActiveFileIndex(openFiles.length);
    };

    const closeFile = (index: number) => {
        if (openFiles.length === 1) return; // Don't close the last file

        const updatedFiles = openFiles.filter((_, i) => i !== index);
        setOpenFiles(updatedFiles);

        if (index === activeFileIndex) {
            setActiveFileIndex(Math.max(0, index - 1));
        } else if (index < activeFileIndex) {
            setActiveFileIndex(activeFileIndex - 1);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const newFile: FileTab = {
                    name: file.name,
                    content: content,
                    language: getLanguageFromFileName(file.name)
                };
                setOpenFiles([...openFiles, newFile]);
                setActiveFileIndex(openFiles.length);
            };
            reader.readAsText(file);
        }
    };

    const getLanguageFromFileName = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const extensionMap: { [key: string]: string } = {
            js: '63',     // JavaScript (Node.js 12.14.0)
            py: '71',     // Python (3.8.1)
            java: '62',   // Java (OpenJDK 13.0.1)
            cpp: '54',    // C++ (GCC 9.2.0)
            c: '50',      // C (GCC 9.2.0)
            cs: '51',     // C# (Mono 6.6.0.161)
            go: '60',     // Go (1.13.5)
            rs: '73',     // Rust (1.40.0)
            php: '68',    // PHP (7.4.1)
            rb: '72',     // Ruby (2.7.0)
            ts: '74',     // TypeScript (3.7.4)
            sh: '46',     // Bash (5.0.0)
            sql: '82',    // SQL (SQLite 3.27.2)
            r: '80',      // R (4.0.0)
            swift: '83',  // Swift (5.2.3)
            kt: '78',     // Kotlin (1.3.70)
            scala: '81',  // Scala (2.13.2)
            hs: '61',     // Haskell (GHC 8.8.1)
            fs: '87',     // F# (.NET Core SDK 3.1.202)
            vb: '84',     // Visual Basic.Net
            pl: '85',     // Perl (5.28.1)
            lua: '64',    // Lua (5.3.5)
            pas: '67',    // Pascal (FPC 3.0.4)
            f90: '59',    // Fortran (GFortran 9.2.0)
            asm: '45',    // Assembly (NASM 2.14.02)
            clj: '86',    // Clojure (1.10.1)
            lisp: '55',   // Common Lisp (SBCL 2.0.0)
            ml: '65',     // OCaml (4.09.0)
            d: '56',      // D (DMD 2.089.1)
            ex: '57',     // Elixir (1.9.4)
            erl: '58',    // Erlang (OTP 22.2)
            m: '66',      // Octave (5.1.0) or Objective-C
            groovy: '88', // Groovy (3.0.3)
            cob: '77',    // COBOL (GnuCOBOL 2.2)
            txt: '43',    // Plain Text
        };
        return extensionMap[extension || ''] || '71'; // Default to Python 3.8.1
    };

    const downloadFile = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFile.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Code execution
    const executeCode = async () => {
        setIsRunning(true);
        setOutput('Running...');
        setActiveTab('output');

        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: getLanguageId(language),
                    stdin: programInput,
                }),
            });

            const result = await response.json();
            setOutput(result.output || result.error || 'No output');
            setExecutionStats(result.stats);
        } catch (error) {
            setOutput('Error executing code: ' + error);
        } finally {
            setIsRunning(false);
        }
    };

    // GitHub save functionality
    const saveCode = async () => {
        if (!session) {
            alert('Please sign in to save files to GitHub');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/github-save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: currentFile.name,
                    content: code,
                    repository: targetRepo,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`File saved to GitHub successfully! Repository: ${result.repository}`);
            } else {
                console.error('GitHub save error:', result);
                alert(`Failed to save file to GitHub: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving file to GitHub');
        } finally {
            setIsSaving(false);
        }
    };

    // GitHub load functionality
    const loadFromGitHub = async () => {
        if (!session) {
            alert('Please sign in to load files from GitHub');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/github-load', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    repository: targetRepo,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('GitHub load result:', result);
                console.log('Debug info:', result.debug);

                // Clear existing files and load new ones
                const loadedFiles: FileTab[] = result.files.map((file: any) => ({
                    name: file.name,
                    content: file.content,
                    language: getLanguageFromFileName(file.name)
                }));

                console.log('Loaded files:', loadedFiles);
                console.log('File names:', loadedFiles.map(f => f.name));

                if (loadedFiles.length > 0) {
                    setOpenFiles(loadedFiles);
                    setActiveFileIndex(0);
                    alert(`Successfully loaded ${loadedFiles.length} files from repository: ${result.repository}\n\nFiles: ${loadedFiles.map(f => f.name).join(', ')}`);
                } else {
                    alert(`No code files found in the repository. Debug info: ${JSON.stringify(result.debug, null, 2)}`);
                }
            } else {
                console.error('GitHub load error:', result);
                alert(`Failed to load files from GitHub: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Load error:', error);
            alert('Error loading files from GitHub');
        } finally {
            setIsLoading(false);
        }
    };

    // AI Assistant functionality
    const sendAiMessage = async () => {
        if (!aiInput.trim() || !apiKey) return;

        const userMessage: AiMessage = { role: 'user', content: aiInput };
        setAiMessages(prev => [...prev, userMessage]);
        setAiInput('');
        setIsAiLoading(true);

        try {
            const response = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: aiInput,
                    code: code,
                    language: language,
                    apiKey: apiKey,
                    model: selectedModel,
                }),
            });

            const result = await response.json();
            const assistantMessage: AiMessage = {
                role: 'assistant',
                content: result.response || 'Sorry, I could not generate a response.'
            };
            setAiMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: AiMessage = {
                role: 'assistant',
                content: 'Error communicating with AI assistant.'
            };
            setAiMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#1e1e1e] text-white flex flex-col">
            {/* Toolbar */}
            <div className="h-12 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-4">
                {/* Left side - Branding, Language selector, and Run button */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-white font-bold text-lg uppercase" style={{ fontFamily: 'var(--font-gugi)' }}>CODEER</span>
                    </div>
                    <div className="w-48">
                        <LanguageSelector language={language} onLanguageChange={setLanguage} />
                    </div>
                    <button
                        onClick={executeCode}
                        disabled={isRunning}
                        className="flex items-center px-3 py-1 text-xs font-medium text-white bg-[#2d2d30] hover:bg-[#3e3e42] disabled:bg-[#1e1e1e] disabled:text-gray-500 disabled:cursor-not-allowed border border-[#3e3e42] hover:border-[#4e4e52] rounded transition-colors duration-200"
                    >
                        <Play className="w-3 h-3 mr-1" />
                        {isRunning ? 'Running...' : 'Run'}
                    </button>
                </div>

                {/* Right side - AI toggle and user info */}
                <div className="flex items-center space-x-3">
                    <Button
                        onClick={() => setIsAiEnabled(!isAiEnabled)}
                        variant="outline"
                        size="sm"
                        className={`h-7 px-3 text-xs border-[#3e3e42] ${isAiEnabled
                            ? 'bg-[#007acc] text-white border-[#007acc]'
                            : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#2d2d30]'
                            }`}
                    >
                        <Bot className="w-3 h-3 mr-1" />
                        AI {isAiEnabled ? 'ON' : 'OFF'}
                    </Button>
                    {session ? (
                        <div className="flex items-center space-x-3">
                            <span className="text-white text-sm">Welcome, {session.user?.name || 'User'}</span>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white hover:bg-[#3e3e42] h-7 px-3 text-xs"
                            >
                                <User className="w-3 h-3 mr-1" />
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* File Tabs and Controls */}
            <div className="h-10 bg-[#1e1e1e] border-b border-[#2d2d30] flex items-center justify-between px-4">
                <div className="flex items-center space-x-2 flex-1">
                    {/* File Tabs */}
                    <div className="flex items-center space-x-1">
                        {openFiles.map((file, index) => (
                            <div
                                key={index}
                                className={`flex items-center space-x-1 px-3 py-1 rounded-t text-sm cursor-pointer ${index === activeFileIndex
                                    ? 'bg-[#2d2d30] text-white border-t border-l border-r border-[#3e3e42]'
                                    : 'text-gray-400 hover:text-white hover:bg-[#2d2d30]'
                                    }`}
                                onClick={() => setActiveFileIndex(index)}
                            >
                                <File className="w-3 h-3" />
                                <span>{file.name}</span>
                                {openFiles.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            closeFile(index);
                                        }}
                                        className="ml-1 text-gray-500 hover:text-white text-xs"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        <Button
                            onClick={createNewFile}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:bg-[#2d2d30] hover:text-white h-7 px-2"
                        >
                            <FolderPlus className="w-3 h-3 mr-1" />
                            New File
                        </Button>
                    </div>
                </div>

                {/* File Operations */}
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        accept=".js,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.ts,.sh,.sql,.r,.swift,.kt,.scala,.hs,.fs,.vb,.pl,.lua,.pas,.f90,.asm,.clj,.lisp,.ml,.d,.ex,.erl,.m,.groovy,.cob,.txt,.html,.css,.json"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                    />
                    <Button onClick={() => document.getElementById('file-upload')?.click()} variant="ghost" size="sm" className="text-gray-400 hover:bg-[#2d2d30] hover:text-white h-7 px-2">
                        <Upload className="w-3 h-3 mr-1" />Upload
                    </Button>
                    <Button onClick={downloadFile} variant="ghost" size="sm" className="text-gray-400 hover:bg-[#2d2d30] hover:text-white h-7 px-2">
                        <Download className="w-3 h-3 mr-1" />Download
                    </Button>
                    <select
                        value={targetRepo}
                        onChange={(e) => setTargetRepo(e.target.value)}
                        className="bg-[#2d2d30] border border-[#3e3e42] text-white text-xs px-2 py-1 rounded"
                    >
                        <option value="codeer_data">codeer_data</option>
                        <option value="new_repo">Create New Repo</option>
                    </select>
                    <Button onClick={loadFromGitHub} disabled={isLoading} variant="ghost" size="sm" className="text-[#FFA500] hover:bg-[#2d2d30] h-7 px-2">
                        <FolderOpen className="w-3 h-3 mr-1" />{isLoading ? 'Loading...' : 'Load'}
                    </Button>
                    <Button onClick={saveCode} disabled={isSaving} variant="ghost" size="sm" className="text-[#007acc] hover:bg-[#2d2d30] h-7 px-2">
                        <Save className="w-3 h-3 mr-1" />{isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>

            {/* Main Resizable Layout */}
            <div className="flex-1 min-h-0">
                <PanelGroup direction="horizontal" className="h-full">
                    {/* Code Editor Panel */}
                    <Panel defaultSize={isAiEnabled ? 50 : 70} minSize={30}>
                        <div className="h-full bg-[#1e1e1e] flex flex-col">
                            <Editor value={code} onChange={setCode} language={language} />
                        </div>
                    </Panel>

                    {/* AI Assistant Panel */}
                    {isAiEnabled && (
                        <>
                            <PanelResizeHandle className="w-2 bg-[#2d2d30] hover:bg-[#3e3e42] cursor-col-resize border-l border-r border-[#3e3e42]" />
                            <Panel defaultSize={25} minSize={20}>
                                <div className="h-full bg-[#1e1e1e] flex flex-col">
                                    {/* AI Header */}
                                    <div className="h-14 bg-[#1e1e1e] border-b border-[#2d2d30] flex items-center justify-between px-4 relative z-10">
                                        <div className="flex items-center space-x-2">
                                            <Bot className="w-5 h-5 text-[#007acc]" />
                                            <span className="text-white text-sm font-medium">AI Assistant</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <select
                                                value={selectedModel}
                                                onChange={(e) => setSelectedModel(e.target.value)}
                                                className="bg-[#2d2d30] border border-[#3e3e42] text-white text-xs px-2 py-1 rounded w-60 relative z-20 hover:bg-[#383838] transition-colors"
                                                title="Select AI Model"
                                            >
                                                {availableModels.length > 0 ? (
                                                    // Remove duplicates based on model ID and show full names
                                                    Array.from(new Map(availableModels.map(model => [model.id, model])).values())
                                                        .map((model) => {
                                                            const isFree = model.pricing?.prompt === '0' || model.pricing?.prompt === 0;
                                                            const fullName = model.name || model.id;

                                                            // Show full model name with free indicator
                                                            const displayName = isFree ? `🟢 ${fullName}` : fullName;

                                                            return (
                                                                <option
                                                                    key={model.id}
                                                                    value={model.id}
                                                                    title={`${model.name}${isFree ? ' (Free)' : ''}`}
                                                                    className="bg-[#2d2d30] text-white"
                                                                >
                                                                    {displayName}
                                                                </option>
                                                            );
                                                        })
                                                ) : (
                                                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                                                )}
                                            </select>
                                            <div
                                                className="text-gray-400 hover:text-gray-300 cursor-help text-xs"
                                                title={availableModels.length > 0 ?
                                                    `Current: ${availableModels.find(m => m.id === selectedModel)?.name || selectedModel}\n🟢 = Free model` :
                                                    'AI models loading...'
                                                }
                                            >
                                                ℹ️
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-400 hover:bg-[#2d2d30] h-7 px-2"
                                                onClick={() => {
                                                    const key = prompt('Enter your OpenRouter API Key:');
                                                    if (key) handleApiKeyChange(key);
                                                }}
                                            >
                                                <Settings className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* AI Chat Area */}
                                    <div className="flex-1 flex flex-col p-4 min-h-0">
                                        <div className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-[500px] scrollbar-hide">
                                            {aiMessages.length === 0 && (
                                                <div className="text-center text-gray-400 text-sm">
                                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                    <p>Ask AI about your code...</p>
                                                </div>
                                            )}
                                            {aiMessages.map((message, index) => (
                                                <div
                                                    key={index}
                                                    className={`group relative p-3 rounded-lg text-sm ${message.role === 'user'
                                                        ? 'bg-[#007acc] text-white ml-8'
                                                        : 'bg-[#2d2d30] text-gray-300 mr-8'
                                                        }`}
                                                >
                                                    <div className="whitespace-pre-wrap pr-8">{message.content}</div>
                                                    <button
                                                        onClick={() => copyToClipboard(message.content)}
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/20"
                                                        title="Copy message"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {isAiLoading && (
                                                <div className="bg-[#2d2d30] text-gray-300 mr-8 p-3 rounded-lg text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#007acc]"></div>
                                                        <span>AI is thinking...</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>

                                        {/* AI Input */}
                                        <div className="flex space-x-2">
                                            <textarea
                                                value={aiInput}
                                                onChange={(e) => setAiInput(e.target.value)}
                                                placeholder="Ask AI about your code..."
                                                className="flex-1 bg-[#2d2d30] border border-[#3e3e42] text-white placeholder-gray-400 p-3 rounded text-sm resize-none"
                                                rows={3}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.ctrlKey) {
                                                        sendAiMessage();
                                                    }
                                                }}
                                            />
                                            <Button
                                                onClick={sendAiMessage}
                                                disabled={isAiLoading || !aiInput.trim() || !apiKey}
                                                className="bg-[#007acc] hover:bg-[#005a9e] text-white px-4 self-end"
                                            >
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {!apiKey && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                Click the settings icon to add your OpenRouter API key
                                            </p>
                                        )}
                                        <div className="text-xs text-gray-500 mt-2 text-center">
                                            <a
                                                href="https://openrouter.ai"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-gray-300 underline"
                                            >
                                                OpenRouter
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </>
                    )}

                    {/* Input/Output Panel */}
                    <PanelResizeHandle className="w-2 bg-[#2d2d30] hover:bg-[#3e3e42] cursor-col-resize border-l border-r border-[#3e3e42]" />
                    <Panel defaultSize={25} minSize={20}>
                        <div className="h-full bg-[#1e1e1e] flex flex-col min-h-0">
                            {/* Input/Output Header */}
                            <div className="h-12 bg-[#1e1e1e] border-b border-[#2d2d30] flex">
                                <button
                                    onClick={() => setActiveTab('input')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'input'
                                        ? 'text-white border-[#007acc] bg-[#1e1e1e]'
                                        : 'text-gray-400 border-transparent hover:text-white hover:bg-[#2d2d30]'
                                        }`}
                                >
                                    Input
                                </button>
                                <button
                                    onClick={() => setActiveTab('output')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'output'
                                        ? 'text-white border-[#007acc] bg-[#1e1e1e]'
                                        : 'text-gray-400 border-transparent hover:text-white hover:bg-[#2d2d30]'
                                        }`}
                                >
                                    Output
                                </button>
                            </div>

                            {/* Input/Output Content */}
                            <div className="flex-1 p-4 min-h-0">
                                <style jsx global>{`
                                    .scrollbar-hide {
                                        -ms-overflow-style: none;
                                        scrollbar-width: none;
                                    }
                                    .scrollbar-hide::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}</style>
                                {activeTab === 'input' ? (
                                    <div className="space-y-3 h-full">
                                        <div className="h-full flex flex-col">
                                            <label className="block text-xs font-medium text-gray-400 mb-2">
                                                Program Input (stdin)
                                            </label>
                                            <textarea
                                                value={programInput}
                                                onChange={(e) => setProgramInput(e.target.value)}
                                                placeholder="Enter input for your program..."
                                                className="flex-1 bg-[#2d2d30] border border-[#3e3e42] text-white placeholder-gray-400 p-3 rounded text-sm font-mono resize-none scrollbar-hide"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 h-full">
                                        <div className="h-full flex flex-col">
                                            <label className="block text-xs font-medium text-gray-400 mb-2">
                                                Program Output
                                            </label>
                                            <div className="flex-1 bg-[#2d2d30] border border-[#3e3e42] text-white p-3 rounded text-sm font-mono overflow-y-auto whitespace-pre-wrap scrollbar-hide">
                                                {output || 'No output yet. Run your code to see results.'}
                                            </div>
                                            {executionStats && (
                                                <div className="text-xs text-gray-400 space-y-1 mt-2">
                                                    <div>Time: {executionStats.time}s</div>
                                                    <div>Memory: {executionStats.memory}KB</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
}
