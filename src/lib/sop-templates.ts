
import type { SopGeneratorInput } from '@/app/ai-assistants/page'; // Assuming type is still useful for input structure

interface SopTemplate {
  id: string;
  criteria: {
    country?: string;
    educationLevel?: string;
    // Potentially add fieldOfStudyCategory if templates get very specific
  };
  sections: {
    introduction: (input: SopGeneratorInput) => string;
    academicBackground: (input: SopGeneratorInput) => string;
    extracurriculars?: (input: SopGeneratorInput) => string; // Optional section
    whyThisProgram: (input: SopGeneratorInput) => string;
    whyThisCountry: (input: SopGeneratorInput) => string;
    futureGoals: (input: SopGeneratorInput) => string;
    conclusion: (input: SopGeneratorInput) => string;
  };
}

// Basic placeholder replacement utility
function replacePlaceholders(template: string, input: SopGeneratorInput): string {
  let result = template;
  result = result.replace(/{{FULL_NAME}}/g, input.fullName || 'the applicant');
  result = result.replace(/{{TARGET_COUNTRY}}/g, input.targetCountry || 'the target country');
  result = result.replace(/{{TARGET_EDUCATION_LEVEL}}/g, input.targetEducationLevel || 'the desired education level');
  result = result.replace(/{{FIELD_OF_STUDY}}/g, input.fieldOfStudy || 'the chosen field of study');
  // Add more replacements as needed for detailed fields
  return result;
}

const sopTemplates: SopTemplate[] = [
  {
    id: 'generic',
    criteria: {}, // Default template
    sections: {
      introduction: (input) => `
My name is ${input.fullName}, and I am writing to express my profound interest in pursuing a ${input.targetEducationLevel} in ${input.fieldOfStudy} in ${input.targetCountry}. My passion for ${input.fieldOfStudy} has been a driving force throughout my academic journey, and I am eager to deepen my knowledge and skills at a renowned institution.
      `.trim(),
      academicBackground: (input) => `
Throughout my academic career, I have consistently demonstrated a strong aptitude for ${input.fieldOfStudy}. My studies in ${input.academicBackground.substring(0,50)}... have provided me with a solid foundation. 
Specifically, ${input.academicBackground}
I am confident that my academic achievements have prepared me well for the rigors of this program.
      `.trim(),
      extracurriculars: (input) => input.extracurricularsWorkExperience ? `
Beyond academics, I have actively engaged in various extracurricular activities and work experiences that have further honed my skills. ${input.extracurricularsWorkExperience} These experiences have taught me valuable lessons in teamwork, leadership, and practical application of knowledge.
      `.trim() : "",
      whyThisProgram: (input) => `
I am particularly drawn to the ${input.targetEducationLevel} in ${input.fieldOfStudy} at an institution in ${input.targetCountry} because ${input.whyThisProgram} I am impressed by the curriculum, the faculty's expertise, and the research opportunities available, which I believe will provide an unparalleled learning environment.
      `.trim(),
      whyThisCountry: (input) => `
Choosing ${input.targetCountry} for my studies is a deliberate decision. ${input.whyThisCountry} The country's reputation for academic excellence in ${input.fieldOfStudy}, its multicultural environment, and the potential for global exposure are key factors that attract me.
      `.trim(),
      futureGoals: (input) => `
Upon completion of my ${input.targetEducationLevel}, my future goals are to ${input.futureGoals}. I am confident that the knowledge and skills acquired through this program will be instrumental in achieving these aspirations and making a meaningful contribution to my field.
      `.trim(),
      conclusion: (input) => `
In conclusion, I am a highly motivated and dedicated individual with a clear vision for my academic and professional future. I am eager to embrace the challenges and opportunities that studying ${input.fieldOfStudy} in ${input.targetCountry} will offer. Thank you for considering my application.
      `.trim(),
    },
  },
  {
    id: 'usa-masters',
    criteria: { country: 'USA', educationLevel: "Master's Degree" },
    sections: {
      introduction: (input) => `
With great enthusiasm, I, **${input.fullName}**, submit my application for the Master's Degree program in **${input.fieldOfStudy}** at a distinguished university in the United States. My ambition to specialize in **${input.fieldOfStudy}** stems from a deep-seated interest and a desire to contribute to innovative advancements in this domain.
      `.trim(),
      academicBackground: (input) => `
My undergraduate studies have provided a robust foundation in [mention core subjects from input.academicBackground]. ${input.academicBackground}. This background has equipped me with the analytical and research skills necessary to excel in a demanding graduate program in the USA.
      `.trim(),
       extracurriculars: (input) => input.extracurricularsWorkExperience ? `
In addition to my academic pursuits, my involvement in ${input.extracurricularsWorkExperience.substring(0,70)}... has been crucial in developing a well-rounded perspective. ${input.extracurricularsWorkExperience}
      `.trim() : "",
      whyThisProgram: (input) => `
The specific Master's program in **${input.fieldOfStudy}** in the USA appeals to me due to ${input.whyThisProgram}. The **American approach to graduate education**, emphasizing research and practical application, is something I highly value.
      `.trim(),
      whyThisCountry: (input) => `
The United States is globally recognized as a leader in **${input.fieldOfStudy}**. ${input.whyThisCountry}. The opportunity to learn from and collaborate with leading experts in a **dynamic and diverse academic environment** is a primary reason for choosing the USA.
      `.trim(),
      futureGoals: (input) => `
My long-term career aspirations involve ${input.futureGoals}. A Master's degree from an American institution will provide the **specialized knowledge and global network** essential for achieving these goals and making a significant impact.
      `.trim(),
      conclusion: (input) => `
I am confident that I possess the dedication, aptitude, and vision to succeed in this program and contribute positively to the university community. I eagerly anticipate the opportunity to further my education in **${input.fieldOfStudy}** in the United States.
      `.trim(),
    },
  },
  {
    id: 'canada-diploma',
    criteria: { country: 'Canada', educationLevel: "Diploma" }, // Match "Diploma" value from allEducationLevels
    sections: {
      introduction: (input) => `
**Statement of Purpose: Diploma in ${input.fieldOfStudy} - Canada**

My name is **${input.fullName}**, and I am writing to express my profound interest in pursuing the Diploma in **${input.fieldOfStudy}** in Canada. My aspiration to undertake this program stems from a strong desire to acquire **practical, industry-relevant skills** and to build a successful career in this field. I am particularly keen on studying in Canada due to its **globally recognized vocational education system** and its welcoming environment for international students.
      `.trim(),
      academicBackground: (input) => `
My previous educational experiences, detailed as: **${input.academicBackground}**, have laid a foundational understanding that I am eager to build upon with the specialized, hands-on training offered by this diploma program. I believe my [mention a key strength or relevant subject from background] has prepared me for the practical nature of this course.
      `.trim(),
      extracurriculars: (input) => input.extracurricularsWorkExperience ? `
Beyond my formal education, I have engaged in activities such as: **${input.extracurricularsWorkExperience}**. These experiences, whether volunteer work, part-time jobs, or personal projects, have helped me develop [mention 1-2 skills like problem-solving, teamwork, communication], which I am confident will be beneficial during my studies and future career.
      `.trim() : "I am focused on dedicating my energies to this intensive diploma program to maximize my learning.",
      whyThisProgram: (input) => `
I have chosen the Diploma in **${input.fieldOfStudy}** specifically because **${input.whyThisProgram}**. I am particularly attracted to [mention 1-2 aspects like 'the program's focus on real-world projects', 'specific modules like X and Y', or 'the reputation of Canadian institutions for this diploma area']. This program's emphasis on **practical application over theoretical learning** is exactly what I seek to kickstart my career.
      `.trim(),
      whyThisCountry: (input) => `
Canada is my preferred destination for this diploma program for several compelling reasons. **${input.whyThisCountry}**. The country's commitment to **high-quality vocational training**, its **strong industry links that facilitate co-op opportunities or internships**, and the **safe, multicultural society** make it an ideal place for me to learn and grow. Furthermore, the potential for **post-graduation work permits** offers a valuable chance to gain Canadian work experience.
      `.trim(),
      futureGoals: (input) => `
Upon successful completion of this diploma, my immediate career goal is to **${input.futureGoals}**. I aim to apply the skills and knowledge gained in a practical setting, ideally within [mention type of company or industry in Canada or back home]. In the long term, I envision myself [mention long-term aspiration, e.g., becoming a specialist, starting my own venture, contributing to a specific sector in my home country]. This diploma is a **critical stepping stone** towards these aspirations.
      `.trim(),
      conclusion: (input) => `
In conclusion, I am a highly motivated and practical-minded individual, eager to benefit from the focused and skill-oriented Diploma in **${input.fieldOfStudy}** in Canada. ${input.additionalPoints ? `**Additional Considerations:** ${input.additionalPoints}.` : ''} I am confident that this program will equip me with the necessary competencies for a thriving career and I am prepared to dedicate myself fully to this educational pursuit. Thank you for considering my application.
      `.trim(),
    },
  },
  // Add more templates for other countries, education levels, etc.
  // e.g., { id: 'uk-bachelors', criteria: { country: 'UK', educationLevel: "Bachelor's Degree" }, sections: { ... } }
];

export function generateSopFromTemplate(input: SopGeneratorInput): string {
  // Try to find the most specific template first
  let selectedTemplate = sopTemplates.find(
    (t) =>
      t.criteria.country === input.targetCountry &&
      t.criteria.educationLevel === input.targetEducationLevel
  );

  // Fallback to country-specific if level-specific not found
  if (!selectedTemplate) {
    selectedTemplate = sopTemplates.find(t => t.criteria.country === input.targetCountry && !t.criteria.educationLevel);
  }
  
  // Fallback to generic if no specific template is found
  if (!selectedTemplate) {
    selectedTemplate = sopTemplates.find(t => t.id === 'generic');
  }

  if (!selectedTemplate) {
    // Should not happen if 'generic' template exists
    return "Error: Could not find a suitable SOP template. Please ensure a 'generic' template is defined.";
  }

  const sections = selectedTemplate.sections;
  let fullSop = "";

  // Assemble SOP from sections
  fullSop += sections.introduction(input) + "\n\n";
  fullSop += sections.academicBackground(input) + "\n\n";
  if (sections.extracurriculars && (input.extracurricularsWorkExperience || sections.id === 'canada-diploma')) { // ensure canada-diploma can render its default extracurricular text
    const extracurricularText = sections.extracurriculars(input);
    if (extracurricularText.trim()) {
      fullSop += extracurricularText + "\n\n";
    }
  }
  fullSop += sections.whyThisProgram(input) + "\n\n";
  fullSop += sections.whyThisCountry(input) + "\n\n";
  fullSop += sections.futureGoals(input) + "\n\n";
  fullSop += sections.conclusion(input);
  
  return replacePlaceholders(fullSop, input);
}

