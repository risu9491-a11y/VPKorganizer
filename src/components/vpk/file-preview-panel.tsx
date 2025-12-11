"use client";

import React from 'react';
import type { VpkFile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import AiClassifier from './ai-classifier';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { FileQuestion } from 'lucide-react';

interface FilePreviewPanelProps {
  file: VpkFile | null;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function FilePreviewPanel({ file }: FilePreviewPanelProps) {
    const modelPlaceholder = PlaceHolderImages.find(p => p.id === '3d-model-placeholder');
    const hasModel = file?.name.includes("models");

  if (!file) {
    return (
      <aside className="hidden w-96 shrink-0 border-l bg-card p-4 lg:block">
        <div className="flex h-full flex-col items-center justify-center text-center">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No File Selected</h3>
            <p className="mt-1 text-sm text-muted-foreground">Select a file from the list to see its details.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-96 shrink-0 border-l bg-card lg:block">
      <Card className="h-full border-0 shadow-none rounded-none">
        <CardHeader>
          <CardTitle className="truncate">{file.name}</CardTitle>
          <CardDescription className="truncate">{file.path}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="model" disabled={!hasModel}>3D Model</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Drive</span>
                  <span>{file.drive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Added</span>
                  <span>{format(file.dateAdded, 'PPpp')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Used</span>
                  <span>{format(file.lastUsed, 'PPpp')}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai">
              <AiClassifier file={file} />
            </TabsContent>
            <TabsContent value="model">
              {modelPlaceholder && (
                <div className="mt-4 rounded-lg border bg-muted p-4">
                    <p className="text-sm text-muted-foreground mb-4">A .vmdl_c file was detected. Preview below.</p>
                    <Image
                        src={modelPlaceholder.imageUrl}
                        alt={modelPlaceholder.description}
                        width={600}
                        height={400}
                        className="rounded-md object-cover"
                        data-ai-hint={modelPlaceholder.imageHint}
                    />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </aside>
  );
}
