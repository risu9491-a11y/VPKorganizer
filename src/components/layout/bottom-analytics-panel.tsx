"use client";

import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, X } from 'lucide-react';
import type { VpkFile } from '@/types';
import StorageDistributionChart from '../vpk/storage-distribution-chart';
import DuplicateFilesList from '../vpk/duplicate-files-list';
import { Button } from '../ui/button';

interface BottomAnalyticsPanelProps {
  files: VpkFile[];
  onDriveFilter: (drive: string | null) => void;
  onDuplicateFilter: (name: string | null) => void;
  activeDriveFilter: string | null;
  activeDuplicateFilter: string | null;
  onResetFilters: () => void;
}

export default function BottomAnalyticsPanel({ 
    files, 
    onDriveFilter, 
    onDuplicateFilter,
    activeDriveFilter,
    activeDuplicateFilter,
    onResetFilters,
}: BottomAnalyticsPanelProps) {
    const [isOpen, setIsOpen] = React.useState(true);

    const activeFilter = activeDriveFilter || activeDuplicateFilter;
    const filterText = activeDriveFilter ? `Drive: ${activeDriveFilter}` : `Name: ${activeDuplicateFilter}`;


  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="shrink-0 border-t bg-card">
      <CollapsibleTrigger asChild>
        <button className="flex h-10 w-full items-center justify-between px-4">
          <span className="text-sm font-medium">Analytics & Duplicates</span>
          <ChevronsUpDown className="h-4 w-4" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t p-4">
          {activeFilter && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent p-2 text-sm text-accent-foreground">
              <span>Filtering by {filterText}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onResetFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <h3 className="mb-2 text-lg font-semibold">Storage Distribution</h3>
              <StorageDistributionChart files={files} onDriveFilter={onDriveFilter} />
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-2 text-lg font-semibold">Duplicate File Names</h3>
              <DuplicateFilesList files={files} onDuplicateFilter={onDuplicateFilter} />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
