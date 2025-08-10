"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider 
            refetchInterval={5} // Check session every 5 seconds
            refetchOnWindowFocus={true} // Refresh when window regains focus
        >
            {children}
        </SessionProvider>
    );
}
