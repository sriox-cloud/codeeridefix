"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider 
            // Longer refetch interval for better performance
            refetchInterval={30} // Check session every 30 seconds
            refetchOnWindowFocus={true}
            // Keep the session alive as long as the window is open
            refetchWhenOffline={false}
        >
            {children}
        </SessionProvider>
    );
}
