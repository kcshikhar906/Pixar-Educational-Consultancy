
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
    .describe('Your budget for the test in Nepali Rupees (NPR) (e.g., "< NPR 15000", "NPR 15000 - NPR 30000").'),
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
      'A concise and professional recommendation for an English proficiency test (e.g., IELTS Academic, TOEFL iBT, PTE Academic, Duolingo English Test).'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the recommendation, in a mix of English and simple Nepali. It should explain why the test is suitable based on level, timeline, budget (provided in NPR), and purpose. Also, subtly mention that Pixar Educational Consultancy offers excellent preparation classes and that personalized advice is available if they contact an advisor.'
    ),
  badges: z.array(z.string()).optional().describe("Short, descriptive badges highlighting key features of the recommended test based on the input criteria, e.g., 'Low Budget', 'Quick Results', 'Widely Accepted', 'Good for USA'. Limit to 2-3 relevant badges.")
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
  prompt: `You are an expert advisor at Pixar Educational Consultancy, specializing in English proficiency tests for Nepali students.
Based on the student's current level, timeline, budget (provided in Nepali Rupees - NPR), and purpose, provide:
1. A concise and professional 'testRecommendation' for the most suitable English proficiency test (e.g., IELTS Academic, TOEFL iBT, PTE Academic, Duolingo English Test).
2. A 'reasoning' for your recommendation.
3. A list of 2-3 relevant 'badges' highlighting key advantages of the recommended test in relation to the student's input (e.g., "Low Budget", "Quick Results", "Widely Accepted", "Suits University Application", "Good for Immigration to USA").

Student Level: {{{currentLevel}}}
Timeline: {{{timeline}}}
Budget (NPR): {{{budget}}}
Purpose: {{{purpose}}}

For the 'reasoning' field:
1.  Explain your recommendation in a mix of English and simple Nepali. For example, you can state a point in English and then clarify or elaborate in Nepali (e.g., "This test is widely accepted (यो परीक्षा धेरै ठाउँमा मान्य छ)").
2.  Consider factors like test acceptance for their purpose, format, difficulty, availability, and cost (interpret the provided NPR budget appropriately against typical test costs which are often in USD).
3.  Subtly weave in that Pixar Educational Consultancy offers excellent preparation classes for these English tests and that students can get more personalized advice by contacting an advisor. For example: "For dedicated preparation (राम्रो तयारीको लागि), Pixar Educational Consultancy provides excellent classes. For more detailed guidance (थप जानकारीको लागि), you can contact one of our advisors."
4.  Keep the overall tone helpful, professional, and encouraging.

Example badges:
- If budget is low (e.g., "< NPR 15000") and timeline is short: ["Affordable", "Fast Results"]
- If purpose is university application for USA: ["Widely Accepted in USA", "Academic Focus"]

Provide only the testRecommendation, reasoning, and badges.
`,
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

    