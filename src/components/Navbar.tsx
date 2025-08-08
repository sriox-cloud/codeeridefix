"use client";

import Link from 'next/link';
import { signOut } from "next-auth/react";
import { GitHubLogoIcon, PersonIcon, ExitIcon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";

interface NavbarProps {
    session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
    return (
        <nav className="h-10 bg-[#21262D] border-b border-[#30363D] flex items-center justify-between px-4">
            {/* Logo */}
            <div className="flex items-center space-x-4">
                <h1 className="text-[#F0F6FC] font-semibold text-sm">Codeer IDE</h1>
            </div>

            {/* User actions */}
            <div className="flex items-center space-x-3">
                {session ? (
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-[#7D8590] text-xs">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <PersonIcon className="w-3 h-3" />
                            <span>{session.user?.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut()}
                            className="text-[#7D8590] hover:text-[#F0F6FC] hover:bg-[#30363D] h-7 text-xs"
                        >
                            <ExitIcon className="w-3 h-3 mr-1" />
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    <Link href="/login">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#7D8590] hover:text-[#F0F6FC] hover:bg-[#30363D] h-7 text-xs"
                        >
                            <GitHubLogoIcon className="w-3 h-3 mr-1" />
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
