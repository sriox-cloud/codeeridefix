"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClockIcon, LaptopIcon, ReloadIcon } from '@radix-ui/react-icons';

interface OutputPanelProps {
    output: string;
    stats?: {
        time?: string;
        memory?: string;
        compile_output?: string;
        message?: string;
        status?: {
            description: string;
        };
    };
    isRunning: boolean;
}

export function OutputPanel({ output, stats, isRunning }: OutputPanelProps) {
    return (
        <div className="h-full bg-[#0D1117] flex flex-col">
            {/* Terminal Tab Bar */}
            <div className="h-8 bg-[#21262D] border-b border-[#30363D] flex items-center px-3">
                <div className="bg-[#0D1117] px-3 py-1 rounded-t border border-[#30363D] border-b-0 flex items-center space-x-2">
                    <span className="text-xs text-white">Terminal</span>
                    {isRunning && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex">
                {/* Output */}
                <div className="flex-1">
                    <ScrollArea className="h-full">
                        <div className="p-4 font-mono">
                            {isRunning ? (
                                <div className="flex items-center text-yellow-400 text-sm">
                                    <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                                    Executing code...
                                </div>
                            ) : (
                                <pre className="text-sm text-[#F0F6FC] whitespace-pre-wrap break-words">
                                    {output || "Ready to run your code..."}
                                </pre>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Stats Panel */}
                {stats && (
                    <div className="w-64 border-l border-[#30363D] bg-[#21262D]">
                        <div className="p-4 space-y-4">
                            <h4 className="text-sm font-semibold text-[#F0F6FC] border-b border-[#30363D] pb-2">
                                Execution Details
                            </h4>

                            {stats.status && (
                                <div className="space-y-1">
                                    <div className="text-xs text-[#7D8590] uppercase tracking-wider">Status</div>
                                    <div className="text-sm text-[#F0F6FC] bg-[#0D1117] px-2 py-1 rounded border border-[#30363D]">
                                        {stats.status.description}
                                    </div>
                                </div>
                            )}

                            {stats.time && (
                                <div className="space-y-1">
                                    <div className="flex items-center text-xs text-[#7D8590] uppercase tracking-wider">
                                        <ClockIcon className="w-3 h-3 mr-1" />
                                        Execution Time
                                    </div>
                                    <div className="text-sm text-[#58A6FF] bg-[#0D1117] px-2 py-1 rounded border border-[#30363D] font-mono">
                                        {stats.time}s
                                    </div>
                                </div>
                            )}

                            {stats.memory && (
                                <div className="space-y-1">
                                    <div className="flex items-center text-xs text-[#7D8590] uppercase tracking-wider">
                                        <LaptopIcon className="w-3 h-3 mr-1" />
                                        Memory Used
                                    </div>
                                    <div className="text-sm text-[#A5A5A5] bg-[#0D1117] px-2 py-1 rounded border border-[#30363D] font-mono">
                                        {stats.memory} KB
                                    </div>
                                </div>
                            )}

                            {stats.compile_output && (
                                <div className="space-y-1">
                                    <div className="text-xs text-[#7D8590] uppercase tracking-wider">Compile Output</div>
                                    <pre className="text-xs text-[#F79000] bg-[#0D1117] p-2 rounded border border-[#30363D] whitespace-pre-wrap font-mono">
                                        {stats.compile_output}
                                    </pre>
                                </div>
                            )}

                            {stats.message && (
                                <div className="space-y-1">
                                    <div className="text-xs text-[#7D8590] uppercase tracking-wider">Message</div>
                                    <div className="text-sm text-[#F85149] bg-[#0D1117] px-2 py-1 rounded border border-[#30363D]">
                                        {stats.message}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
