
'use server';
/**
 * @fileOverview An AI agent to generate a document checklist for students planning to study abroad.
 *
 * - generateDocumentChecklist - A function that provides a personalized document checklist.
 * - DocumentChecklistInput - The input type for the generateDocumentChecklist function.
 * - DocumentChecklistOutput - The return type for the generateDocumentChecklist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentChecklistInputSchema = z.object({
  educationLevel: z
    .string()
    .describe('The student\'s current or most recent education level (e.g., High School, Bachelor\'s Degree).'),
  desiredCountry: z
    .string()
    .describe('The country where the student wishes to study (e.g., USA, Australia, Germany).'),
});
export type DocumentChecklistInput = z.infer<typeof DocumentChecklistInputSchema>;

const DocumentSchema = z.object({
  englishName: z.string().describe('The name of the document in English.'),
  nepaliName: z.string().describe('The name of the document in Nepali.'),
  description: z.string().describe('A brief description of the document and its purpose in English.'),
});

const DocumentChecklistOutputSchema = z.object({
  checklist: z.array(DocumentSchema).describe('A list of required documents for university application and student visa.'),
  notes: z.string().optional().describe('Any general notes or advice regarding the documentation process, including common pitfalls or important considerations for the specified country and education level. Include advice about language requirements (e.g. IELTS/TOEFL).'),
});
export type DocumentChecklistOutput = z.infer<typeof DocumentChecklistOutputSchema>;

export async function generateDocumentChecklist(
  input: DocumentChecklistInput
): Promise<DocumentChecklistOutput> {
  return documentChecklistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentChecklistPrompt',
  input: {schema: DocumentChecklistInputSchema},
  output: {schema: DocumentChecklistOutputSchema},
  prompt: `You are an expert educational consultant specializing in international student applications.
A student with a current education level of '{{{educationLevel}}}' is planning to study in '{{{desiredCountry}}}'.

Provide a comprehensive checklist of essential documents required for their university applications AND student visa process for '{{{desiredCountry}}}'.
For each document, provide:
1.  Its official or common name in English.
2.  Its common name or translation in Nepali.
3.  A brief description in English explaining what the document is or why it's needed.

Focus on documents typically required for students from Nepal applying to '{{{desiredCountry}}}' with '{{{educationLevel}}}'.
Include academic transcripts, language proficiency (like IELTS/TOEFL), financial proofs, statement of purpose, letters of recommendation, passport, visa application forms, photos, etc.
Be specific to '{{{desiredCountry}}}' if there are unique requirements (e.g., specific financial statement formats, health checks).

Additionally, provide some general notes or advice regarding the documentation process. This could include common mistakes to avoid, importance of certified translations if original documents are not in English (except for Nepali names you provide), and general tips for a smooth application. Specifically mention language proficiency test requirements (like IELTS/TOEFL) and any typical score ranges if known for {{{desiredCountry}}}.
Ensure the document names are a mix of English and Nepali as requested.
`,
});

const documentChecklistFlow = ai.defineFlow(
  {
    name: 'documentChecklistFlow',
    inputSchema: DocumentChecklistInputSchema,
    outputSchema: DocumentChecklistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error(`AI model did not return the expected output for ${prompt.name}. Output was null or undefined.`);
    }
    return output;
  }
);

