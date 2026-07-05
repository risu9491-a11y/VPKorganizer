"use client";

import React, { useMemo, useState, useEffect } from 'react';
import type { VpkFile } from '@/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import type { ChartConfig } from '@/components/ui/chart';

interface StorageDistributionChartProps {
  files: VpkFile[];
  onDriveFilter: (drive: string | null) => void;
}

const driveColors: { [key: string]: string } = {
  'C:': 'hsl(var(--chart-1))',
  'D:': 'hsl(var(--chart-2))',
  'E:': 'hsl(var(--chart-3))',
  'F:': 'hsl(var(--chart-4))',
  'G:': 'hsl(var(--chart-5))',
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function StorageDistributionChart({ files, onDriveFilter }: StorageDistributionChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { chartData, chartConfig } = useMemo(() => {
    const driveUsage = new Map<string, number>();
    files.forEach(file => {
      driveUsage.set(file.drive, (driveUsage.get(file.drive) || 0) + file.size);
    });

    const data = Array.from(driveUsage.entries()).map(([drive, size]) => ({
      name: drive,
      value: size,
      fill: driveColors[drive] || 'hsl(var(--muted-foreground))',
    }));

    const config: ChartConfig = {};
    data.forEach(item => {
        config[item.name] = {
            label: item.name,
            color: item.fill,
        }
    })

    return { chartData: data, chartConfig: config };
  }, [files]);

  if (!mounted) {
    return (
        <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">Loading analytics...</p>
        </div>
    );
  }

  if (chartData.length === 0) {
    return (
        <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">Not enough data to display chart.</p>
        </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent 
                formatter={(value) => formatBytes(value as number)}
                hideLabel 
            />
          }
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          strokeWidth={2}
          onClick={(data) => onDriveFilter(data.name)}
          style={{cursor: 'pointer'}}
        >
             {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
            ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
