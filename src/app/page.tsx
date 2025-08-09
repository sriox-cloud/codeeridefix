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
                alt="Codeer - Free Online Compiler and Code Editor Logo"
                width={28}
                height={28}
                className="rounded object-contain"
                priority
                sizes="28px"
              />
            </div>
            <span className="text-lg font-bold uppercase" style={{ fontFamily: 'var(--font-gugi)' }}>CODEER</span>
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
                  alt="Codeer - Best Free Online Compiler and Code Editor Platform"
                  width={80}
                  height={80}
                  className="rounded-xl object-contain"
                  priority
                  sizes="80px"
                />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-2 relative uppercase" style={{ fontFamily: 'var(--font-gugi)' }}>
              CODEER
              {/* Decorative underline */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </h2>

            <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 text-sm relative">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Free Online Compiler
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
              Free Online.<span className="text-gray-400"> Compiler.</span><br />
              <span className="text-gray-400">Code Editor.</span>
              {/* Decorative accent lines */}
              <div className="absolute -top-4 left-0 w-8 h-px bg-gradient-to-r from-gray-500 to-transparent"></div>
              <div className="absolute -bottom-2 right-0 w-12 h-px bg-gradient-to-l from-gray-400 to-transparent"></div>
            </h1>

            <div className="text-gray-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto relative">
              Free online compiler and code editor supporting 50+ programming languages including Python, JavaScript, Java, C++, C, Go, Rust.
              Write, run, test and debug code instantly in your browser. Perfect for coding practice, algorithms, and programming education.
              Execute your code instantly with zero setup required.
              {/* Subtle decorative dots */}
              <div className="absolute -left-2 top-2 w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="absolute -right-2 bottom-2 w-1 h-1 bg-gray-500 rounded-full"></div>
            </div>

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
            <h2 className="text-3xl font-bold mb-4">Best Free Online Compiler & Code Editor</h2>
            <p className="text-gray-400">Complete online development environment for coding, compiling, and debugging</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: LightningBoltIcon, title: "Instant Code Execution", desc: "Compile and run code in under 2 seconds. No downloads or setup required." },
              { icon: CodeIcon, title: "50+ Programming Languages", desc: "Python, JavaScript, Java, C++, C, Go, Rust, PHP, Ruby, Swift, Kotlin and more" },
              { icon: GitHubLogoIcon, title: "GitHub Integration", desc: "Import, edit and save code directly from GitHub repositories" },
              { icon: RocketIcon, title: "Zero Setup Required", desc: "Start coding immediately in your browser. No installation needed." }
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
            <h2 className="text-3xl font-bold mb-4">Programming Languages Supported</h2>
            <p className="text-gray-400">Free online compiler supporting all major programming languages for coding practice and development</p>
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
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Trusted by Developers Worldwide</h2>
            <p className="text-gray-400">Join thousands of developers using our free online compiler</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "50+", label: "Programming Languages" },
              { value: "<2s", label: "Compile Time" },
              { value: "24/7", label: "Free Access" },
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

      {/* SEO Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Best Free Online Compiler for Programming</h2>

            <div className="prose prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-8 text-gray-300">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Why Use Codeer Online Compiler?</h3>
                  <p className="mb-4">
                    Codeer is the best free online compiler and code editor that supports over 50 programming languages.
                    Whether you're learning to code, practicing algorithms, or working on programming projects, our
                    online IDE provides everything you need without any downloads or installations.
                  </p>
                  <p className="mb-4">
                    Our free online compiler supports popular languages like Python, JavaScript, Java, C++, C, Go,
                    Rust, PHP, Ruby, Swift, Kotlin, TypeScript, and many more. Start coding instantly in your browser
                    with syntax highlighting, auto-completion, and real-time error detection.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Perfect for Coding Practice</h3>
                  <p className="mb-4">
                    Practice coding problems, solve algorithms, and prepare for programming interviews with our
                    online code editor. No setup required - just open your browser and start coding. Perfect for
                    students, beginners, and experienced developers alike.
                  </p>
                  <p className="mb-4">
                    Features include instant code execution, GitHub integration, code sharing, and support for
                    multiple programming paradigms. Our online development environment is optimized for speed
                    and reliability, ensuring your code runs smoothly every time.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-white">Popular Programming Searches</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <ul className="space-y-2 text-gray-400">
                      <li>• Online Python compiler</li>
                      <li>• Free JavaScript editor</li>
                      <li>• Java code runner online</li>
                      <li>• C++ online IDE</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-gray-400">
                      <li>• Online coding platform</li>
                      <li>• Free code editor</li>
                      <li>• Programming practice online</li>
                      <li>• Algorithm solver online</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-gray-400">
                      <li>• Code compiler online free</li>
                      <li>• Programming IDE browser</li>
                      <li>• Online development environment</li>
                      <li>• Code execution platform</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-8 bg-gray-950 border border-gray-800 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Coding?</h2>
            <p className="text-gray-400 mb-6">Join thousands of developers using our free online compiler platform</p>
            <Link href="/ide" className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-200 inline-flex items-center gap-2">
              <RocketIcon className="w-5 h-5" />
              Launch Free Compiler
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
                    alt="Codeer - Free Online Compiler Logo"
                    width={32}
                    height={32}
                    className="rounded object-contain"
                    sizes="32px"
                  />
                </div>
                <span className="text-xl font-bold uppercase" style={{ fontFamily: 'var(--font-gugi)' }}>CODEER</span>
              </div>
              <p className="text-gray-400 text-sm">
                Free online compiler and code editor for programming. Support for Python, JavaScript, Java, C++, and 50+ languages. Start coding instantly in your browser.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Free Online Tools</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Online Compiler</Link></li>
                <li><Link href="#" className="hover:text-white">Code Editor</Link></li>
                <li><Link href="#" className="hover:text-white">Programming Languages</Link></li>
                <li><Link href="#" className="hover:text-white">Code Runner</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Programming Help</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Coding Practice</Link></li>
                <li><Link href="#" className="hover:text-white">Algorithm Solutions</Link></li>
                <li><Link href="#" className="hover:text-white">Programming Tutorials</Link></li>
                <li><Link href="#" className="hover:text-white">Code Examples</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Popular Searches</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Python Compiler Online</Link></li>
                <li><Link href="#" className="hover:text-white">Java Code Editor</Link></li>
                <li><Link href="#" className="hover:text-white">C++ Online IDE</Link></li>
                <li><Link href="#" className="hover:text-white">JavaScript Runner</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center text-sm text-gray-400">
            <div>© 2025 CODEER. All rights reserved. Free online compiler and code editor for all programming languages.</div>
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
