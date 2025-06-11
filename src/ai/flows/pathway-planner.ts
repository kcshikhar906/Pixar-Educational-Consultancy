
// src/ai/flows/pathway-planner.ts
'use server';

/**
 * @fileOverview A pathway planner AI agent that suggests universities
 * based on a student's chosen country, desired field of study, GPA, and target education level.
 *
 * - pathwayPlanner - A function that handles the pathway planning process.
 * - PathwayPlannerInput - The input type for the pathwayPlanner function.
 * - PathwayPlannerOutput - The return type for the pathwayPlanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PathwayPlannerInputSchema = z.object({
  country: z
    .string()
    .describe('The country the student is interested in (e.g., USA, Australia).'),
  fieldOfStudy: z.string().describe('The desired field of study (e.g., computer science, engineering).'),
  gpa: z.string().describe('The student\'s approximate Grade Point Average (GPA) or academic standing (e.g., "4.0", "3.5-3.9", "Percentage-based equivalent"). The AI should consider this when suggesting suitable universities.'),
  targetEducationLevel: z.string().describe("The target level of education the student is seeking (e.g., Bachelor's Degree, Master's Degree)."),
});

export type PathwayPlannerInput = z.infer<typeof PathwayPlannerInputSchema>;

const UniversitySuggestionSchema = z.object({
  name: z.string().describe("The name of the suggested university."),
  category: z.string().describe("The main category or specialization of the university (e.g., Engineering, Arts, Business)."),
  logoDataAiHint: z.string().optional().describe("A 1-2 word hint for the university's logo for placeholder generation (e.g., 'university shield', 'modern building')."),
  website: z.string().describe("The official website URL of the university."),
  programDuration: z.string().describe("The typical duration for a relevant program in the field of study, e.g., '3-4 years', '18 months', '2 years full-time'."),
  type: z.enum(["Public", "Private", "Unknown"]).describe("The type of university (Public, Private, or Unknown)."),
  location: z.string().describe("The city and state/region of the university (e.g., 'Cambridge, MA', 'Sydney, NSW')."),
  tuitionCategory: z.enum(["Affordable", "Mid-Range", "Premium", "Varies", "Unknown"]).describe("A category for the estimated annual tuition. Affordable: typically <$15,000 USD/year or equivalent. Mid-Range: $15,000-$30,000 USD/year or equivalent. Premium: >$30,000 USD/year or equivalent. Use 'Varies' if it's highly variable or 'Unknown' if not determinable."),
  tuitionFeeRange: z.string().optional().describe("Estimated annual tuition fee range if available, e.g., '$10,000 - $15,000 USD', '€8,000 - €12,000'. Keep this concise."),
  scholarshipLevel: z.enum(["High", "Medium", "Low", "None", "Varies", "Unknown"]).describe("General availability or level of scholarships (High: many options often available; Medium: some options; Low: few options; None: typically no scholarships; Varies; Unknown)."),
  rawScholarshipInfo: z.string().optional().describe("Optional: Very concise textual information about scholarship availability, e.g., 'Merit-based scholarships available'. Limit to one short phrase."),
  englishTestRequirements: z.string().optional().describe("Typical English proficiency test scores required (e.g., 'IELTS: 6.5+', 'TOEFL iBT: 90+'). Keep this concise."),
});

const PathwayPlannerOutputSchema = z.object({
  universitySuggestions: z
    .array(UniversitySuggestionSchema)
    .describe('A list of suggested universities with their details, relevant to the chosen country, field of study, GPA, and target education level.'),
  searchSummary: z.string().optional().describe("A brief summary of the search results or any general advice based on the query. For example, 'Here are some leading Engineering universities in the USA known for strong research programs that might be suitable for a student with a {{{gpa}}} GPA seeking a {{{targetEducationLevel}}}.' Acknowledge the GPA's and target education level's influence if relevant."),
});

export type PathwayPlannerOutput = z.infer<typeof PathwayPlannerOutputSchema>;

export async function pathwayPlanner(input: PathwayPlannerInput): Promise<PathwayPlannerOutput> {
  return pathwayPlannerFlow(input);
}

const pathwayPlannerPrompt = ai.definePrompt({
  name: 'pathwayPlannerPrompt',
  input: {schema: PathwayPlannerInputSchema},
  output: {schema: PathwayPlannerOutputSchema},
  prompt: `You are an expert educational consultant. A student is seeking university suggestions.
  Based on their desired country ('{{{country}}}'), field of study ('{{{fieldOfStudy}}}'), GPA ('{{{gpa}}}'), and target education level ('{{{targetEducationLevel}}}'), provide a list of university suggestions.

  Consider the student's GPA ({{{gpa}}}) and their target education level ({{{targetEducationLevel}}}) when suggesting universities. Aim for institutions where a student with this academic standing might generally be competitive for programs at their desired level.
  Please provide a DIVERSE range of suitable universities. While you can include well-known institutions, also make an effort to suggest other strong universities that might be excellent fits but perhaps less globally famous. The goal is to offer a broad spectrum of choices, not just the top 5-10 most internationally recognized names. Focus on relevance to the student's criteria.

  For each university, provide the following details:
  1.  'name': The official name of the university.
  2.  'category': The main academic category or specialization of the university relevant to the field of study (e.g., Engineering, Arts, Business, Technology, Health Sciences).
  3.  'logoDataAiHint': A very short (1-2 words) hint for a placeholder logo, like "university shield" or "modern building".
  4.  'website': The official website URL. Ensure it's a full, valid URL.
  5.  'programDuration': The typical duration for a relevant program in the specified field of study AT THE TARGET EDUCATION LEVEL (e.g., "3-4 years for Bachelor's", "18 months for Master's", "2 years full-time for Master's").
  6.  'type': The type of university - "Public", "Private", or "Unknown".
  7.  'location': The city and state/region of the university (e.g., "Cambridge, MA", "Sydney, NSW").
  8.  'tuitionCategory': Categorize the estimated annual tuition for programs at the target education level:
      - "Affordable": Typically less than $15,000 USD per year (or local equivalent).
      - "Mid-Range": Typically $15,000 - $30,000 USD per year (or local equivalent).
      - "Premium": Typically more than $30,000 USD per year (or local equivalent).
      - "Varies": If tuition is highly variable across programs or student types.
      - "Unknown": If information is not readily available.
  9.  'tuitionFeeRange': (Optional) A CONCISE estimated annual tuition fee range if available, e.g., "$10,000 - $15,000 USD", "€8,000 - €12,000".
  10. 'scholarshipLevel': Categorize scholarship availability for students at the target education level:
      - "High": Many scholarships generally available.
      - "Medium": Some scholarships available.
      - "Low": Few scholarships available.
      - "None": Generally no scholarships.
      - "Varies": Highly variable.
      - "Unknown": If information is not readily available.
  11. 'rawScholarshipInfo': (Optional) A VERY short, concise phrase about scholarship details if available, like "Merit-based aid available."
  12. 'englishTestRequirements': (Optional) CONCISE typical English proficiency test scores required (e.g., "IELTS: 6.5+", "TOEFL iBT: 90+").

  Only list universities located within the specified country. Ensure the website is a direct link to the university.
  Provide as many relevant suggestions as you can find for the given criteria.

  Desired Country: {{{country}}}
  Desired Field of Study: {{{fieldOfStudy}}}
  Student's GPA/Academic Standing: {{{gpa}}}
  Student's Target Education Level: {{{targetEducationLevel}}}

  Finally, include a brief 'searchSummary' if you have any overarching comments on the results for the given query. Acknowledge the GPA's and target education level's influence on university suitability in your summary if relevant.
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
