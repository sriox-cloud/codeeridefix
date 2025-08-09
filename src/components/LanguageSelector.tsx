"use client";

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from 'react';

interface LanguageSelectorProps {
    language: string;
    onLanguageChange: (language: string) => void;
}

// Helper function to convert language ID to string for compatibility
const getLanguageIdString = (id: number): string => id.toString();
const getLanguageIdNumber = (id: string): number => parseInt(id, 10);

const languages = [
    // Assembly
    { id: 45, name: 'Assembly (NASM 2.14.02)', extension: 'asm', category: 'System' },

    // Shell/Script
    { id: 46, name: 'Bash (5.0.0)', extension: 'sh', category: 'Shell' },

    // Basic
    { id: 47, name: 'Basic (FBC 1.07.1)', extension: 'bas', category: 'Basic' },

    // C Language variants
    { id: 75, name: 'C (Clang 7.0.1)', extension: 'c', category: 'C/C++' },
    { id: 48, name: 'C (GCC 7.4.0)', extension: 'c', category: 'C/C++' },
    { id: 49, name: 'C (GCC 8.3.0)', extension: 'c', category: 'C/C++' },
    { id: 50, name: 'C (GCC 9.2.0)', extension: 'c', category: 'C/C++' },

    // C++ Language variants
    { id: 76, name: 'C++ (Clang 7.0.1)', extension: 'cpp', category: 'C/C++' },
    { id: 52, name: 'C++ (GCC 7.4.0)', extension: 'cpp', category: 'C/C++' },
    { id: 53, name: 'C++ (GCC 8.3.0)', extension: 'cpp', category: 'C/C++' },
    { id: 54, name: 'C++ (GCC 9.2.0)', extension: 'cpp', category: 'C/C++' },

    // .NET Languages
    { id: 51, name: 'C# (Mono 6.6.0.161)', extension: 'cs', category: '.NET' },
    { id: 87, name: 'F# (.NET Core SDK 3.1.202)', extension: 'fs', category: '.NET' },
    { id: 84, name: 'Visual Basic.Net (vbnc 0.0.0.5943)', extension: 'vb', category: '.NET' },

    // Functional Languages
    { id: 86, name: 'Clojure (1.10.1)', extension: 'clj', category: 'Functional' },
    { id: 55, name: 'Common Lisp (SBCL 2.0.0)', extension: 'lisp', category: 'Functional' },
    { id: 61, name: 'Haskell (GHC 8.8.1)', extension: 'hs', category: 'Functional' },
    { id: 65, name: 'OCaml (4.09.0)', extension: 'ml', category: 'Functional' },
    { id: 81, name: 'Scala (2.13.2)', extension: 'scala', category: 'Functional' },

    // Systems Languages
    { id: 56, name: 'D (DMD 2.089.1)', extension: 'd', category: 'Systems' },
    { id: 60, name: 'Go (1.13.5)', extension: 'go', category: 'Systems' },
    { id: 73, name: 'Rust (1.40.0)', extension: 'rs', category: 'Systems' },
    { id: 83, name: 'Swift (5.2.3)', extension: 'swift', category: 'Systems' },

    // Web Languages
    { id: 63, name: 'JavaScript (Node.js 12.14.0)', extension: 'js', category: 'Web' },
    { id: 74, name: 'TypeScript (3.7.4)', extension: 'ts', category: 'Web' },
    { id: 68, name: 'PHP (7.4.1)', extension: 'php', category: 'Web' },

    // JVM Languages
    { id: 62, name: 'Java (OpenJDK 13.0.1)', extension: 'java', category: 'JVM' },
    { id: 78, name: 'Kotlin (1.3.70)', extension: 'kt', category: 'JVM' },
    { id: 88, name: 'Groovy (3.0.3)', extension: 'groovy', category: 'JVM' },

    // Scripting Languages
    { id: 70, name: 'Python (2.7.17)', extension: 'py', category: 'Scripting' },
    { id: 71, name: 'Python (3.8.1)', extension: 'py', category: 'Scripting' },
    { id: 72, name: 'Ruby (2.7.0)', extension: 'rb', category: 'Scripting' },
    { id: 64, name: 'Lua (5.3.5)', extension: 'lua', category: 'Scripting' },
    { id: 85, name: 'Perl (5.28.1)', extension: 'pl', category: 'Scripting' },

    // Functional/Dynamic
    { id: 57, name: 'Elixir (1.9.4)', extension: 'ex', category: 'Functional' },
    { id: 58, name: 'Erlang (OTP 22.2)', extension: 'erl', category: 'Functional' },

    // Scientific/Mathematical
    { id: 59, name: 'Fortran (GFortran 9.2.0)', extension: 'f90', category: 'Scientific' },
    { id: 66, name: 'Octave (5.1.0)', extension: 'm', category: 'Scientific' },
    { id: 80, name: 'R (4.0.0)', extension: 'r', category: 'Scientific' },

    // Legacy/Specialty
    { id: 77, name: 'COBOL (GnuCOBOL 2.2)', extension: 'cob', category: 'Legacy' },
    { id: 67, name: 'Pascal (FPC 3.0.4)', extension: 'pas', category: 'Legacy' },
    { id: 79, name: 'Objective-C (Clang 7.0.1)', extension: 'm', category: 'Legacy' },

    // Logic/Query
    { id: 69, name: 'Prolog (GNU Prolog 1.4.5)', extension: 'pl', category: 'Logic' },
    { id: 82, name: 'SQL (SQLite 3.27.2)', extension: 'sql', category: 'Query' },

    // Special
    { id: 43, name: 'Plain Text', extension: 'txt', category: 'Text' },
    { id: 44, name: 'Executable', extension: 'exe', category: 'Binary' },
    { id: 89, name: 'Multi-file program', extension: 'zip', category: 'Project' },
];

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
    const currentLanguage = languages.find(lang => getLanguageIdString(lang.id) === language);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Group languages by category for better organization
    const groupedLanguages = languages.reduce((acc, lang) => {
        if (!acc[lang.category]) {
            acc[lang.category] = [];
        }
        acc[lang.category].push(lang);
        return acc;
    }, {} as Record<string, typeof languages>);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            setCanScrollUp(scrollTop > 0);
            setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            // Initial check
            handleScroll();
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between bg-[#1e1e1e] border-[#3e3e42] text-white hover:bg-[#2d2d30] h-8 text-sm font-medium"
                >
                    {currentLanguage?.name || 'C++ (GCC 9.2.0)'}
                    <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-80 max-h-[40vh] min-h-[200px] overflow-hidden bg-[#2d2d30] border-[#3e3e42] relative"
                side="bottom"
                align="start"
                sideOffset={4}
                avoidCollisions={true}
                collisionPadding={20}
                sticky="always"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                {/* Scroll Up Indicator */}
                {canScrollUp && (
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#2d2d30] via-[#2d2d30]/90 to-transparent z-20 flex items-center justify-center border-b border-[#3e3e42]/30">
                        <ChevronDownIcon className="w-4 h-4 text-gray-300 rotate-180 animate-bounce" />
                        <span className="text-xs text-gray-300 ml-1">More above</span>
                    </div>
                )}

                {/* Scrollable Content */}
                <div
                    ref={scrollRef}
                    className="max-h-[calc(40vh-80px)] min-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                    style={{
                        paddingTop: canScrollUp ? '32px' : '8px',
                        paddingBottom: canScrollDown ? '32px' : '8px'
                    }}
                >
                    {Object.entries(groupedLanguages).map(([category, langs]) => (
                        <div key={category}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide sticky top-0 bg-[#2d2d30] z-10 border-b border-[#3e3e42]/50">
                                {category}
                            </div>
                            {langs.map((lang) => (
                                <DropdownMenuItem
                                    key={lang.id}
                                    onClick={() => onLanguageChange(getLanguageIdString(lang.id))}
                                    className="text-white hover:bg-[#3e3e42] cursor-pointer focus:bg-[#3e3e42] ml-2 transition-colors duration-150 min-h-12"
                                >
                                    <div className="flex flex-col w-full">
                                        <span className="text-sm">{lang.name}</span>
                                        <span className="text-xs text-gray-400">.{lang.extension}</span>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Scroll Down Indicator */}
                {canScrollDown && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#2d2d30] via-[#2d2d30]/90 to-transparent z-20 flex items-center justify-center border-t border-[#3e3e42]/30">
                        <ChevronDownIcon className="w-4 h-4 text-gray-300 animate-bounce" />
                        <span className="text-xs text-gray-300 ml-1">More below</span>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
