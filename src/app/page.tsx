"use client";

import Link from 'next/link';
import Image from 'next/image';
import { GitHubLogoIcon, CodeIcon, PlayIcon, LightningBoltIcon, RocketIcon, CheckIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState(0);

  const languages = ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust'];
  const codes = [
    'print("Hello, World!")',
    'console.log("Hello, World!");',
    'System.out.println("Hello, World!");',
    'cout << "Hello, World!" << endl;',
    'fmt.Println("Hello, World!")',
    'println!("Hello, World!");'
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentLang(prev => (prev + 1) % languages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 relative">
              <Image
                src="/odeer3.png"
                alt="Codeer Logo"
                width={28}
                height={28}
                className="rounded object-contain"
              />
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-gugi)' }}>Codeer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#features" className="text-gray-400 hover:text-white text-sm">Features</Link>
            <Link href="#languages" className="text-gray-400 hover:text-white text-sm">Languages</Link>
            <Link href="/login" className="bg-white text-black px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top decorative lines */}
          <div className="absolute top-10 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <div className="absolute top-16 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>

          {/* Corner decorative boxes */}
          <div className="absolute top-8 left-8 w-3 h-3 border border-gray-600 rotate-45"></div>
          <div className="absolute top-12 right-12 w-4 h-4 border border-gray-500 rounded"></div>
          <div className="absolute top-20 left-16 w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="absolute top-6 right-20 w-2 h-2 bg-gray-500 rounded-full"></div>

          {/* Side decorative elements */}
          <div className="absolute top-32 left-4 w-px h-16 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
          <div className="absolute top-40 right-6 w-px h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent"></div>

          {/* Large decorative circles */}
          <div className="absolute top-16 left-1/6 w-48 h-48 border border-gray-800/30 rounded-full"></div>
          <div className="absolute top-24 right-1/6 w-32 h-32 border border-gray-700/20 rounded-full"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          {/* Centered Logo and Brand */}
          <div className="flex flex-col items-center mb-8 relative">
            {/* Decorative elements around logo */}
            <div className="absolute -top-4 -left-4 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-1 h-1 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-2 -left-6 w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

            {/* Logo with decorative frame */}
            <div className="relative mb-4">
              <div className="absolute -inset-2 border border-gray-700/30 rounded-xl"></div>
              <div className="w-20 h-20 relative">
                <Image
                  src="/odeer3.png"
                  alt="Codeer Logo"
                  width={80}
                  height={80}
                  className="rounded-xl object-contain"
                />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-2 relative" style={{ fontFamily: 'var(--font-gugi)' }}>
              Codeer
              {/* Decorative underline */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </h2>

            <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 text-sm relative">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Online Compiler Platform
              {/* Decorative corner accents */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-gray-600 rounded-tl"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-gray-600 rounded-br"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto relative">
            {/* Decorative side elements */}
            <div className="absolute -left-8 top-8 w-1 h-24 bg-gradient-to-b from-gray-600 to-transparent hidden lg:block"></div>
            <div className="absolute -right-8 top-12 w-1 h-16 bg-gradient-to-b from-gray-500 to-transparent hidden lg:block"></div>
            <div className="absolute -left-4 top-20 w-2 h-2 border border-gray-600 rotate-45 hidden lg:block"></div>
            <div className="absolute -right-4 top-24 w-2 h-2 bg-gray-500 rounded-full hidden lg:block"></div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight relative">
              Code.<span className="text-gray-400"> Compile.</span><br />
              <span className="text-gray-400">Execute.</span>
              {/* Decorative accent lines */}
              <div className="absolute -top-4 left-0 w-8 h-px bg-gradient-to-r from-gray-500 to-transparent"></div>
              <div className="absolute -bottom-2 right-0 w-12 h-px bg-gradient-to-l from-gray-400 to-transparent"></div>
            </h1>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto relative">
              Fast, reliable online compiler supporting 10+ programming languages.
              Execute your code instantly with zero setup required.
              {/* Subtle decorative dots */}
              <div className="absolute -left-2 top-2 w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="absolute -right-2 bottom-2 w-1 h-1 bg-gray-500 rounded-full"></div>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/ide" className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 inline-flex items-center justify-center gap-2">
                <PlayIcon className="w-5 h-5" />
                Start Coding
              </Link>
              <Link href="/login" className="border border-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-900 inline-flex items-center justify-center gap-2">
                <GitHubLogoIcon className="w-5 h-5" />
                Sign In with GitHub
              </Link>
            </div>

            {/* Code Demo */}
            <div className="relative">
              {/* Decorative elements around code demo */}
              <div className="absolute -top-6 -left-6 w-12 h-12 border border-gray-700/30 rounded-full"></div>
              <div className="absolute -top-4 -right-8 w-3 h-3 border border-gray-600 rotate-45"></div>
              <div className="absolute -bottom-6 -left-8 w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="absolute -bottom-4 -right-6 w-8 h-8 border border-gray-700/20 rounded"></div>

              {/* Connecting lines */}
              <div className="absolute -top-2 left-1/4 w-16 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <div className="absolute -bottom-2 right-1/4 w-20 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>

              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden max-w-3xl mx-auto relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-gray-600 rounded-tl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-gray-600 rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-gray-600 rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-gray-600 rounded-br"></div>

                <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-400">main.{languages[currentLang].toLowerCase()}</span>
                  </div>
                  <motion.div
                    key={currentLang}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-white font-medium"
                  >
                    {languages[currentLang]}
                  </motion.div>
                </div>
                <div className="p-6">
                  <motion.code
                    key={currentLang}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white font-mono block mb-4 text-left"
                  >
                    {codes[currentLang]}
                  </motion.code>
                  <div className="border-t border-gray-800 pt-4 text-left">
                    <div className="text-gray-500 text-xs mb-1">Output:</div>
                    <div className="text-white font-mono text-sm">Hello, World!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Features */}
      <section id="features" className="py-12 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Why Choose Codeer?</h2>
            <p className="text-gray-400">Everything you need for efficient coding</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: LightningBoltIcon, title: "Fast Execution", desc: "Run code in under 2 seconds" },
              { icon: CodeIcon, title: "10+ Languages", desc: "Python, JS, Java, C++, Go & more" },
              { icon: GitHubLogoIcon, title: "GitHub Sync", desc: "Save and load from repositories" },
              { icon: RocketIcon, title: "Zero Setup", desc: "Start coding immediately" }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-black border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section id="languages" className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Supported Languages</h2>
            <p className="text-gray-400">Write and execute code in your favorite language</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust', 'C#', 'Ruby', 'PHP', 'Swift'].map((lang, index) => (
              <div key={index} className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-center hover:bg-gray-900 transition-colors">
                <div className="font-medium text-sm">{lang}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "10+", label: "Languages" },
              { value: "<2s", label: "Execution Time" },
              { value: "100%", label: "Uptime" },
              { value: "0", label: "Setup Required" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-8 bg-gray-950 border border-gray-800 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Coding?</h2>
            <p className="text-gray-400 mb-6">Join thousands of developers using our platform</p>
            <Link href="/ide" className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-200 inline-flex items-center gap-2">
              <RocketIcon className="w-5 h-5" />
              Launch Compiler
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/odeer3.png"
                    alt="Codeer Logo"
                    width={32}
                    height={32}
                    className="rounded object-contain"
                  />
                </div>
                <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-gugi)' }}>Codeer</span>
              </div>
              <p className="text-gray-400 text-sm">
                Fast, reliable online compiler for modern developers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Compiler</Link></li>
                <li><Link href="#" className="hover:text-white">Languages</Link></li>
                <li><Link href="#" className="hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-3">
                <Link href="#" className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center hover:bg-gray-800">
                  <GitHubLogoIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center text-sm text-gray-400">
            <div>© 2025 Codeer. All rights reserved.</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
