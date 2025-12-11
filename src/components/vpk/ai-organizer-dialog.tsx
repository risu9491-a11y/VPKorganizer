'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Folder, File, AlertTriangle } from 'lucide-react';
import { organizeVpkFiles, type OrganizeVpkFilesOutput } from '@/ai/flows/organize-files-flow';
import type { VpkFile } from '@/types';

interface AiOrganizerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  files: VpkFile[];
}

export default function AiOrganizerDialog({ isOpen, onClose, files }: AiOrganizerDialogProps) {
  const [result, setResult] = useState<OrganizeVpkFilesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleOrganize();
    } else {
      // Reset state when dialog is closed
      setResult(null);
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);

  const handleOrganize = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fileNames = files.map(f => f.name);
      const response = await organizeVpkFiles({ fileNames });
      setResult(response);
    } catch (e) {
      setError('Failed to generate folder structure. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <div className="pl-4 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (result) {
      return (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {Object.entries(result.folderStructure).map(([folderName, files]) => (
              <div key={folderName}>
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{folderName}</h3>
                </div>
                <ul className="pl-7 mt-2 space-y-1">
                  {files.map(fileName => (
                    <li key={fileName} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <File className="h-4 w-4" />
                      <span>{fileName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI-Powered File Organization</DialogTitle>
          <DialogDescription>
            Based on your files, here is a proposed folder structure. No changes have been made yet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 min-h-[400px]">
          {renderContent()}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
