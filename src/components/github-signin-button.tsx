"use client";

import { signIn, useSession } from "next-auth/react";
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function GitHubSignInButton() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && !isRedirecting) {
            setIsRedirecting(true);
            // Add a small delay to ensure the session is properly established
            setTimeout(() => {
                router.push("/ide");
            }, 500);
        }
    }, [status, router, isRedirecting]);

    const handleSignIn = async () => {
        try {
            await signIn("github", { 
                callbackUrl: "/ide",
                redirect: true,
            });
        } catch (error) {
            console.error("GitHub sign-in error:", error);
            // You could add toast notification here for error feedback
        }
    };

    if (status === "loading") {
        return (
            <button
                disabled
                className="w-full md:w-full bg-gray-300 text-gray-500 px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 font-medium text-xs md:text-sm max-w-[280px] md:max-w-none mx-auto cursor-not-allowed"
            >
                <GitHubLogoIcon className="w-4 h-4" />
                Loading...
            </button>
        );
    }

    if (status === "authenticated") {
        return (
            <button
                disabled
                className="w-full md:w-full bg-green-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 font-medium text-xs md:text-sm max-w-[280px] md:max-w-none mx-auto"
            >
                <GitHubLogoIcon className="w-4 h-4" />
                Signed In
            </button>
        );
    }

    return (
        <button
            onClick={handleSignIn}
            className="w-full md:w-full bg-white hover:bg-gray-100 text-black px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md text-xs md:text-sm max-w-[280px] md:max-w-none mx-auto"
        >
            <GitHubLogoIcon className="w-4 h-4" />
            Continue with GitHub
        </button>
    );
}
