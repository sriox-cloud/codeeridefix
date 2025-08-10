"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(requireAuth = false) {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") {
            setIsLoading(true);
            return;
        }

        setIsLoading(false);

        if (requireAuth && status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, requireAuth, router]);

    return {
        session,
        status,
        isLoading,
        isAuthenticated: status === "authenticated",
    };
}
