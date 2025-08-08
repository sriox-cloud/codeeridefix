"use client";

import Link from 'next/link';
import { GitHubLogoIcon, ArrowRightIcon, CodeIcon, FileTextIcon, ChatBubbleIcon, PlayIcon, UploadIcon, DownloadIcon } from '@radix-ui/react-icons';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
    const { status } = useSession();
    const [mounted, setMounted] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        setMounted(true);

        // Feature rotation
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 4);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const features = [
        { icon: CodeIcon, title: "Monaco Editor", desc: "VS Code experience" },
        { icon: PlayIcon, title: "Instant Run", desc: "Execute instantly" },
        { icon: ChatBubbleIcon, title: "AI Assistant", desc: "Code with AI" },
        { icon: GitHubLogoIcon, title: "GitHub Sync", desc: "Save & load" }
    ];

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-px h-px bg-gray-600 rounded-full"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Grid background */}
            <motion.div
                className="absolute inset-0 opacity-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                transition={{ duration: 2 }}
            >
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(90deg, #333 1px, transparent 1px),
            linear-gradient(180deg, #333 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px'
                }} />
            </motion.div>

            {/* Navigation */}
            <motion.nav
                className="relative z-10 flex items-center justify-between p-6"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex items-center space-x-3">
                    <motion.div
                        className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <CodeIcon className="w-4 h-4 text-gray-300" />
                    </motion.div>
                    <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: 'Gugi, sans-serif' }}>
                        Codeer
                    </span>
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        href="/login"
                        className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    >
                        <GitHubLogoIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Login</span>
                    </Link>
                </motion.div>
            </motion.nav>

            {/* Hero Section */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    {/* Main heading */}
                    <div className="space-y-6">
                        <motion.h1
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            Professional
                            <motion.span
                                className="block text-gray-400 mt-2"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                Online IDE
                            </motion.span>
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            Code, execute, and save with AI assistance. Multi-language support with GitHub integration.
                        </motion.p>
                    </div>

                    {/* Feature indicators */}
                    <motion.div
                        className="flex justify-center items-center space-x-6 py-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center space-y-2"
                                animate={{
                                    scale: activeFeature === index ? 1.1 : 0.9,
                                    opacity: activeFeature === index ? 1 : 0.6,
                                }}
                                transition={{ duration: 0.8 }}
                                whileHover={{ scale: 1.15 }}
                            >
                                <motion.div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-700 ${activeFeature === index
                                            ? 'bg-gray-700 border border-gray-600'
                                            : 'bg-gray-900 border border-gray-800'
                                        }`}
                                    animate={activeFeature === index ? { y: [0, -10, 0] } : {}}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <feature.icon className="w-5 h-5 text-gray-300" />
                                </motion.div>
                                <div className="text-center">
                                    <div className="text-xs font-medium text-gray-300">{feature.title}</div>
                                    <div className="text-xs text-gray-500">{feature.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 30px rgba(255, 255, 255, 0.2)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/ide"
                                className="group bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-3"
                            >
                                <span>Start Coding</span>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <ArrowRightIcon className="w-4 h-4" />
                                </motion.div>
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/login"
                                className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-3"
                            >
                                <GitHubLogoIcon className="w-4 h-4" />
                                <span>Connect GitHub</span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Status */}
                    <motion.div
                        className="pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        {status === "authenticated" ? (
                            <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-400 px-4 py-2 rounded-full text-sm">
                                <motion.div
                                    className="w-2 h-2 bg-green-500 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                GitHub connected - Auto-save enabled
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-500 px-4 py-2 rounded-full text-sm">
                                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                Guest mode - Code without saving
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
                className="relative z-10 px-6 py-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-2xl md:text-3xl font-bold text-center text-white mb-12"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        Current Features
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Monaco Editor",
                                desc: "VS Code editor experience with syntax highlighting and IntelliSense",
                                icon: <CodeIcon className="w-5 h-5" />
                            },
                            {
                                title: "10+ Languages",
                                desc: "Python, JavaScript, Java, C++, C, C#, Go, Rust, PHP, Ruby support",
                                icon: <FileTextIcon className="w-5 h-5" />
                            },
                            {
                                title: "AI Assistant",
                                desc: "Chat with AI about your code using OpenRouter models (GPT, Claude)",
                                icon: <ChatBubbleIcon className="w-5 h-5" />
                            },
                            {
                                title: "Instant Execution",
                                desc: "Run code immediately with Judge0 API and see output in real-time",
                                icon: <PlayIcon className="w-5 h-5" />
                            },
                            {
                                title: "GitHub Integration",
                                desc: "Save files to GitHub repos and load entire repositories instantly",
                                icon: <GitHubLogoIcon className="w-5 h-5" />
                            },
                            {
                                title: "File Management",
                                desc: "Upload, download, create new files with multi-file tab interface",
                                icon: <UploadIcon className="w-5 h-5" />
                            },
                            {
                                title: "Resizable Panels",
                                desc: "Drag-to-resize editor, AI chat, and input/output panels",
                                icon: <DownloadIcon className="w-5 h-5" />
                            },
                            {
                                title: "Multi-file Support",
                                desc: "Work with multiple files simultaneously with tab-based interface",
                                icon: <FileTextIcon className="w-5 h-5" />
                            },
                            {
                                title: "Program Input/Output",
                                desc: "Dedicated panels for stdin input and program output with statistics",
                                icon: <CodeIcon className="w-5 h-5" />
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300 hover:bg-gray-900/70"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{
                                    scale: 1.02,
                                    borderColor: "#4a5568",
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-start gap-3">
                                    <motion.div
                                        className="text-gray-400 mt-1"
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <motion.footer
                className="relative z-10 border-t border-gray-800 py-6 px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
            >
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-gray-500 text-sm">
                        Codeer IDE - Professional online development environment
                    </p>
                </div>
            </motion.footer>
        </div>
    );
}
