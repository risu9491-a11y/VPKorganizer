"use client";

import React from 'react';
import { Archive, Search, Trash2, Settings, Sun, Moon, Sparkles, FolderSync } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/hooks/use-theme";

interface AppHeaderProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onOrganize: () => void;
  selectedFileCount: number;
}

export default function AppHeader({
  searchTerm,
  onSearchChange,
  onDelete,
  onOrganize,
  selectedFileCount,
}: AppHeaderProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Archive className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold">VPK Assembler</h1>
      </div>
      <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
        </form>
        <Button variant="outline" onClick={onOrganize}>
            <FolderSync className="mr-2 h-4 w-4" />
            Organize with AI
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={selectedFileCount === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete ({selectedFileCount})
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleThemeChange('light')}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange('dark-highlighted')}>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Highlighted Dark</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
