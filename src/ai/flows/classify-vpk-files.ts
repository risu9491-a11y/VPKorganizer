'use server';

/**
 * @fileOverview A VPK file classifier AI agent.
 *
 * - classifyVpkFile - A function that handles the VPK file classification process.
 * - ClassifyVpkFileInput - The input type for the classifyVpkFile function.
 * - ClassifyVpkFileOutput - The return type for the classifyVpkFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyVpkFileInputSchema = z.object({
  fileName: z.string().describe('The name of the .vpk file.'),
  fileDescription: z.string().optional().describe('A description of the .vpk file content, if available.'),
});
export type ClassifyVpkFileInput = z.infer<typeof ClassifyVpkFileInputSchema>;

const ClassifyVpkFileOutputSchema = z.object({
  category: z.string().describe('The AI-determined category of the .vpk file.'),
  labels: z.array(z.string()).describe('AI-determined labels for the .vpk file.'),
  confidence: z.number().describe('The AI confidence level (0-1) for the classification.'),
});
export type ClassifyVpkFileOutput = z.infer<typeof ClassifyVpkFileOutputSchema>;

export async function classifyVpkFile(input: ClassifyVpkFileInput): Promise<ClassifyVpkFileOutput> {
  return classifyVpkFileFlow(input);
}

const classifyVpkFilePrompt = ai.definePrompt({
  name: 'classifyVpkFilePrompt',
  input: {schema: ClassifyVpkFileInputSchema},
  output: {schema: ClassifyVpkFileOutputSchema},
  prompt: `You are an AI expert in classifying .vpk files, which are archives commonly used in video games.

  Analyze the file name and description (if available) to determine the most appropriate category and labels.
  Also, assign a confidence level (0-1) for the classification.

  File Name: {{{fileName}}}
  Description: {{{fileDescription}}}

  Category: // Provide the most relevant category for the .vpk file.
  Labels: // Provide comma separated labels relevant to the .vpk file.
  Confidence: // Assign a confidence level between 0 and 1.
  `,
});

const classifyVpkFileFlow = ai.defineFlow(
  {
    name: 'classifyVpkFileFlow',
    inputSchema: ClassifyVpkFileInputSchema,
    outputSchema: ClassifyVpkFileOutputSchema,
  },
  async input => {
    const {output} = await classifyVpkFilePrompt(input);
    return output!;
  }
);
