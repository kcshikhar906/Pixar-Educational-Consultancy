// src/ai/flows/english-test-advisor.ts
'use server';

/**
 * @fileOverview An AI agent to advise students on English proficiency tests.
 *
 * - englishTestAdvisor - A function that provides personalized test recommendations.
 * - EnglishTestAdvisorInput - The input type for the englishTestAdvisor function.
 * - EnglishTestAdvisorOutput - The return type for the englishTestAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnglishTestAdvisorInputSchema = z.object({
  currentLevel: z
    .string()
    .describe(
      'Your current English proficiency level (e.g., beginner, intermediate, advanced).'
    ),
  timeline: z
    .string()
    .describe(
      'Your timeline for taking the test (e.g., 1 month, 3 months, 6 months).'
    ),
  budget: z
    .string()
    .describe('Your budget for the test (e.g., $100, $200, $300).'),
  purpose: z
    .string()
    .describe(
      'What do you need the test for? (e.g. university application, immigration)'
    ),
});
export type EnglishTestAdvisorInput = z.infer<typeof EnglishTestAdvisorInputSchema>;

const EnglishTestAdvisorOutputSchema = z.object({
  testRecommendation: z
    .string()
    .describe(
      'A personalized recommendation for an English proficiency test based on the input provided.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the recommendation, considering the level, timeline, and budget.'
    ),
});
export type EnglishTestAdvisorOutput = z.infer<typeof EnglishTestAdvisorOutputSchema>;

export async function englishTestAdvisor(
  input: EnglishTestAdvisorInput
): Promise<EnglishTestAdvisorOutput> {
  return englishTestAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'englishTestAdvisorPrompt',
  input: {schema: EnglishTestAdvisorInputSchema},
  output: {schema: EnglishTestAdvisorOutputSchema},
  prompt: `You are an expert advisor on English proficiency tests. Based on the student's current level, timeline, and budget, recommend the most suitable test (IELTS, PTE, TOEFL, Duolingo, etc.) and provide a reasoning for the recommendation.

Student Level: {{{currentLevel}}}
Timeline: {{{timeline}}}
Budget: {{{budget}}}
Purpose: {{{purpose}}}

Consider the following factors when making your recommendation:
* Test acceptance by universities and institutions for their intended purpose.
* Test format and difficulty level.
* Test availability and cost.
* Student's preferred test format.

Recommendation:`,
});

const englishTestAdvisorFlow = ai.defineFlow(
  {
    name: 'englishTestAdvisorFlow',
    inputSchema: EnglishTestAdvisorInputSchema,
    outputSchema: EnglishTestAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
