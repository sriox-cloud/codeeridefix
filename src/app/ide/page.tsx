"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";

export default function IDEPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status !== "loading") {
            setIsLoading(false);
        }
    }, [status]);

    if (isLoading) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-black">
            <CodeEditor session={session} />
        </div>
    );
}
