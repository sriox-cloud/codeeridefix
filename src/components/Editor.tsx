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
