"use client";

import Link from 'next/link';
import { GitHubLogoIcon, ArrowRightIcon, CodeIcon, FileTextIcon, ChatBubbleIcon, PlayIcon, UploadIcon, DownloadIcon, StarIcon, LightningBoltIcon, RocketIcon, MagicWandIcon, CheckIcon } from '@radix-ui/react-icons';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
    const { status } = useSession();
    const [mounted, setMounted] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const featuresRef = useRef(null);
    const statsRef = useRef(null);
    const isInView = useInView(featuresRef, { once: true });
    const isStatsInView = useInView(statsRef, { once: true });
    const controls = useAnimation();
    const statsControls = useAnimation();

    useEffect(() => {
        setMounted(true);

        // Feature rotation
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 4);
        }, 4000);

        // Trigger animations when in view
        if (isInView) {
            controls.start("visible");
        }
        if (isStatsInView) {
            statsControls.start("visible");
        }

        return () => clearInterval(interval);
    }, [isInView, isStatsInView, controls, statsControls]);

    if (!mounted) return null;

    const features = [
        { icon: CodeIcon, title: "Monaco Editor", desc: "VS Code experience", color: "from-blue-500 to-purple-600" },
        { icon: PlayIcon, title: "Instant Run", desc: "Execute instantly", color: "from-green-500 to-emerald-600" },
        { icon: ChatBubbleIcon, title: "AI Assistant", desc: "Code with AI", color: "from-pink-500 to-rose-600" },
        { icon: GitHubLogoIcon, title: "GitHub Sync", desc: "Save & load", color: "from-orange-500 to-yellow-600" }
    ];

    const stats = [
        { label: "Programming Languages", value: "10+", icon: CodeIcon },
        { label: "AI Models", value: "5+", icon: MagicWandIcon },
        { label: "Instant Execution", value: "< 2s", icon: LightningBoltIcon },
        { label: "GitHub Integration", value: "100%", icon: GitHubLogoIcon }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 60, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    return (
        <div className="w-full min-h-screen bg-black relative overflow-hidden">
            {/* Animated mesh background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            "radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
                            "radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)",
                            "radial-gradient(circle at 40% 40%, rgba(119, 198, 255, 0.1) 0%, transparent 50%)"
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                />
            </div>

            {/* Floating orbs */}
            <div className="absolute inset-0">
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full blur-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${20 + Math.random() * 40}px`,
                            height: `${20 + Math.random() * 40}px`,
                            background: `linear-gradient(45deg, ${['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)]
                                }, transparent)`
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* Geometric patterns */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    </pattern>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <motion.path
                    d="M0,100 Q250,50 500,100 T1000,100 Q1250,150 1500,100 T2000,100"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                />
                <motion.path
                    d="M0,200 Q200,150 400,200 T800,200 Q1000,250 1200,200 T1600,200"
                    stroke="url(#lineGradient)"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 4, delay: 1, ease: "easeInOut" }}
                />
            </svg>

            {/* Navigation */}
            <motion.nav
                className="relative z-20 flex items-center justify-between p-6 backdrop-blur-sm bg-black/20 border-b border-white/10"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
                <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.05 }}
                >
                    <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25"
                        whileHover={{
                            rotate: 360,
                            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                        }}
                        transition={{ duration: 0.6 }}
                    >
                        <CodeIcon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Gugi, sans-serif' }}>
                            Codeer
                        </span>
                        <div className="text-xs text-gray-400 font-medium">Professional IDE</div>
                    </div>
                </motion.div>

                <div className="flex items-center space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/explore"
                            className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                        >
                            Explore
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/login"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-500/25"
                        >
                            <GitHubLogoIcon className="w-4 h-4" />
                            <span>Sign In</span>
                        </Link>
                    </motion.div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section
                className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-6xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.4)" }}
                    >
                        <StarIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">Next-Gen Development Environment</span>
                        <motion.div
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
                        variants={itemVariants}
                    >
                        Code Beyond
                        <motion.span
                            className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                            variants={itemVariants}
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            style={{ backgroundSize: "200% 200%" }}
                        >
                            Boundaries
                        </motion.span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 font-light"
                        variants={itemVariants}
                    >
                        Experience the future of coding with our AI-powered, cloud-native IDE.
                        <span className="text-blue-400 font-medium"> Build, test, and deploy</span> faster than ever before.
                    </motion.p>

                    {/* Feature Pills */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-4 mb-12"
                        variants={itemVariants}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className={`group relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-r ${feature.color}`}
                                animate={{
                                    scale: activeFeature === index ? 1.1 : 1,
                                    opacity: activeFeature === index ? 1 : 0.7,
                                }}
                                transition={{ duration: 0.8 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                            >
                                <div className="bg-black rounded-2xl p-4 group-hover:bg-gray-900/50 transition-colors duration-300">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                                            animate={activeFeature === index ? { rotate: [0, 360] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <feature.icon className="w-4 h-4 text-white" />
                                        </motion.div>
                                        <div className="text-left">
                                            <div className="text-sm font-semibold text-white">{feature.title}</div>
                                            <div className="text-xs text-gray-400">{feature.desc}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
                        variants={itemVariants}
                    >
                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/ide"
                                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-blue-500/25"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                <span className="relative z-10">Start Building</span>
                                <motion.div
                                    className="relative z-10"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <RocketIcon className="w-5 h-5" />
                                </motion.div>
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/login"
                                className="group border-2 border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 backdrop-blur-sm bg-white/5"
                            >
                                <GitHubLogoIcon className="w-5 h-5" />
                                <span>Connect GitHub</span>
                                <motion.div
                                    className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-110 transition-transform duration-300"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Status */}
                    <motion.div
                        className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3"
                        variants={itemVariants}
                    >
                        {status === "authenticated" ? (
                            <>
                                <motion.div
                                    className="w-3 h-3 bg-green-400 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-green-300 font-medium">GitHub Connected</span>
                                <CheckIcon className="w-4 h-4 text-green-400" />
                            </>
                        ) : (
                            <>
                                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                <span className="text-gray-400">Guest Mode</span>
                                <span className="text-xs text-gray-500">• Try without signing in</span>
                            </>
                        )}
                    </motion.div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <motion.section
                className="relative z-10 py-20 px-6"
                ref={statsRef}
                initial="hidden"
                animate={statsControls}
                variants={containerVariants}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center group"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -10 }}
                            >
                                <motion.div
                                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 border border-blue-500/20"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <stat.icon className="w-8 h-8 text-blue-400" />
                                </motion.div>
                                <motion.div
                                    className="text-3xl font-bold text-white mb-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                className="relative z-10 py-20 px-6"
                ref={featuresRef}
                initial="hidden"
                animate={controls}
                variants={containerVariants}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div className="text-center mb-16" variants={itemVariants}>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Everything You Need to
                            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Build Amazing Things
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Our comprehensive development environment brings together the best tools,
                            AI assistance, and cloud infrastructure in one seamless experience.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Monaco Editor",
                                desc: "Industry-standard VS Code editor with IntelliSense, syntax highlighting, and advanced code navigation",
                                icon: <CodeIcon className="w-6 h-6" />,
                                color: "from-blue-500 to-cyan-500",
                                features: ["IntelliSense", "Auto-completion", "Error detection", "Code formatting"]
                            },
                            {
                                title: "10+ Languages",
                                desc: "Full support for Python, JavaScript, Java, C++, Go, Rust, and more with optimized execution",
                                icon: <FileTextIcon className="w-6 h-6" />,
                                color: "from-emerald-500 to-teal-500",
                                features: ["Python", "JavaScript", "Java", "C++/C", "Go", "Rust"]
                            },
                            {
                                title: "AI Assistant",
                                desc: "Powered by GPT-4, Claude, and other leading models for intelligent code assistance",
                                icon: <ChatBubbleIcon className="w-6 h-6" />,
                                color: "from-pink-500 to-rose-500",
                                features: ["Code generation", "Debug help", "Optimization", "Documentation"]
                            },
                            {
                                title: "Instant Execution",
                                desc: "Run code immediately with Judge0 API integration and real-time output streaming",
                                icon: <PlayIcon className="w-6 h-6" />,
                                color: "from-violet-500 to-purple-500",
                                features: ["< 2s execution", "Real-time output", "Input/Output panels", "Error handling"]
                            },
                            {
                                title: "GitHub Integration",
                                desc: "Seamless repository management with OAuth authentication and automated workflows",
                                icon: <GitHubLogoIcon className="w-6 h-6" />,
                                color: "from-orange-500 to-red-500",
                                features: ["OAuth login", "Save to repos", "Load projects", "Branch management"]
                            },
                            {
                                title: "Modern Interface",
                                desc: "Resizable panels, multi-file tabs, and intuitive file management with drag-and-drop",
                                icon: <UploadIcon className="w-6 h-6" />,
                                color: "from-yellow-500 to-orange-500",
                                features: ["Resizable panels", "Multi-file tabs", "Drag & drop", "Dark theme"]
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="group relative p-8 rounded-3xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500"
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <motion.div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </motion.div>

                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    {feature.desc}
                                </p>

                                <div className="space-y-2">
                                    {feature.features.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="flex items-center gap-2 text-sm text-gray-500"
                                            whileHover={{ x: 5, color: "#60a5fa" }}
                                        >
                                            <CheckIcon className="w-4 h-4 text-green-400" />
                                            <span>{item}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="relative z-10 py-20 px-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/20"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                            animate={{
                                background: [
                                    "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                                    "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
                                    "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))"
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your
                                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Development Workflow?
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join thousands of developers who've already made the switch to our next-generation IDE.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/ide"
                                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                                    >
                                        <RocketIcon className="w-5 h-5" />
                                        <span>Start Coding Now</span>
                                    </Link>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/explore"
                                        className="inline-flex items-center gap-3 border-2 border-blue-500 text-blue-300 hover:bg-blue-500/10 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                                    >
                                        <StarIcon className="w-5 h-5" />
                                        <span>Explore Features</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <motion.div
                                className="flex items-center gap-3 mb-6"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <CodeIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Gugi, sans-serif' }}>
                                        Codeer
                                    </span>
                                    <div className="text-sm text-gray-400 font-medium">Professional IDE</div>
                                </div>
                            </motion.div>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                                The next-generation cloud-native IDE that empowers developers to build, test, and deploy faster than ever before.
                            </p>
                            <div className="flex gap-4 mt-6">
                                {[
                                    { icon: GitHubLogoIcon, href: "https://github.com", label: "GitHub" },
                                    { icon: StarIcon, href: "#", label: "Star us" },
                                    { icon: ChatBubbleIcon, href: "#", label: "Community" }
                                ].map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-300"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-4">Product</h3>
                            <ul className="space-y-3">
                                {[
                                    { label: "Features", href: "#features" },
                                    { label: "IDE", href: "/ide" },
                                    { label: "Pricing", href: "#pricing" },
                                    { label: "Updates", href: "#updates" }
                                ].map((link, index) => (
                                    <li key={index}>
                                        <motion.a
                                            href={link.href}
                                            className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                            whileHover={{ x: 5 }}
                                        >
                                            {link.label}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
                            <ul className="space-y-3">
                                {[
                                    { label: "Documentation", href: "#docs" },
                                    { label: "Help Center", href: "#help" },
                                    { label: "Community", href: "#community" },
                                    { label: "Contact", href: "#contact" }
                                ].map((link, index) => (
                                    <li key={index}>
                                        <motion.a
                                            href={link.href}
                                            className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                            whileHover={{ x: 5 }}
                                        >
                                            {link.label}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2025 Codeer. Built with ❤️ for developers worldwide.
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <motion.a href="#privacy" className="hover:text-blue-400 transition-colors duration-300" whileHover={{ y: -1 }}>
                                Privacy Policy
                            </motion.a>
                            <motion.a href="#terms" className="hover:text-blue-400 transition-colors duration-300" whileHover={{ y: -1 }}>
                                Terms of Service
                            </motion.a>
                            <motion.div
                                className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-3 py-1"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-300 font-medium">All systems operational</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}
