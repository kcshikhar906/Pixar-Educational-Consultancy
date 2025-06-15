
// src/ai/flows/sop-generator-flow.ts
'use server';
/**
 * @fileOverview An AI agent to generate a Statement of Purpose (SOP) for students.
 *
 * - generateSop - A function that provides a personalized SOP.
 * - SopGeneratorInput - The input type for the generateSop function.
 * - SopGeneratorOutput - The return type for the generateSop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SopGeneratorInputSchema, SopGeneratorOutputSchema } from '@/ai/schemas/sop-schemas';

export type SopGeneratorInput = z.infer<typeof SopGeneratorInputSchema>;
export type SopGeneratorOutput = z.infer<typeof SopGeneratorOutputSchema>;

export async function generateSop(
  input: SopGeneratorInput
): Promise<SopGeneratorOutput> {
  return sopGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sopGeneratorPrompt',
  input: {schema: SopGeneratorInputSchema},
  output: {schema: SopGeneratorOutputSchema},
  prompt: `You are an expert AI assistant specializing in crafting compelling Statements of Purpose (SOPs) for students applying to universities abroad. Your goal is to generate a personalized, well-structured, and coherent SOP based on the information provided by the student, {{fullName}}.

Student's Profile:
- Target Country: {{targetCountry}}
- Target Education Level: {{targetEducationLevel}}
- Desired Field of Study: {{fieldOfStudy}}
- Academic Background: {{{academicBackground}}}
{{#if extracurricularsWorkExperience}}- Extracurricular Activities & Work Experience: {{{extracurricularsWorkExperience}}}{{/if}}
- Reasons for Choosing this Program/University: {{{whyThisProgram}}}
- Reasons for Choosing this Country: {{{whyThisCountry}}}
- Future Goals: {{{futureGoals}}}
{{#if additionalPoints}}- Additional Points to Include: {{{additionalPoints}}}{{/if}}
- Desired Tone: {{tone}}

Instructions for SOP Generation:
1.  **Structure**: The SOP should have a clear structure:
    *   **Introduction**: Hook the reader, briefly introduce the student ({{fullName}}), their academic/career interests in {{fieldOfStudy}}, and the specific program/level ({{targetEducationLevel}}) they are applying to in {{targetCountry}}.
    *   **Academic Journey & Background**: Elaborate on {{{academicBackground}}}. Highlight key achievements, relevant projects, and coursework that demonstrate their aptitude and passion for {{fieldOfStudy}}. Connect these experiences to their motivation for pursuing {{targetEducationLevel}}.
    *   **Extracurriculars & Work Experience (if provided)**: Discuss {{{extracurricularsWorkExperience}}}. Focus on skills gained (leadership, teamwork, problem-solving) and how these experiences have shaped them and relate to their chosen field or suitability for higher education.
    *   **Motivation for Program and University**: Detail {{{whyThisProgram}}}. If specific university aspects were mentioned, weave them in. Show genuine interest and research.
    *   **Motivation for Country**: Explain {{{whyThisCountry}}}. Connect it to academic, cultural, or career opportunities relevant to their studies.
    *   **Future Goals**: Clearly articulate {{{futureGoals}}}. Explain how this program in {{targetCountry}} will equip them to achieve these short-term and long-term aspirations.
    *   **Conclusion**: Summarize key strengths and motivations. Reiterate enthusiasm for the program and express confidence in their ability to succeed and contribute to the university community.
2.  **Content**:
    *   Maintain a {{tone}} and professional voice.
    *   Ensure the SOP is specific to {{fullName}}'s profile. Avoid generic statements and clichés.
    *   Demonstrate genuine passion and clear motivation for the chosen field and level of study.
    *   Show a clear link between past experiences, current studies, and future ambitions.
    *   The SOP should be engaging and persuasive.
    *   Target a word count of approximately 800-1200 words, unless the input details are very brief, in which case, generate a proportionally shorter but still comprehensive SOP.
3.  **Output Format**:
    *   Provide the complete SOP text in the 'sopText' field.
    *   In the 'feedback' field, provide 1-2 sentences of constructive feedback or areas the student might want to further personalize or strengthen in their final draft. For example, "This SOP effectively covers your motivations. Consider adding a specific anecdote from your project work to further highlight your problem-solving skills." or "A strong draft. You could elaborate more on how a specific faculty member's research at the target university aligns with your interests."

Begin generating the SOP for {{fullName}}.
`,
});

const sopGeneratorFlow = ai.defineFlow(
  {
    name: 'sopGeneratorFlow',
    inputSchema: SopGeneratorInputSchema,
    outputSchema: SopGeneratorOutputSchema,
  },
  async (input: SopGeneratorInput) => {
    // Basic validation or preprocessing can happen here if needed
    if (input.academicBackground.length < 50) { // Example
        throw new Error("Academic background details are too short to generate a meaningful SOP.");
    }

    const {output} = await prompt(input);
    if (!output || !output.sopText) {
      throw new Error(`AI model did not return the expected SOP output for ${prompt.name}. Output was null or undefined, or sopText was missing.`);
    }
    return output;
  }
);
