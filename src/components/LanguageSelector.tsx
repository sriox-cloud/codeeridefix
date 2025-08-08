"use client";

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSelectorProps {
    language: string;
    onLanguageChange: (language: string) => void;
}

const languages = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'java', name: 'Java', extension: 'java' },
    { id: 'cpp', name: 'C++', extension: 'cpp' },
    { id: 'c', name: 'C', extension: 'c' },
    { id: 'csharp', name: 'C#', extension: 'cs' },
    { id: 'go', name: 'Go', extension: 'go' },
    { id: 'rust', name: 'Rust', extension: 'rs' },
    { id: 'php', name: 'PHP', extension: 'php' },
    { id: 'ruby', name: 'Ruby', extension: 'rb' },
];

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
    const currentLanguage = languages.find(lang => lang.id === language);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between bg-[#1e1e1e] border-[#3e3e42] text-white hover:bg-[#2d2d30] h-8 text-sm font-medium"
                >
                    {currentLanguage?.name || 'C++'} (GCC 14.1.0)
                    <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-[#2d2d30] border-[#3e3e42]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.id}
                        onClick={() => onLanguageChange(lang.id)}
                        className="text-white hover:bg-[#3e3e42] cursor-pointer focus:bg-[#3e3e42]"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm">{lang.name}</span>
                            <span className="text-xs text-gray-400">Compiler: GCC 14.1.0</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
