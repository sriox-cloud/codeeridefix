"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, CodeIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface FileManagerProps {
    session: Session;
    onFileSelect: (content: string, language: string) => void;
}

interface GitHubFile {
    name: string;
    content: string;
    language: string;
    path: string;
}

export function FileManager({ session, onFileSelect }: FileManagerProps) {
    const [files, setFiles] = useState<GitHubFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [showNewFileDialog, setShowNewFileDialog] = useState(false);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/github-files');
            if (response.ok) {
                const data = await response.json();
                setFiles(data.files || []);
            }
        } catch (error) {
            console.error('Error loading files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createNewFile = async () => {
        if (!newFileName.trim()) return;

        try {
            const extension = newFileName.split('.').pop() || 'txt';
            const language = getLanguageFromExtension(extension);

            const response = await fetch('/api/github-files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newFileName,
                    content: `// ${newFileName}\n// Created at ${new Date().toISOString()}\n\nconsole.log("Hello from ${newFileName}");`,
                    language,
                }),
            });

            if (response.ok) {
                setNewFileName('');
                setShowNewFileDialog(false);
                loadFiles();
            }
        } catch (error) {
            console.error('Error creating file:', error);
        }
    };

    const deleteFile = async (filePath: string) => {
        try {
            const response = await fetch('/api/github-files', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: filePath }),
            });

            if (response.ok) {
                loadFiles();
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const getLanguageFromExtension = (extension: string): string => {
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
            ts: 'typescript',
            json: 'json',
        };
        return extensionMap[extension] || 'javascript';
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        // You could add different icons based on file type
        return <FileIcon className="w-4 h-4" />;
    };

    if (isLoading) {
        return (
            <div className="p-4 text-center text-[#7D8590]">
                Loading files...
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[#0D1117]">
            {/* Header */}
            <div className="p-3 border-b border-[#30363D]">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-[#7D8590] uppercase tracking-wider">Files</h4>
                    <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-6 h-6 p-0 text-[#7D8590] hover:text-[#F0F6FC] hover:bg-[#30363D]"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#21262D] border-[#30363D]">
                            <DialogHeader>
                                <DialogTitle className="text-[#F0F6FC]">Create New File</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input
                                    placeholder="filename.js"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                    className="bg-[#0D1117] border-[#30363D] text-[#F0F6FC] placeholder:text-[#7D8590]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            createNewFile();
                                        }
                                    }}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={createNewFile}
                                        className="bg-[#238636] hover:bg-[#2EA043] text-white"
                                    >
                                        Create
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowNewFileDialog(false)}
                                        className="bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* File List */}
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {files.length === 0 ? (
                        <div className="text-center text-[#7D8590] text-sm py-8 px-4">
                            <div className="mb-2">📂</div>
                            <div>No files found</div>
                            <div className="text-xs mt-1">Create your first file!</div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded hover:bg-[#21262D] group transition-colors"
                                >
                                    <button
                                        onClick={() => onFileSelect(file.content, file.language)}
                                        className="flex items-center space-x-2 flex-1 text-left"
                                    >
                                        {getFileIcon(file.name)}
                                        <span className="text-sm text-[#F0F6FC] truncate font-mono">
                                            {file.name}
                                        </span>
                                    </button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteFile(file.path)}
                                        className="opacity-0 group-hover:opacity-100 w-6 h-6 p-0 text-[#F85149] hover:text-[#FF6B6B] hover:bg-[#DA3633]/20 transition-opacity"
                                    >
                                        <TrashIcon className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
