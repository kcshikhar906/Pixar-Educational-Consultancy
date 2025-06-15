
import { z } from 'zod';

export const SopGeneratorInputSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters.").max(100, "Full name is too long.").describe("The student's full name."),
  targetCountry: z.string().min(1, "Please select a target country.").describe("The country where the student wishes to study."),
  targetEducationLevel: z.string().min(1, "Please select the target education level.").describe("The level of education the student is applying for (e.g., Bachelor's Degree, Master's Degree)."),
  fieldOfStudy: z.string().min(2, "Field of study must be at least 2 characters.").max(100, "Field of study is too long.").describe("The student's desired field of study."),
  academicBackground: z.string().min(50, "Academic background must be at least 50 characters.").max(2000, "Academic background is too long, maximum 2000 characters.").describe("Details of past education, relevant subjects, grades/GPA, key projects, and academic achievements."),
  extracurricularsWorkExperience: z.string().min(20, "Please provide some details, minimum 20 characters.").max(2000, "Extracurriculars/Work experience is too long, maximum 2000 characters.").optional().describe("Relevant work experience, internships, volunteer work, leadership roles, and significant extracurricular activities."),
  whyThisProgram: z.string().min(50, "Reasons for choosing this program must be at least 50 characters.").max(1500, "Reasons for this program are too long, maximum 1500 characters.").describe("Reasons for choosing this specific program and university (mention specific aspects if known)."),
  whyThisCountry: z.string().min(50, "Reasons for choosing this country must be at least 50 characters.").max(1500, "Reasons for this country are too long, maximum 1500 characters.").describe("Reasons for choosing this particular country for studies."),
  futureGoals: z.string().min(50, "Future goals must be at least 50 characters.").max(1500, "Future goals are too long, maximum 1500 characters.").describe("Short-term and long-term career aspirations and how this program/country will help achieve them."),
  additionalPoints: z.string().max(1000, "Additional points are too long, maximum 1000 characters.").optional().describe("Any other specific information or points the student wants to include in the SOP."),
  tone: z.enum(["Formal", "Slightly Informal", "Enthusiastic", "Objective"]).default("Formal").describe("The desired tone of the SOP."),
});

export const SopGeneratorOutputSchema = z.object({
  sopText: z.string().describe("The generated Statement of Purpose."),
  feedback: z.string().optional().describe("Brief feedback or suggestions on the generated SOP, or areas the student might want to elaborate on personally.")
});
