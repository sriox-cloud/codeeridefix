"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";

export default function IDEPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [loadingTimeout, setLoadingTimeout] = useState(false);

    useEffect(() => {
        // Set a maximum loading time of 5 seconds
        const timeoutId = setTimeout(() => {
            setLoadingTimeout(true);
            setIsLoading(false);
        }, 5000);

        if (status !== "loading") {
            setIsLoading(false);
            clearTimeout(timeoutId);
        }

        return () => clearTimeout(timeoutId);
    }, [status]);

    // Force a session revalidation if loading times out
    useEffect(() => {
        if (loadingTimeout) {
            const revalidateTimer = setTimeout(() => {
                window.location.reload();
            }, 1000);

            return () => clearTimeout(revalidateTimer);
        }
    }, [loadingTimeout]);

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
        <div className="w-full h-screen bg-black">
            <CodeEditor session={session} />
        </div>
    );
}
