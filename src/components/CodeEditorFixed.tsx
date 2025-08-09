"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
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
    Bot
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
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [programInput, setProgramInput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [executionStats, setExecutionStats] = useState<any>(null);

    // UI State
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');
    const [isAiEnabled, setIsAiEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [targetRepo, setTargetRepo] = useState('codeer_data');

    // AI Assistant State
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');

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

    // Language mapping for Judge0
    const getLanguageId = (lang: string): number => {
        const languageMap: { [key: string]: number } = {
            javascript: 63,
            python: 71,
            java: 62,
            cpp: 54,
            c: 50,
            csharp: 51,
            go: 60,
            rust: 73,
            php: 68,
            ruby: 72,
            html: 63,
            css: 63,
        };
        return languageMap[lang] || 71;
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
            js: 'javascript',
            py: 'python',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            cs: 'csharp',
            go: 'go',
            rs: 'rust',
            php: 'php',
            rb: 'ruby',
            html: 'html',
            css: 'css',
        };
        return extensionMap[extension || ''] || 'python';
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
                {/* Left side - Branding, File menu and Language selector */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-white font-bold text-lg uppercase" style={{ fontFamily: 'var(--font-gugi)' }}>CODEER</span>
                    </div>
                    <div className="relative">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-[#3e3e42] h-8 px-3">
                            File <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                    </div>
                    <div className="w-48">
                        <LanguageSelector language={language} onLanguageChange={setLanguage} />
                    </div>
                </div>

                {/* Right side - Run button, AI toggle, and user info */}
                <div className="flex items-center space-x-3">
                    <Button
                        onClick={executeCode}
                        disabled={isRunning}
                        className="bg-[#28a745] hover:bg-[#218838] text-white h-7 px-4 text-sm font-medium"
                    >
                        <Play className="w-3 h-3 mr-1" />
                        {isRunning ? 'Running...' : 'Run'}
                    </Button>
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
                        <span className="text-white text-sm">Welcome, {session.user?.name || 'User'}</span>
                    ) : (
                        <span className="text-white text-sm">Guest Mode</span>
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
                        accept=".js,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.html,.css,.json,.txt"
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
                                    <div className="h-12 bg-[#1e1e1e] border-b border-[#2d2d30] flex items-center justify-between px-4">
                                        <div className="flex items-center space-x-2">
                                            <Bot className="w-5 h-5 text-[#007acc]" />
                                            <span className="text-white text-sm font-medium">AI Assistant</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 hover:bg-[#2d2d30] h-7 px-2"
                                            onClick={() => {
                                                const key = prompt('Enter your OpenRouter API Key:');
                                                if (key) setApiKey(key);
                                            }}
                                        >
                                            <Settings className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    {/* AI Chat Area */}
                                    <div className="flex-1 flex flex-col p-4">
                                        <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                                            {aiMessages.length === 0 && (
                                                <div className="text-center text-gray-400 text-sm">
                                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                    <p>Ask AI about your code...</p>
                                                </div>
                                            )}
                                            {aiMessages.map((message, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-3 rounded-lg text-sm ${message.role === 'user'
                                                        ? 'bg-[#007acc] text-white ml-8'
                                                        : 'bg-[#2d2d30] text-gray-300 mr-8'
                                                        }`}
                                                >
                                                    <div className="whitespace-pre-wrap">{message.content}</div>
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
                                    </div>
                                </div>
                            </Panel>
                        </>
                    )}

                    {/* Input/Output Panel */}
                    <PanelResizeHandle className="w-2 bg-[#2d2d30] hover:bg-[#3e3e42] cursor-col-resize border-l border-r border-[#3e3e42]" />
                    <Panel defaultSize={25} minSize={20}>
                        <div className="h-full bg-[#1e1e1e] flex flex-col">
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
                            <div className="flex-1 p-4">
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
                                                className="flex-1 bg-[#2d2d30] border border-[#3e3e42] text-white placeholder-gray-400 p-3 rounded text-sm font-mono resize-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 h-full">
                                        <div className="h-full flex flex-col">
                                            <label className="block text-xs font-medium text-gray-400 mb-2">
                                                Program Output
                                            </label>
                                            <div className="flex-1 bg-[#2d2d30] border border-[#3e3e42] text-white p-3 rounded text-sm font-mono overflow-y-auto whitespace-pre-wrap">
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
