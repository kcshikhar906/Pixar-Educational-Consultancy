// src/ai/flows/pathway-planner.ts
'use server';

/**
 * @fileOverview A pathway planner AI agent that suggests countries and universities
 * based on a student's education level and desired field of study.
 *
 * - pathwayPlanner - A function that handles the pathway planning process.
 * - PathwayPlannerInput - The input type for the pathwayPlanner function.
 * - PathwayPlannerOutput - The return type for the pathwayPlanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PathwayPlannerInputSchema = z.object({
  educationLevel: z
    .string()
    .describe('The current education level of the student (e.g., high school, bachelor).'),
  fieldOfStudy: z.string().describe('The desired field of study (e.g., computer science, engineering).'),
});

export type PathwayPlannerInput = z.infer<typeof PathwayPlannerInputSchema>;

const PathwayPlannerOutputSchema = z.object({
  countrySuggestions: z
    .array(z.string())
    .describe('A list of suggested countries that align with the student profile.'),
  universitySuggestions: z
    .array(z.string())
    .describe('A list of suggested universities that match the student profile and field of study.'),
});

export type PathwayPlannerOutput = z.infer<typeof PathwayPlannerOutputSchema>;

export async function pathwayPlanner(input: PathwayPlannerInput): Promise<PathwayPlannerOutput> {
  return pathwayPlannerFlow(input);
}

const pathwayPlannerPrompt = ai.definePrompt({
  name: 'pathwayPlannerPrompt',
  input: {schema: PathwayPlannerInputSchema},
  output: {schema: PathwayPlannerOutputSchema},
  prompt: `You are an expert educational consultant. A student with the following profile is seeking
  suggestions for countries and universities. Provide a list of country suggestions and a list of
  university suggestions that align with their profile. Consider both the education level and field of study
  when making suggestions.

  Education Level: {{{educationLevel}}}
  Field of Study: {{{fieldOfStudy}}}
  `,
});

const pathwayPlannerFlow = ai.defineFlow(
  {
    name: 'pathwayPlannerFlow',
    inputSchema: PathwayPlannerInputSchema,
    outputSchema: PathwayPlannerOutputSchema,
  },
  async input => {
    const {output} = await pathwayPlannerPrompt(input);
    return output!;
  }
);
