"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/Editor";
import { LanguageSelector } from "@/components/LanguageSelector";
import { PlayIcon, DownloadIcon, FileIcon, ReloadIcon, ChevronDownIcon } from '@radix-ui/react-icons';
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

interface CodeEditorProps {
    session: Session | null;
}

export function CodeEditor({ session }: CodeEditorProps) {
    const [code, setCode] = useState('// Welcome to Codeer IDE\n// Start coding here!\nconsole.log("Hello World!");');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [executionStats, setExecutionStats] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string>('');
    const [currentFileName, setCurrentFileName] = useState('main.js');

    // AI Assistant states
    const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [openRouterApiKey, setOpenRouterApiKey] = useState('');

    // Input/Output states
    const [programInput, setProgramInput] = useState('');
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

    const stats = executionStats;

    // File operations functions
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setCode(content);

                // Determine language from file extension
                const extension = file.name.split('.').pop()?.toLowerCase();
                const langMap: { [key: string]: string } = {
                    'js': 'javascript',
                    'py': 'python',
                    'java': 'java',
                    'cpp': 'cpp',
                    'c': 'c',
                    'cs': 'csharp',
                    'go': 'go',
                    'rs': 'rust',
                    'php': 'php',
                    'rb': 'ruby',
                    'html': 'html',
                    'css': 'css',
                    'json': 'json',
                    'txt': 'plaintext'
                };

                if (extension && langMap[extension]) {
                    setLanguage(langMap[extension]);
                }

                setCurrentFileName(file.name);
            };
            reader.readAsText(file);
        }
    };

    const downloadFile = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const createNewFile = () => {
        setCode('// New file\n');
        setCurrentFileName('untitled.js');
        setLanguage('javascript');
        setOutput('');
        setExecutionStats(null);
    };

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
                    stdin: programInput, // Include program input
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

    // AI Assistant function
    const sendAiMessage = async () => {
        if (!aiInput.trim() || !openRouterApiKey) return;

        const userMessage = { role: 'user' as const, content: aiInput };
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
                    messages: [...aiMessages, userMessage],
                    apiKey: openRouterApiKey,
                    code: code,
                    language: language
                }),
            });

            const result = await response.json();
            if (result.response) {
                setAiMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
            }
        } catch (error) {
            console.error('AI Assistant error:', error);
            setAiMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const saveCode = async () => {
        if (!session) {
            setSaveStatus('Please login to save your code');
            setTimeout(() => setSaveStatus(''), 3000);
            return;
        }

        setIsSaving(true);
        setSaveStatus('Saving...');

        try {
            const response = await fetch('/api/save-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    language,
                    filename: currentFileName,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSaveStatus('✅ Saved to GitHub successfully!');
                setTimeout(() => setSaveStatus(''), 3000);
            } else {
                setSaveStatus('❌ Error: ' + (result.error || 'Failed to save'));
                setTimeout(() => setSaveStatus(''), 5000);
            }
        } catch (error) {
            setSaveStatus('❌ Error saving code: ' + error);
            setTimeout(() => setSaveStatus(''), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-update filename when language changes
    useEffect(() => {
        setCurrentFileName(`main.${getFileExtension(language)}`);
    }, [language]);

    // Auto-save functionality (optional)
    useEffect(() => {
        if (!session || !code.trim()) return;

        const autoSaveTimer = setTimeout(() => {
            // Auto-save after 30 seconds of inactivity
            if (code.length > 10) { // Only auto-save if there's substantial content
                saveCode();
            }
        }, 30000);

        return () => clearTimeout(autoSaveTimer);
    }, [code, session]);

    const getLanguageId = (lang: string): number => {
        const languageMap: { [key: string]: number } = {
            javascript: 63, // Node.js
            python: 71,     // Python 3
            java: 62,       // Java
            cpp: 54,        // C++
            c: 50,          // C
            csharp: 51,     // C#
            go: 60,         // Go
            rust: 73,       // Rust
            php: 68,        // PHP
            ruby: 72,       // Ruby
        };
        return languageMap[lang] || 63;
    };

    const getFileExtension = (lang: string): string => {
        const extensions: { [key: string]: string } = {
            javascript: 'js',
            python: 'py',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            csharp: 'cs',
            go: 'go',
            rust: 'rs',
            php: 'php',
            ruby: 'rb',
        };
        return extensions[lang] || 'txt';
    };

    return (
        <div className="h-screen bg-[#0D1117] text-white flex flex-col">
            {/* Top Toolbar - matches the image */}
            <div className="h-12 bg-[#21262D] border-b border-[#30363D] flex items-center justify-between px-4">
                {/* Left side - File menu and Language selector */}
                <div className="flex items-center space-x-4">
                    {/* File Menu */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#F0F6FC] hover:bg-[#30363D] h-8 px-3"
                        >
                            File
                            <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                    </div>

                    {/* Help Menu */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#F0F6FC] hover:bg-[#30363D] h-8 px-3"
                        >
                            Help
                            <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                    </div>

                    {/* Language Selector */}
                    <div className="w-48">
                        <LanguageSelector language={language} onLanguageChange={setLanguage} />
                    </div>

                    {/* Compiler Options */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#8B949E] hover:bg-[#30363D] h-8 px-3"
                    >
                        📁 Compiler options
                    </Button>

                    {/* Command line arguments */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#8B949E] hover:bg-[#30363D] h-8 px-3"
                    >
                        💻 Command line arguments
                    </Button>
                </div>

                {/* Right side - Run button and user */}
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={executeCode}
                        disabled={isRunning}
                        className="bg-[#238636] hover:bg-[#2ea043] text-white h-8 px-6 font-medium"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        {isRunning ? 'Running...' : 'Run Code'}
                    </Button>

                    {/* User Avatar/Login */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#30363D] rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-[#F0F6FC]" />
                        </div>
                        {session ? (
                            <span className="text-sm text-[#F0F6FC]">Welcome</span>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-[#0D1117] border-[#30363D] text-[#F0F6FC] hover:bg-[#21262D] h-8"
                            >
                                Sign in
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* File name bar */}
            <div className="h-10 bg-[#0D1117] border-b border-[#21262D] flex items-center px-4">
                <div className="flex items-center space-x-2">
                    <File className="w-4 h-4 text-[#8B949E]" />
                    <span className="text-[#F0F6FC] text-sm font-medium">{currentFileName}</span>

                    {/* File operations */}
                    <div className="ml-auto flex items-center space-x-2">
                        <input
                            type="file"
                            accept=".js,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.html,.css,.json,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <Button
                            onClick={() => document.getElementById('file-upload')?.click()}
                            variant="ghost"
                            size="sm"
                            className="text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC] h-7 px-2"
                        >
                            <Upload className="w-3 h-3 mr-1" />
                            Upload
                        </Button>

                        <Button
                            onClick={downloadFile}
                            variant="ghost"
                            size="sm"
                            className="text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC] h-7 px-2"
                        >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                        </Button>

                        <Button
                            onClick={createNewFile}
                            variant="ghost"
                            size="sm"
                            className="text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC] h-7 px-2"
                        >
                            <FolderPlus className="w-3 h-3 mr-1" />
                            New
                        </Button>

                        {session && (
                            <Button
                                onClick={saveCode}
                                disabled={isSaving}
                                variant="ghost"
                                size="sm"
                                className="text-[#238636] hover:bg-[#21262D] hover:text-[#2ea043] h-7 px-2"
                            >
                                <Save className="w-3 h-3 mr-1" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area - Split Layout */}
            <div className="flex-1 flex min-h-0">
                {/* Editor Section */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1">
                        <Editor
                            value={code}
                            onChange={setCode}
                            language={language}
                        />
                    </div>
                </div>

                {/* Right Panel - Input/Output */}
                <div className="w-96 bg-[#0D1117] border-l border-[#21262D] flex flex-col">
                    {/* AI Assistant Header */}
                    <div className="h-12 bg-[#0D1117] border-b border-[#21262D] flex items-center justify-between px-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-[#238636] rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">AI</span>
                            </div>
                            <span className="text-[#F0F6FC] text-sm font-medium">AI Assistant</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#8B949E] hover:bg-[#21262D] h-7 px-2"
                        >
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Inline Suggestions */}
                    <div className="h-12 bg-[#0D1117] border-b border-[#21262D] flex items-center px-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#21262D] rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-[#8B949E] rounded-full"></div>
                            </div>
                            <span className="text-[#8B949E] text-sm">Inline Suggestions</span>
                            <span className="text-[#8B949E] text-xs bg-[#21262D] px-2 py-1 rounded">gpt-4o-mini</span>
                        </div>
                    </div>

                    {/* Input/Output Tabs */}
                    <div className="flex-1 flex flex-col">
                        <div className="h-10 bg-[#0D1117] border-b border-[#21262D] flex">
                            <button className="flex-1 text-[#F0F6FC] text-sm font-medium bg-[#21262D] border-r border-[#30363D]">
                                Input
                            </button>
                            <button className="flex-1 text-[#8B949E] text-sm hover:text-[#F0F6FC] hover:bg-[#21262D]">
                                Output
                            </button>
                        </div>

                        {/* Input Section */}
                        <div className="flex-1 p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[#F0F6FC] text-sm font-medium">1</span>
                                    <span className="text-[#8B949E] text-xs">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#F0F6FC] text-sm font-medium">2</span>
                                    <span className="text-[#8B949E] text-xs">5</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#F0F6FC] text-sm font-medium">3</span>
                                    <span className="text-[#8B949E] text-xs">NO</span>
                                </div>
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="h-32 border-t border-[#21262D] bg-[#0D1117] p-4">
                            {isRunning ? (
                                <div className="flex items-center text-[#FFA657] text-sm">
                                    <div className="w-2 h-2 bg-[#FFA657] rounded-full animate-pulse mr-2"></div>
                                    Executing code...
                                </div>
                            ) : (
                                <pre className="text-sm text-[#F0F6FC] font-mono whitespace-pre-wrap break-words">
                                    {output || "Ready to run your code..."}
                                </pre>
                            )}

                            {/* Execution Stats */}
                            {stats && (
                                <div className="mt-3 pt-3 border-t border-[#21262D] space-y-2">
                                    <div className="text-xs text-[#8B949E]">Execution Stats:</div>
                                    {stats.time && (
                                        <div className="text-xs text-[#58A6FF]">Time: {stats.time}s</div>
                                    )}
                                    {stats.memory && (
                                        <div className="text-xs text-[#7C3AED]">Memory: {stats.memory} KB</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Message */}
            {saveStatus && (
                <div className="absolute top-16 right-4 bg-[#21262D] border border-[#30363D] rounded-md px-3 py-2 text-sm text-[#F0F6FC] shadow-lg">
                    {saveStatus}
                </div>
            )}

            {/* Bottom Status Bar */}
            <div className="h-6 bg-[#0D1117] border-t border-[#21262D] flex items-center justify-between px-4 text-xs">
                <div className="flex items-center space-x-4">
                    <span className="text-[#8B949E]">© 2024-2025 Judge0 6.0.0. - All Rights Reserved. • A Croatian ❤️ company</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-[#8B949E]">Accepted: 0.00%, 1856MB (TAT: 0318ms)</span>
                </div>
            </div>
        </div>
    );
}
