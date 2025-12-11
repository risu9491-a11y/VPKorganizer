"use client";

import React from 'react';
import type { VpkFile } from '@/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ArrowUpDown, DatabaseZap } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { SortConfig } from '@/app/page';

interface VpkFilesTableProps {
  files: VpkFile[];
  selectedIds: Set<string>;
  onSelectionChange: (id: string) => void;
  onSelectAll: (isChecked: boolean) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof VpkFile) => void;
  onRowClick: (id: string) => void;
}

const driveColors: { [key: string]: string } = {
  'C:': 'bg-red-500',
  'D:': 'bg-blue-500',
  'E:': 'bg-green-500',
  'F:': 'bg-yellow-500',
  'G:': 'bg-purple-500',
};


const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const TableSortButton: React.FC<{
  columnKey: keyof VpkFile;
  onSort: (key: keyof VpkFile) => void;
  sortConfig: SortConfig;
  children: React.ReactNode;
  className?: string;
}> = ({ columnKey, onSort, sortConfig, children, className }) => (
  <Button
    variant="ghost"
    onClick={() => onSort(columnKey)}
    className={className}
  >
    {children}
    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig?.key !== columnKey ? 'text-muted-foreground' : ''}`} />
  </Button>
);

export default function VpkFilesTable({
  files,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  sortConfig,
  onSort,
  onRowClick
}: VpkFilesTableProps) {
  const allSelected = files.length > 0 && selectedIds.size === files.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < files.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={allSelected || (someSelected ? 'indeterminate' : false)}
              onCheckedChange={(checked) => onSelectAll(!!checked)}
            />
          </TableHead>
          <TableHead className="w-[40%]">
             <TableSortButton columnKey="name" onSort={onSort} sortConfig={sortConfig}>Name</TableSortButton>
          </TableHead>
          <TableHead>
            <TableSortButton columnKey="drive" onSort={onSort} sortConfig={sortConfig}>Drive</TableSortButton>
          </TableHead>
          <TableHead className="text-right">
            <TableSortButton columnKey="size" onSort={onSort} sortConfig={sortConfig} className="-mr-4">Size</TableSortButton>
          </TableHead>
          <TableHead className="text-right">
             <TableSortButton columnKey="lastUsed" onSort={onSort} sortConfig={sortConfig} className="-mr-4">Last Used</TableSortButton>
          </TableHead>
          <TableHead className="text-right">
             <TableSortButton columnKey="dateAdded" onSort={onSort} sortConfig={sortConfig} className="-mr-4">Date Added</TableSortButton>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow 
            key={file.id} 
            data-state={selectedIds.has(file.id) ? 'selected' : ''}
            className="cursor-pointer"
            >
            <TableCell onClick={(e) => { e.stopPropagation(); onSelectionChange(file.id); }}>
              <Checkbox checked={selectedIds.has(file.id)} />
            </TableCell>
            <TableCell className="font-medium" onClick={() => onRowClick(file.id)}>
              <div className="flex items-center gap-2">
                <DatabaseZap className="h-4 w-4 text-muted-foreground" />
                {file.name}
              </div>
            </TableCell>
            <TableCell onClick={() => onRowClick(file.id)}>
                <Badge variant="secondary" className="flex items-center gap-2 w-12 justify-center">
                    <span className={`h-2 w-2 rounded-full ${driveColors[file.drive] || 'bg-gray-500'}`}></span>
                    {file.drive}
                </Badge>
            </TableCell>
            <TableCell className="text-right" onClick={() => onRowClick(file.id)}>{formatBytes(file.size)}</TableCell>
            <TableCell className="text-right" onClick={() => onRowClick(file.id)}>{format(file.lastUsed, 'PP')}</TableCell>
            <TableCell className="text-right" onClick={() => onRowClick(file.id)}>{format(file.dateAdded, 'PP')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
