"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SimpleCodeEditor from "@/components/SimpleCodeEditor";ient";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import { FileManager } from "@/components/FileManager";

export default function IDEPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status !== "loading") {
            setIsLoading(false);
        }
    }, [status, router]);

    if (isLoading) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    <div className="text-white text-lg">Loading editor...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-black flex flex-col">
            {/* Header with user info and sign out */}
            <div className="bg-gray-900 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {session?.user?.image && (
                        <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-8 h-8 rounded-full"
                        />
                    )}
                    <span className="text-white">{session?.user?.name}</span>
                </div>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Sign Out
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <div className="container mx-auto p-4 flex-1">
                    {/* File manager */}
                    <FileManager
                        currentContent={code}
                        currentLanguage={language}
                        onLoadFile={(content, lang) => {
                            setCode(content);
                            setLanguage(lang);
                        }}
                    />

                    {/* Code editor */}
                    <div className="mt-4 flex-1">
                        <CodeEditor
                            session={session}
                            onCodeChange={setCode}
                            onLanguageChange={setLanguage}
                            initialCode={code}
                            initialLanguage={language}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
