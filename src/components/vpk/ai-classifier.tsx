"use client";

import { useState } from 'react';
import { classifyVpkFile, type ClassifyVpkFileOutput } from '@/ai/flows/classify-vpk-files';
import { Button } from '@/components/ui/button';
import { VpkFile } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function AiClassifier({ file }: { file: VpkFile }) {
  const [result, setResult] = useState<ClassifyVpkFileOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClassification = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await classifyVpkFile({ fileName: file.name });
      setResult(response);
    } catch (e) {
      setError('Failed to classify file. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Use AI to automatically categorize and label this file based on its name.
      </p>
      <Button onClick={handleClassification} disabled={loading}>
        <Wand2 className="mr-2 h-4 w-4" />
        {loading ? 'Analyzing...' : 'Classify File'}
      </Button>

      {loading && (
        <Card>
            <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-4 w-[100px]" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                    <Skeleton className="h-6 w-[100px] rounded-full" />
                </div>
                <Skeleton className="h-4 w-[150px]" />
            </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
              <p className="font-semibold">{result.category}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {result.labels.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Confidence</h4>
              <p className="font-semibold">{Math.round(result.confidence * 100)}%</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
