"use client";

import Link from 'next/link';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Login with GitHub button in top right corner */}
      <Link
        href="/login"
        className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-black px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-xs md:text-sm font-medium"
      >
        <GitHubLogoIcon className="w-3 md:w-4 h-3 md:h-4" />
        <span className="hidden sm:inline">Login with GitHub</span>
        <span className="sm:hidden">Login</span>
      </Link>

      {/* Main content area with IDE access */}
      <div className="flex flex-col items-center justify-center h-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold">
            Welcome to Codeer
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Your online IDE for coding and collaboration
          </p>
        </div>

        {/* Access IDE button */}
        <div className="space-y-4">
          <Link
            href="/ide"
            className="block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-center"
          >
            Start Coding
          </Link>

          {status === "authenticated" ? (
            <p className="text-gray-500 text-sm text-center">
              You're logged in - your code will be saved to GitHub
            </p>
          ) : (
            <p className="text-gray-500 text-sm text-center">
              Login to save your code to GitHub, or continue as guest
            </p>
          )}
        </div>
      </div>
    </div>
  );
}