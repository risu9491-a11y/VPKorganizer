'use server';

/**
 * @fileOverview An AI flow for organizing VPK files into a folder structure.
 *
 * - organizeVpkFiles - A function that proposes a folder structure for a given list of VPK files.
 * - OrganizeVpkFilesInput - The input type for the organizeVpkFiles function.
 * - OrganizeVpkFilesOutput - The return type for the organizeVpkFiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OrganizeVpkFilesInputSchema = z.object({
  fileNames: z.array(z.string()).describe('A list of .vpk file names to organize.'),
});
export type OrganizeVpkFilesInput = z.infer<typeof OrganizeVpkFilesInputSchema>;

const FolderStructureSchema = z.record(z.array(z.string()));
export type FolderStructure = z.infer<typeof FolderStructureSchema>;

const OrganizeVpkFilesOutputSchema = z.object({
  folderStructure: FolderStructureSchema.describe('A proposed folder structure, where keys are folder names and values are arrays of file names in that folder.'),
});
export type OrganizeVpkFilesOutput = z.infer<typeof OrganizeVpkFilesOutputSchema>;

export async function organizeVpkFiles(input: OrganizeVpkFilesInput): Promise<OrganizeVpkFilesOutput> {
  return organizeVpkFilesFlow(input);
}

const organizeVpkFilesPrompt = ai.definePrompt({
  name: 'organizeVpkFilesPrompt',
  input: {schema: OrganizeVpkFilesInputSchema},
  output: {schema: OrganizeVpkFilesOutputSchema},
  prompt: `You are an expert file organizer, specializing in structuring assets for video games, particularly .vpk files.

  Based on the following list of .vpk file names, propose a logical folder structure. Group related files into folders.
  For example, files related to models should go into a "models" folder, maps into a "maps" folder, etc.
  Some files might be ambiguous, use your best judgment to categorize them. Create a top-level folder structure. Do not create nested folders.

  File Names:
  {{#each fileNames}}
  - {{{this}}}
  {{/each}}

  Your response should be a JSON object where keys are the proposed folder names and values are arrays of the file names belonging to that folder.
  `,
});

const organizeVpkFilesFlow = ai.defineFlow(
  {
    name: 'organizeVpkFilesFlow',
    inputSchema: OrganizeVpkFilesInputSchema,
    outputSchema: OrganizeVpkFilesOutputSchema,
  },
  async input => {
    const {output} = await organizeVpkFilesPrompt(input);
    return output!;
  }
);
