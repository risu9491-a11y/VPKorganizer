"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { VpkFile } from '@/types';
import { generateMockVpkFiles } from '@/lib/data';
import AppHeader from '@/components/layout/app-header';
import VpkFilesTable from '@/components/vpk/vpk-files-table';
import FilePreviewPanel from '@/components/vpk/file-preview-panel';
import BottomAnalyticsPanel from '@/components/layout/bottom-analytics-panel';
import AiOrganizerDialog from '@/components/vpk/ai-organizer-dialog';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type SortConfig = {
  key: keyof VpkFile;
  direction: 'ascending' | 'descending';
} | null;

export default function VPKAssemblerPage() {
  const [files, setFiles] = useState<VpkFile[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [driveFilter, setDriveFilter] = useState<string | null>(null);
  const [duplicateFilter, setDuplicateFilter] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call to discover files.
    setFiles(generateMockVpkFiles(50));
  }, []);

  const handleSelectionChange = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        setLastSelectedId(id);
      }
      if(newSet.size === 0) {
        setLastSelectedId(null);
      } else if (!newSet.has(lastSelectedId || '')) {
         setLastSelectedId(Array.from(newSet)[newSet.size-1]);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds(new Set(files.map(f => f.id)));
      setLastSelectedId(files[files.length-1]?.id || null);
    } else {
      setSelectedIds(new Set());
      setLastSelectedId(null);
    }
  };

  const handleDelete = () => {
    setFiles(prev => prev.filter(f => !selectedIds.has(f.id)));
    setSelectedIds(new Set());
    setLastSelectedId(null);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Files Deleted",
      description: `${selectedIds.size} files have been removed.`,
    });
  };
  
  const handleSort = (key: keyof VpkFile) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const filteredAndSortedFiles = useMemo(() => {
    let sortableFiles = [...files];

    if (searchTerm) {
      sortableFiles = sortableFiles.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (driveFilter) {
      sortableFiles = sortableFiles.filter(file => file.drive === driveFilter);
    }

    if (duplicateFilter) {
        sortableFiles = sortableFiles.filter(file => file.name === duplicateFilter);
    }

    if (sortConfig !== null) {
      sortableFiles.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableFiles;
  }, [files, searchTerm, sortConfig, driveFilter, duplicateFilter]);
  
  const selectedFile = useMemo(() => {
    if (!lastSelectedId) return null;
    return files.find(f => f.id === lastSelectedId) || null;
  }, [files, lastSelectedId]);

  const resetFilters = useCallback(() => {
    setDriveFilter(null);
    setDuplicateFilter(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onOrganize={() => setIsOrganizerOpen(true)}
        selectedFileCount={selectedIds.size}
      />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <VpkFilesTable
            files={filteredAndSortedFiles}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={(id) => setLastSelectedId(id)}
          />
        </div>
        <FilePreviewPanel file={selectedFile} />
      </main>
      <BottomAnalyticsPanel 
        files={files}
        onDriveFilter={setDriveFilter}
        onDuplicateFilter={setDuplicateFilter}
        activeDriveFilter={driveFilter}
        activeDuplicateFilter={duplicateFilter}
        onResetFilters={resetFilters}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedIds.size} file(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AiOrganizerDialog
        isOpen={isOrganizerOpen}
        onClose={() => setIsOrganizerOpen(false)}
        files={files}
      />
    </div>
  );
}
