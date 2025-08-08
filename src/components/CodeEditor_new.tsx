"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/Editor";
import { LanguageSelector } from "@/components/LanguageSelector";
import { PlayIcon, DownloadIcon, FileIcon, ChevronDownIcon } from '@radix-ui/react-icons';
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
    const [code, setCode] = useState('#include <algorithm>\n#include <cstring>\n#include <iostream>\n#include <limits>\n#include <set>\n#include <utility>\n#include <vector>\n\nusing Vertex = std::uint16_t;\nusing Cost = std::uint16_t;\nusing Edge = std::pair< Vertex, Cost >;\nusing Graph = std::vector< std::vector< Edge > >;\nusing CostTable = std::vector< std::uint64_t >;\n\nconstexpr auto kInfiniteCost{ std::numeric_limits< CostTable::value_type >::max() };\n\nauto dijkstra( Vertex const start, Vertex const end, Graph const & graph, CostTable & costTable )\n{\n    std::fill( costTable.begin(), costTable.end(), kInfiniteCost );\n    costTable[ start ] = 0;\n\n    std::set< std::pair< CostTable::value_type, Vertex > > minHeap;\n    minHeap.emplace( 0, start );\n\n    while ( !minHeap.empty() )\n    {\n        auto const vertexCost{ minHeap.begin()->first };\n        auto const vertex { minHeap.begin()->second };\n\n        minHeap.erase( minHeap.begin() );\n\n        if ( vertex == end )\n            break;\n\n        for ( auto const & neighbourEdge : graph[ vertex ] )\n        {\n            auto const & neighbour{ neighbourEdge.first };\n            auto const & edgeCost { neighbourEdge.second };\n\n            if ( vertexCost + edgeCost < costTable[ neighbour ] )\n            {\n                costTable[ neighbour ] = vertexCost + edgeCost;\n                minHeap.emplace( costTable[ neighbour ], neighbour );\n            }\n        }\n    }\n}');
    const [language, setLanguage] = useState('cpp');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [executionStats, setExecutionStats] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string>('');
    const [currentFileName, setCurrentFileName] = useState('main.cpp');

    // AI Assistant states
    const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [openRouterApiKey, setOpenRouterApiKey] = useState('');

    // Input/Output states
    const [programInput, setProgramInput] = useState('12\n5\nNO');
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
        return languageMap[lang] || 54;
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
        <div className="h-screen bg-[#1e1e1e] text-white flex flex-col">
            {/* Top Toolbar */}
            <div className="h-12 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-4">
                {/* Left side - File menu and Language selector */}
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-[#3e3e42] h-8 px-3">
                        File <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-[#3e3e42] h-8 px-3">
                        Help <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                    <div className="w-48">
                        <LanguageSelector language={language} onLanguageChange={setLanguage} />
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-[#3e3e42] h-8 px-3">
                        📁 Compiler options
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-[#3e3e42] h-8 px-3">
                        💻 Command line arguments
                    </Button>
                </div>

                {/* Right side - Run button and user */}
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={executeCode}
                        disabled={isRunning}
                        className="bg-[#007acc] hover:bg-[#005a9e] text-white h-8 px-6 font-medium"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#3e3e42] rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <Button variant="outline" size="sm" className="bg-[#1e1e1e] border-[#3e3e42] text-white hover:bg-[#2d2d30] h-8">
                            Sign in with Puter
                        </Button>
                    </div>
                </div>
            </div>

            {/* File name bar */}
            <div className="h-10 bg-[#1e1e1e] border-b border-[#2d2d30] flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                    <File className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm font-medium">{currentFileName}</span>
                </div>
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
                    <Button onClick={createNewFile} variant="ghost" size="sm" className="text-gray-400 hover:bg-[#2d2d30] hover:text-white h-7 px-2">
                        <FolderPlus className="w-3 h-3 mr-1" />New
                    </Button>
                    {session && (
                        <Button onClick={saveCode} disabled={isSaving} variant="ghost" size="sm" className="text-[#007acc] hover:bg-[#2d2d30] h-7 px-2">
                            <Save className="w-3 h-3 mr-1" />{isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Three-Section Layout */}
            <div className="flex-1 flex min-h-0">
                {/* Code Editor Section */}
                <div className="flex-1 bg-[#1e1e1e] flex flex-col">
                    <Editor value={code} onChange={setCode} language={language} />
                </div>

                {/* AI Assistant Section */}
                <div className="w-96 bg-[#1e1e1e] border-l border-[#2d2d30] flex flex-col">
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
                                if (key) setOpenRouterApiKey(key);
                            }}
                        >
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* API Key Status */}
                    <div className="h-10 bg-[#1e1e1e] border-b border-[#2d2d30] flex items-center px-4">
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${openRouterApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs text-gray-400">
                                {openRouterApiKey ? 'API Key Connected' : 'Set OpenRouter API Key'}
                            </span>
                            <span className="text-xs bg-[#2d2d30] px-2 py-1 rounded text-gray-400">gpt-4o-mini</span>
                        </div>
                    </div>

                    {/* AI Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#1e1e1e]">
                        {aiMessages.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Ask me anything about your code!</p>
                                <p className="text-xs mt-1">I can help with debugging, optimization, and explanations.</p>
                            </div>
                        ) : (
                            aiMessages.map((message, index) => (
                                <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block max-w-[80%] p-3 rounded-lg text-sm ${message.role === 'user'
                                            ? 'bg-[#007acc] text-white'
                                            : 'bg-[#2d2d30] text-gray-200'
                                        }`}>
                                        {message.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {isAiLoading && (
                            <div className="text-left">
                                <div className="inline-block bg-[#2d2d30] text-gray-200 p-3 rounded-lg text-sm">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Input */}
                    <div className="border-t border-[#2d2d30] p-4 bg-[#1e1e1e]">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
                                placeholder={openRouterApiKey ? "Ask AI about your code..." : "Set API key first..."}
                                className="flex-1 bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#007acc]"
                                disabled={!openRouterApiKey}
                            />
                            <Button
                                onClick={sendAiMessage}
                                disabled={!aiInput.trim() || !openRouterApiKey || isAiLoading}
                                size="sm"
                                className="bg-[#007acc] hover:bg-[#005a9e] text-white px-3"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Input/Output Section */}
                <div className="w-96 bg-[#1e1e1e] border-l border-[#2d2d30] flex flex-col">
                    {/* Input/Output Tabs */}
                    <div className="h-12 bg-[#1e1e1e] border-b border-[#2d2d30] flex">
                        <button
                            onClick={() => setActiveTab('input')}
                            className={`flex-1 text-sm font-medium border-r border-[#2d2d30] ${activeTab === 'input'
                                    ? 'bg-[#2d2d30] text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-[#2d2d30]'
                                }`}
                        >
                            Input
                        </button>
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`flex-1 text-sm font-medium ${activeTab === 'output'
                                    ? 'bg-[#2d2d30] text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-[#2d2d30]'
                                }`}
                        >
                            Output
                        </button>
                    </div>

                    {/* Content Area */}
                    {activeTab === 'input' ? (
                        <div className="flex-1 p-4 bg-[#1e1e1e]">
                            <div className="space-y-2 mb-4">
                                <label className="text-sm text-gray-400">Program Input:</label>
                                <textarea
                                    value={programInput}
                                    onChange={(e) => setProgramInput(e.target.value)}
                                    placeholder="Enter input for your program here..."
                                    className="w-full h-32 bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#007acc] resize-none"
                                />
                            </div>

                            {/* Sample inputs display */}
                            <div className="space-y-2">
                                <div className="text-xs text-gray-500 mb-2">Sample Inputs:</div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white">1</span>
                                        <span className="text-gray-400 text-xs">12</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white">2</span>
                                        <span className="text-gray-400 text-xs">5</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white">3</span>
                                        <span className="text-gray-400 text-xs">NO</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 p-4 bg-[#1e1e1e]">
                            {isRunning ? (
                                <div className="flex items-center text-yellow-400 text-sm mb-4">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                                    Executing code...
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="text-xs text-gray-500 mb-2">Output:</div>
                                    <pre className="text-sm text-white font-mono whitespace-pre-wrap break-words bg-[#2d2d30] p-3 rounded border border-[#3e3e42] min-h-[8rem]">
                                        {output || "Ready to run your code..."}
                                    </pre>
                                </div>
                            )}

                            {/* Execution Stats */}
                            {stats && (
                                <div className="space-y-2 pt-4 border-t border-[#2d2d30]">
                                    <div className="text-xs text-gray-500">Execution Stats:</div>
                                    {stats.time && (
                                        <div className="text-xs text-blue-400">Time: {stats.time}s</div>
                                    )}
                                    {stats.memory && (
                                        <div className="text-xs text-purple-400">Memory: {stats.memory} KB</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Status Message */}
            {saveStatus && (
                <div className="absolute top-16 right-4 bg-[#2d2d30] border border-[#3e3e42] rounded-md px-3 py-2 text-sm text-white shadow-lg">
                    {saveStatus}
                </div>
            )}

            {/* Bottom Status Bar */}
            <div className="h-6 bg-[#007acc] flex items-center justify-between px-4 text-xs text-white">
                <div className="flex items-center space-x-4">
                    <span>© 2024-2025 Judge0 6.0.0 - All Rights Reserved • A Croatian ❤️ company</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span>Accepted: 0.00%, 1853MB (TAT: 631ms)</span>
                </div>
            </div>
        </div>
    );
}
