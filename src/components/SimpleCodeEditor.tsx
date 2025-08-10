"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Editor } from "@/components/Editor";
import { LanguageSelector } from "@/components/LanguageSelector";

interface SimpleCodeEditorProps {
    session: Session | null;
}

export default function SimpleCodeEditor({ session }: SimpleCodeEditorProps) {
    // Core state
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('71'); // Python by default
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    // Save code to localStorage
    const saveCode = () => {
        if (!session) {
            alert('Please sign in to save your code');
            return;
        }

        try {
            const userEmail = session?.user?.email || 'anonymous';
            const savedFiles = JSON.parse(localStorage.getItem(`code-${userEmail}`) || '[]');
            const newFile = {
                content: code,
                language,
                timestamp: new Date().toISOString()
            };
            savedFiles.push(newFile);
            localStorage.setItem(`code-${userEmail}`, JSON.stringify(savedFiles));
            alert('Code saved successfully!');
        } catch (error) {
            alert('Error saving code');
            console.error('Save error:', error);
        }
    };

    // Load code from localStorage
    const loadCode = () => {
        if (!session) {
            alert('Please sign in to load your code');
            return;
        }

        try {
            const userEmail = session?.user?.email || 'anonymous';
            const savedFiles = JSON.parse(localStorage.getItem(`code-${userEmail}`) || '[]');
            if (savedFiles.length === 0) {
                alert('No saved code found');
                return;
            }

            // Load the most recent code
            const lastFile = savedFiles[savedFiles.length - 1];
            setCode(lastFile.content);
            setLanguage(lastFile.language);
        } catch (error) {
            alert('Error loading code');
            console.error('Load error:', error);
        }
    };

    // Execute code
    const runCode = async () => {
        setIsRunning(true);
        setOutput('Running...');

        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: parseInt(language),
                }),
            });

            const result = await response.json();
            setOutput(result.output || result.error || 'No output');
        } catch (error) {
            setOutput('Error executing code: ' + error);
        } finally {
            setIsRunning(false);
        }
    };

    // Handle sign out
    const handleSignOut = async () => {
        const userEmail = session?.user?.email || 'anonymous';
        const savedFiles = JSON.parse(localStorage.getItem(`code-${userEmail}`) || '[]');
        if (code && code.trim() !== '') {
            const shouldSave = confirm('Do you want to save your code before signing out?');
            if (shouldSave) {
                await saveCode();
            }
        }
        await signOut({ callbackUrl: '/' });
    };

    return (
        <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
            {/* Header */}
            <div className="h-12 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <span className="font-bold">CODEER</span>
                    <div className="w-48">
                        <LanguageSelector language={language} onLanguageChange={setLanguage} />
                    </div>
                </div>
                {session && (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-300">Signed in as {session.user?.name}</span>
                        <button
                            onClick={handleSignOut}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>

            {/* Main content */}
            <div className="flex-1 flex">
                {/* Editor */}
                <div className="flex-1 flex flex-col">
                    <Editor value={code} onChange={setCode} language={language} />
                </div>

                {/* Right panel */}
                <div className="w-80 border-l border-[#3e3e42] flex flex-col">
                    {/* Controls */}
                    <div className="p-4 space-y-3 border-b border-[#3e3e42]">
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                        {session && (
                            <div className="flex gap-2">
                                <button
                                    onClick={saveCode}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={loadCode}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                    Load
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Output */}
                    <div className="flex-1 p-4 overflow-auto">
                        <h3 className="text-sm font-medium mb-2">Output:</h3>
                        <pre className="font-mono text-sm whitespace-pre-wrap bg-[#2d2d30] p-4 rounded min-h-[200px]">
                            {output || 'No output yet. Run your code to see results.'}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
