"use client";

import React, { useMemo } from 'react';
import type { VpkFile } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface DuplicateFilesListProps {
  files: VpkFile[];
  onDuplicateFilter: (name: string | null) => void;
}

interface DuplicateGroup {
    name: string;
    count: number;
    locations: string[];
}

export default function DuplicateFilesList({ files, onDuplicateFilter }: DuplicateFilesListProps) {
  const duplicates = useMemo(() => {
    const nameMap = new Map<string, VpkFile[]>();
    files.forEach(file => {
      if (!nameMap.has(file.name)) {
        nameMap.set(file.name, []);
      }
      nameMap.get(file.name)!.push(file);
    });

    const duplicateGroups: DuplicateGroup[] = [];
    nameMap.forEach((fileGroup, name) => {
      if (fileGroup.length > 1) {
        duplicateGroups.push({
            name,
            count: fileGroup.length,
            locations: fileGroup.map(f => f.drive)
        });
      }
    });

    return duplicateGroups;
  }, [files]);

  if (duplicates.length === 0) {
    return (
        <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">No duplicate file names found.</p>
        </div>
    )
  }

  return (
    <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-4">
            {duplicates.map((group, index) => (
                <React.Fragment key={group.name}>
                    <div 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
                        onClick={() => onDuplicateFilter(group.name)}
                    >
                        <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Found in: {Array.from(new Set(group.locations)).join(', ')}
                            </p>
                        </div>
                        <Badge variant="destructive">{group.count}</Badge>
                    </div>
                    {index < duplicates.length - 1 && <Separator className="my-2" />}
                </React.Fragment>
            ))}
        </div>
    </ScrollArea>
  );
}
