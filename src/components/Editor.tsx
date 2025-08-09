"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#0D1117] flex items-center justify-center">
            <div className="text-[#F0F6FC]">Loading editor...</div>
        </div>
    ),
});

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
}

export function Editor({ value, onChange, language }: EditorProps) {
    const getMonacoLanguage = (lang: string): string => {
        console.log('Editor received language:', lang); // Debug log

        // First check if it's a numeric ID (Judge0 API format)
        const numericId = parseInt(lang, 10);
        if (!isNaN(numericId)) {
            const idToLanguageMap: { [key: number]: string } = {
                // JavaScript & TypeScript
                63: "javascript",  // JavaScript (Node.js 12.14.0)
                74: "typescript",  // TypeScript (3.7.4)

                // Python
                71: "python",      // Python (3.8.1)
                70: "python",      // Python (2.7.17)

                // Java & JVM
                62: "java",        // Java (OpenJDK 13.0.1)
                78: "kotlin",      // Kotlin (1.3.70)
                81: "scala",       // Scala (2.13.2)

                // C/C++
                50: "c",           // C (GCC 9.2.0)
                54: "cpp",         // C++ (GCC 9.2.0)
                75: "c",           // C (Clang 7.0.1)
                76: "cpp",         // C++ (Clang 7.0.1)
                48: "c",           // C (GCC 7.4.0)
                49: "c",           // C (GCC 8.3.0)
                52: "cpp",         // C++ (GCC 7.4.0)
                53: "cpp",         // C++ (GCC 8.3.0)

                // .NET
                51: "csharp",      // C# (Mono 6.6.0.161)
                87: "fsharp",      // F# (.NET Core SDK 3.1.202)
                84: "vb",          // Visual Basic.Net

                // Other Languages
                60: "go",          // Go (1.13.5)
                73: "rust",        // Rust (1.40.0)
                68: "php",         // PHP (7.4.1)
                72: "ruby",        // Ruby (2.7.0)
                46: "shell",       // Bash (5.0.0)
                82: "sql",         // SQL (SQLite 3.27.2)
                80: "r",           // R (4.0.0)
                83: "swift",       // Swift (5.2.3)
                61: "haskell",     // Haskell (GHC 8.8.1)
                85: "perl",        // Perl (5.28.1)
                64: "lua",         // Lua (5.3.5)
                67: "pascal",      // Pascal (FPC 3.0.4)
                59: "fortran",     // Fortran (GFortran 9.2.0)
                45: "assembly",    // Assembly (NASM 2.14.02) - Use assembly instead of asm
                86: "clojure",     // Clojure (1.10.1)
                55: "scheme",      // Common Lisp (SBCL 2.0.0) - Use scheme for better support
                65: "ocaml",       // OCaml (4.09.0)
                56: "d",           // D (DMD 2.089.1)
                57: "elixir",      // Elixir (1.9.4)
                58: "erlang",      // Erlang (OTP 22.2)
                66: "matlab",      // Octave (5.1.0)
                88: "groovy",      // Groovy (3.0.3)
                77: "plaintext",   // COBOL (GnuCOBOL 2.2) - Monaco doesn't support COBOL, use plaintext
                43: "plaintext",   // Plain Text
                47: "vb",          // Basic (FBC 1.07.1) - Use VB syntax
            };

            const mappedLanguage = idToLanguageMap[numericId] || "plaintext";
            console.log(`Mapped language ID ${numericId} to:`, mappedLanguage); // Debug log
            return mappedLanguage;
        }

        // Fallback to old string-based mapping for backward compatibility
        const languageMap: { [key: string]: string } = {
            javascript: "javascript",
            python: "python",
            java: "java",
            cpp: "cpp",
            c: "c",
            csharp: "csharp",
            go: "go",
            rust: "rust",
            php: "php",
            ruby: "ruby",
            html: "html",
            css: "css",
            typescript: "typescript",
            json: "json",
            xml: "xml",
            sql: "sql",
        };
        return languageMap[lang] || "plaintext";
    };

    const editorOptions = {
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
            enabled: true,
            side: 'right' as const,
            size: 'proportional' as const,
            showSlider: 'mouseover' as const,
            renderCharacters: true,
            maxColumn: 120
        },
        fontSize: 14,
        lineHeight: 1.6,
        fontFamily: "'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        fontLigatures: true,
        scrollBeyondLastLine: false,
        wordWrap: "on" as const,
        lineNumbers: "on" as const,
        glyphMargin: true,
        folding: true,
        foldingStrategy: 'indentation' as const,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 4,
        renderLineHighlight: "line" as const,
        contextmenu: true,
        mouseWheelZoom: true,
        smoothScrolling: true,
        cursorBlinking: "blink" as const,
        cursorSmoothCaretAnimation: "on" as const,
        renderWhitespace: "boundary" as const,
        renderControlCharacters: true,
        bracketPairColorization: {
            enabled: true,
            independentColorPoolPerBracketType: true
        },
        guides: {
            bracketPairs: true,
            bracketPairsHorizontal: true,
            highlightActiveBracketPair: true,
            indentation: true,
            highlightActiveIndentation: true
        },
        suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showMethods: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showIssues: true,
            showUsers: true,
            showColors: true,
            showFiles: true,
        },
        quickSuggestions: {
            other: true,
            comments: false,
            strings: false
        },
        parameterHints: {
            enabled: true,
            cycle: true
        },
        autoIndent: 'advanced' as const,
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: true,
        trimAutoWhitespace: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on' as const,
        accessibilitySupport: 'auto' as const,
        autoClosingBrackets: 'always' as const,
        autoClosingQuotes: 'always' as const,
        autoSurround: 'languageDefined' as const,
        codeLens: true,
        colorDecorators: true,
        copyWithSyntaxHighlighting: true,
        dragAndDrop: true,
        find: {
            addExtraSpaceOnTop: true,
            autoFindInSelection: 'never' as const,
            seedSearchStringFromSelection: 'always' as const
        },
        hover: {
            enabled: true,
            delay: 300,
            sticky: true
        },
        lightbulb: {
            enabled: true as any
        },
        links: true,
        matchBrackets: 'always' as const,
        multiCursorModifier: 'ctrlCmd' as const,
        occurrencesHighlight: 'singleFile' as const,
        overviewRulerBorder: true,
        overviewRulerLanes: 3,
        padding: {
            top: 16,
            bottom: 16
        },
        peekWidgetDefaultFocus: 'editor' as const,
        quickSuggestionsDelay: 10,
        renderFinalNewline: 'on' as const,
        rulers: [80, 120],
        scrollbar: {
            vertical: 'auto' as const,
            horizontal: 'auto' as const,
            useShadows: true,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 18,
            horizontalScrollbarSize: 18,
            arrowSize: 11
        },
        selectionClipboard: true,
        selectionHighlight: true,
        showFoldingControls: 'mouseover' as const,
        showUnused: true,
        snippetSuggestions: 'top' as const,
        unfoldOnClickAfterEndOfLine: false,
        wordBasedSuggestions: 'matchingDocuments' as const,
        wordSeparators: '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?',
        wrappingIndent: 'indent' as const,
        wrappingStrategy: 'advanced' as const
    };

    return (
        <div className="w-full h-full bg-[#0D1117]">
            <MonacoEditor
                height="100%"
                language={getMonacoLanguage(language)}
                value={value}
                onChange={(val) => onChange(val || '')}
                options={editorOptions}
                theme="vs-dark"
            />
        </div>
    );
}
