
import type { SopGeneratorInput } from '@/app/ai-assistants/page'; 

interface SopTemplate {
  id: string;
  criteria: {
    country?: string;
    educationLevel?: string;
  };
  sections: {
    salutation?: (input: SopGeneratorInput & { currentDate: string }) => string;
    subjectLine?: (input: SopGeneratorInput) => string;
    introduction: (input: SopGeneratorInput) => string;
    academicBackground: (input: SopGeneratorInput) => string;
    englishProficiency?: (input: SopGeneratorInput) => string;
    sponsorship?: (input: SopGeneratorInput) => string;
    reasonsToChooseCountry: (input: SopGeneratorInput) => string;
    reasonsNotToChooseHomeCountry?: (input: SopGeneratorInput) => string;
    reasonsToChooseProgram: (input: SopGeneratorInput) => string;
    reasonsToChooseInstitution?: (input: SopGeneratorInput) => string;
    futureCareerPlans: (input: SopGeneratorInput) => string;
    incentivesToReturnHome?: (input: SopGeneratorInput) => string;
    conclusion: (input: SopGeneratorInput) => string;
    closing?: (input: SopGeneratorInput) => string;
  };
}

// Basic placeholder replacement utility
function replacePlaceholders(template: string, input: SopGeneratorInput & { currentDate: string }): string {
  let result = template;
  result = result.replace(/{{FULL_NAME}}/g, input.fullName || 'the applicant');
  result = result.replace(/{{TARGET_COUNTRY}}/g, input.targetCountry || 'the target country');
  result = result.replace(/{{TARGET_EDUCATION_LEVEL}}/g, input.targetEducationLevel || 'the desired education level');
  result = result.replace(/{{FIELD_OF_STUDY}}/g, input.fieldOfStudy || 'the chosen field of study');
  result = result.replace(/{{CURRENT_DATE}}/g, input.currentDate);
  
  result = result.replace(/{{INSTITUTION_NAME}}/g, input.institutionName || 'the chosen institution');
  result = result.replace(/{{PERMANENT_ADDRESS}}/g, input.permanentAddress || 'their permanent address');
  result = result.replace(/{{SEE_SCHOOL_NAME}}/g, input.seeSchoolName || 'their SEE school');
  result = result.replace(/{{SEE_GPA}}/g, input.seeGpa || 'N/A');
  result = result.replace(/{{SEE_YEAR}}/g, input.seeYear || 'N/A');
  result = result.replace(/{{PLUS_TWO_SCHOOL_NAME}}/g, input.plusTwoSchoolName || 'their +2 school');
  result = result.replace(/{{PLUS_TWO_GPA}}/g, input.plusTwoGpa || 'N/A');
  result = result.replace(/{{PLUS_TWO_YEAR}}/g, input.plusTwoYear || 'N/A');

  result = result.replace(/{{PTE_TEST_DATE}}/g, input.pteTestDate || 'a recent date');
  result = result.replace(/{{PTE_OVERALL_SCORE}}/g, input.pteOverallScore || 'N/A');
  result = result.replace(/{{PTE_LISTENING_SCORE}}/g, input.pteListeningScore || 'N/A');
  result = result.replace(/{{PTE_READING_SCORE}}/g, input.pteReadingScore || 'N/A');
  result = result.replace(/{{PTE_WRITING_SCORE}}/g, input.pteWritingScore || 'N/A');
  result = result.replace(/{{PTE_SPEAKING_SCORE}}/g, input.pteSpeakingScore || 'N/A');
  
  result = result.replace(/{{FATHER_NAME}}/g, input.fatherName || '');
  result = result.replace(/{{FATHER_INCOME_DETAILS}}/g, input.fatherIncomeDetails || '');
  result = result.replace(/{{FATHER_ANNUAL_INCOME_NPR}}/g, input.fatherAnnualIncomeNpr || 'N/A');
  
  result = result.replace(/{{MOTHER_NAME}}/g, input.motherName || '');
  result = result.replace(/{{MOTHER_INCOME_DETAILS}}/g, input.motherIncomeDetails || '');
  result = result.replace(/{{MOTHER_ANNUAL_INCOME_NPR}}/g, input.motherAnnualIncomeNpr || 'N/A');

  result = result.replace(/{{BROTHER_NAME}}/g, input.brotherName || '');
  result = result.replace(/{{BROTHER_INCOME_DETAILS}}/g, input.brotherIncomeDetails || '');
  result = result.replace(/{{BROTHER_ANNUAL_INCOME_NPR}}/g, input.brotherAnnualIncomeNpr || 'N/A');
  
  result = result.replace(/{{UNCLE_NAME}}/g, input.uncleName || '');
  result = result.replace(/{{UNCLE_INCOME_DETAILS}}/g, input.uncleIncomeDetails || '');
  result = result.replace(/{{UNCLE_ANNUAL_INCOME_NPR}}/g, input.uncleAnnualIncomeNpr || 'N/A');

  result = result.replace(/{{TOTAL_ANNUAL_INCOME_NPR}}/g, input.totalAnnualIncomeNpr || 'N/A');
  result = result.replace(/{{TOTAL_ANNUAL_INCOME_FOREIGN_EQUIVALENT}}/g, input.totalAnnualIncomeForeignEquivalent || 'N/A');
  
  result = result.replace(/{{EDUCATION_LOAN_BANK}}/g, input.educationLoanBank || '');
  result = result.replace(/{{EDUCATION_LOAN_BANK_DESCRIPTION}}/g, input.educationLoanBankDescription || '');
  result = result.replace(/{{EDUCATION_LOAN_AMOUNT_NPR}}/g, input.educationLoanAmountNpr || 'N/A');
  result = result.replace(/{{EDUCATION_LOAN_FOREIGN_EQUIVALENT}}/g, input.educationLoanForeignEquivalent || 'N/A');

  result = result.replace(/{{WHY_THIS_COUNTRY_DETAILED}}/g, input.whyThisCountry || 'their reasons for choosing this country');
  result = result.replace(/{{WHY_NOT_HOME_COUNTRY_DETAILED}}/g, input.whyNotHomeCountry || 'their reasons for not studying in their home country');
  result = result.replace(/{{WHY_THIS_PROGRAM_DETAILED}}/g, input.whyThisProgram || 'their reasons for choosing this program');
  result = result.replace(/{{WHY_THIS_INSTITUTION_DETAILED}}/g, input.whyThisInstitution || 'their reasons for choosing this institution');
  result = result.replace(/{{FUTURE_GOALS_DETAILED}}/g, input.futureGoals || 'their future goals');
  result = result.replace(/{{EXPECTED_INITIAL_SALARY_NPR}}/g, input.expectedInitialSalaryNpr || 'N/A');
  result = result.replace(/{{INCENTIVES_TO_RETURN_HOME_DETAILED}}/g, input.incentivesToReturnHome || 'their incentives to return home');
  result = result.replace(/{{PASSPORT_NUMBER}}/g, input.passportNumber || 'N/A');
  
  // Fallback for general fields if specific ones are not filled
  result = result.replace(/{{ACADEMIC_BACKGROUND_NARRATIVE}}/g, input.academicBackground || 'their academic background');
  result = result.replace(/{{EXTRACURRICULARS_WORK_EXPERIENCE_NARRATIVE}}/g, input.extracurricularsWorkExperience || 'their extracurricular activities and work experience');
  result = result.replace(/{{ADDITIONAL_POINTS_NARRATIVE}}/g, input.additionalPoints || '');


  return result;
}

const sopTemplates: SopTemplate[] = [
  {
    id: 'generic',
    criteria: {}, // Default template
    sections: {
      introduction: (input) => `
My name is **${input.fullName}**, and I am writing to express my profound interest in pursuing a **${input.targetEducationLevel}** in **${input.fieldOfStudy}** in **${input.targetCountry}**. My passion for **${input.fieldOfStudy}** has been a driving force throughout my academic journey, and I am eager to deepen my knowledge and skills at a renowned institution.
      `.trim(),
      academicBackground: (input) => `
Throughout my academic career, I have consistently demonstrated a strong aptitude for **${input.fieldOfStudy}**. 
${input.academicBackground || `My previous studies have provided me with a solid foundation in subjects relevant to ${input.fieldOfStudy}.`}
I am confident that my academic achievements have prepared me well for the rigors of this program.
      `.trim(),
      reasonsToChooseProgram: (input) => `
I am particularly drawn to the **${input.targetEducationLevel}** in **${input.fieldOfStudy}** at an institution in **${input.targetCountry}** because **${input.whyThisProgram || `it aligns perfectly with my academic and career interests. I am impressed by the curriculum, the faculty's expertise, and the research opportunities available, which I believe will provide an unparalleled learning environment.`}**
      `.trim(),
      reasonsToChooseCountry: (input) => `
Choosing **${input.targetCountry}** for my studies is a deliberate decision. **${input.whyThisCountry || `The country's reputation for academic excellence in ${input.fieldOfStudy}, its multicultural environment, and the potential for global exposure are key factors that attract me.`}**
      `.trim(),
      futureCareerPlans: (input) => `
Upon completion of my **${input.targetEducationLevel}**, my future goals are to **${input.futureGoals || `apply the acquired knowledge and skills in a professional setting and contribute meaningfully to my field.`}** I am confident that this program will be instrumental in achieving these aspirations.
      `.trim(),
      conclusion: (input) => `
In conclusion, I am a highly motivated and dedicated individual with a clear vision for my academic and professional future. I am eager to embrace the challenges and opportunities that studying **${input.fieldOfStudy}** in **${input.targetCountry}** will offer. ${input.additionalPoints || ''} Thank you for considering my application.
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
My undergraduate studies have provided a robust foundation in [mention core subjects from input.academicBackground if available, otherwise, use the general text]. ${input.academicBackground || "This background has equipped me with the analytical and research skills necessary to excel in a demanding graduate program in the USA."}
      `.trim(),
      reasonsToChooseProgram: (input) => `
The specific Master's program in **${input.fieldOfStudy}** in the USA appeals to me due to **${input.whyThisProgram || "its comprehensive curriculum and renowned faculty."}**. The **American approach to graduate education**, emphasizing research and practical application, is something I highly value.
      `.trim(),
      reasonsToChooseCountry: (input) => `
The United States is globally recognized as a leader in **${input.fieldOfStudy}**. **${input.whyThisCountry || "The opportunity to learn from and collaborate with leading experts in a dynamic and diverse academic environment is a primary reason for choosing the USA."}**
      `.trim(),
      futureCareerPlans: (input) => `
My long-term career aspirations involve **${input.futureGoals || "making significant contributions to my field"}**. A Master's degree from an American institution will provide the **specialized knowledge and global network** essential for achieving these goals.
      `.trim(),
      conclusion: (input) => `
I am confident that I possess the dedication, aptitude, and vision to succeed in this program and contribute positively to the university community. I eagerly anticipate the opportunity to further my education in **${input.fieldOfStudy}** in the United States. ${input.additionalPoints || ''}
      `.trim(),
    },
  },
  {
    id: 'canada-diploma-social-services',
    criteria: { country: 'Canada', educationLevel: "Diploma" },
    sections: {
      salutation: (input) => `
Date: {{CURRENT_DATE}}

To,
The Visa Officer,
High Commission of Canada
New Delhi, India.
      `.trim(),
      subjectLine: (input) => `
**Subject: Application to pursue a {{TARGET_EDUCATION_LEVEL}} in {{FIELD_OF_STUDY}} at {{INSTITUTION_NAME}}**
      `.trim(),
      introduction: (input) => `
Respected Sir/Madam,

I am appreciative of the chance to compose this statement of intent of a submission of my student application to Canadian High Commission. I have got an admission to **{{INSTITUTION_NAME}}** to pursue **{{TARGET_EDUCATION_LEVEL}} in {{FIELD_OF_STUDY}}**. This statement contains details about my educational background, plans for my future after the course and I guarantee that all the information included in this SOP form is accurate and truthful.

**Introduction and Academic Background**

Glad to introduce myself as **{{FULL_NAME}}**, a permanent resident of **{{PERMANENT_ADDRESS}}**. Since childhood, I have been a quick learner, hardworking student and flexible in various situations.
      `.trim(),
      academicBackground: (input) => `
Studying and following my academic objectives and aspirations are my top priorities in life. Throughout my academic year, I gave it my all. I'd like to give you a quick rundown of my accomplishment. In terms of my academic history, I graduated from **{{SEE_SCHOOL_NAME}}**, in **{{SEE_YEAR}}** with a **{{SEE_GPA}} GPA** and completed my Secondary Education Examination (SEE). After finishing high school, I enrolled in **{{PLUS_TWO_SCHOOL_NAME}}** to pursue my +2 degree. I have a +2 degree with a **{{PLUS_TWO_GPA}} GPA**, and in **{{PLUS_TWO_YEAR}}**, I obtained my Academic Transcript and other required credentials.
      `.trim(),
      englishProficiency: (input) => `
I've always been good at English since I was in elementary school. As my level improved, I began to practice more, which helped me enhance my English abilities. So, after finishing my higher education, I opted to take **PTE** and went to numerous educational consultancies where I received advice on various destinations such as the Canada, United States, Australia, the United Kingdom, European countries. Therefore as advised by my counsellor, I prepared for the PTE exam for a few months and appeared for the test on **{{PTE_TEST_DATE}}**, in which I scored an overall band of **{{PTE_OVERALL_SCORE}}**. (L-{{PTE_LISTENING_SCORE}}, R-{{PTE_READING_SCORE}}, W-{{PTE_WRITING_SCORE}}, S-{{PTE_SPEAKING_SCORE}}).
      `.trim(),
      sponsorship: (input) => `
**SPONSOR DETAILS**

I am getting sponsored by my Parents, Uncle and brother, they have a sound income and can easily afford the expenses of my tuition fees and living expenses.
Further, regarding the Income sources, my sponsor have the following annual income details:
- **{{FATHER_NAME}}** (Father), NPR. **{{FATHER_ANNUAL_INCOME_NPR}}** ({{FATHER_INCOME_DETAILS}})
- **{{MOTHER_NAME}}** (Mother), NPR **{{MOTHER_ANNUAL_INCOME_NPR}}** ({{MOTHER_INCOME_DETAILS}})
- **{{BROTHER_NAME}}** (Brother), NPR **{{BROTHER_ANNUAL_INCOME_NPR}}** ({{BROTHER_INCOME_DETAILS}})
- **{{UNCLE_NAME}}** (Uncle), NPR **{{UNCLE_ANNUAL_INCOME_NPR}}** ({{UNCLE_INCOME_DETAILS}})
Total Annual Income: NPR **{{TOTAL_ANNUAL_INCOME_NPR}}** ({{TOTAL_ANNUAL_INCOME_FOREIGN_EQUIVALENT}})
I also have been approved an education loan from **{{EDUCATION_LOAN_BANK}}** ({{EDUCATION_LOAN_BANK_DESCRIPTION}}) of NPR **{{EDUCATION_LOAN_AMOUNT_NPR}}** ({{EDUCATION_LOAN_FOREIGN_EQUIVALENT}}).
      `.trim(),
      reasonsToChooseCountry: (input) => `
**REASONS TO CHOOSE CANADA AS A STUDY DESTINATION**

After a lot of research, I finally choose Canada for my higher studies. The first and foremost reason of choosing Canada is its **excellent education system and a degree that has a global recognition**. Canada provides a unique kind of education and learning style that encourages one to be innovative, creative and think independently. Graduates from Canada are very successful in finding jobs and hold prominent positions worldwide. In addition to that, they are readily accepted for post graduate study at leading international universities and I surely want to be one of those graduates.

${input.whyThisCountry || `Canada provides limitless opportunities for international students to explore their future with dynamic learning environment. Teaching and research facilities are world class in terms of laboratories and classrooms. Students can select from thousands of courses and they have flexibility to choose the study path that best suits their goal. I have devoted countless hours attending various educational seminars and online research. I found out that Canada is the ideal destination to pursue Social Services degree compared to other countries like UK, USA, Japan and New Zealand. Canadian universities as well as colleges are repeatedly ranked in the list of world’s best universities and colleges. In addition, there are many best cities for international students in Canada which are among the most livable places worldwide. Presence of different kinds of provision and policy for protecting educational investment in Canada have attracted me even more as this kind of provision is absent in many countries like UK, USA and so on. Moreover, being away from home, one seeks secure place. Canada’s society has a safe, multicultural friendly and harmonious place to live. People value the wealth of cultural diversity and societal sophistication that the international students bring to campuses and communities. I hope to make new friends from different cultural backgrounds and also share mine traditions, exposures, which, I would encounter while as a student in Canada.

Further, Canada is well known as being home to some of the best research institutions of Earth. High quality academic programs in science fields, like nursing and healthcare, chemistry, biology, zoology and wildlife, mathematics, technology and engineering are found in a great number of Canada’s major universities. As the educational degrees obtained here are recognized all over the world, this makes a study abroad program in Canada a valuable addition to every student’s professional resume.`}
      `.trim(),
      reasonsNotToChooseHomeCountry: (input) => `
**REASONS NOT TO CHOOSE NEPAL**

${input.whyNotHomeCountry || `The curriculum is the best part of an international degree. Nepalese students usually choose other nations like Canada, Australia, USA or UK as they are more industry relevant and subject oriented than Nepalese degrees, which is one of the reasons why overseas degrees are prioritized over Nepalese degrees. The international degree is a research-based program that prepares students to solve problems. It is necessary to conduct research in order to gather knowledge and solve difficulties. However, in Nepal, these methods are not encouraged; instead, students might obtain a diploma by reading previous questions, notes, guess papers, and books available in the market. This is true for both undergraduate and graduate programs.

Furthermore, international degrees foster creativity among students. To pass an examination, a student studying website design, for example, must design and develop a website. Nobody can guarantee a job, but institutions can ensure knowledge, which can only be accomplished through education. If the curriculum is solid, grades are less relevant because the student will have the necessary information. In Nepal, overseas graduates are given preference over national graduates in terms of income and company hierarchy. For example, an overseas graduate with a lower academic % than a native graduate with a higher percentage is given more priority. The curriculum and teaching technique are the key reasons behind this.

Also, at post study state, big companies only prioritize international graduates even they have less academic performance than Nepalese university graduates. So, gaining international degree will help me to find competitive job opportunity. Further, there is only hand full of University in Nepal but none of them have good international ranking. Now a days there are lots of colleges offering international degree here in Nepal, but I got hesitated joining those colleges as there are news that international university pulls out the affiliation and students gets stranded without a degree. Hence, I decided to pursue my education abroad.`}
      `.trim(),
      reasonsToChooseProgram: (input) => `
**REASON TO CHOOSE {{FIELD_OF_STUDY}}**

${input.whyThisProgram || `I have been passionate about assisting others and bringing about positive change in my community since I was a little child. My desire to have a significant impact on people’s lives has motivated me to seek a Diploma in ${input.fieldOfStudy}, where I can acquire the necessary information and abilities. I’m very drawn to the prospect of working in social housing, case management, or community services since it will enable me to offer person-centered support to groups and individuals dealing with a variety of difficulties.

In order to properly serve others, I hope to gain an understanding of their backgrounds, issues, and situations through this course. The idea of creating networks and support systems for customers to help them get through short-and long-term obstacles excites me in particular. The field of social services provides the immense satisfaction of aiding a diverse range of people, promoting transformation, formulating remedies, and furnishing essential resources and data.

Furthermore, the social services industry is quite appealing due to its versatility. It gives me the freedom to investigate several career options, including family counseling, youth work, elderly care, and disability services, so I can discover my actual love. In the end, I want to positively impact people’s lives, and I think working in social services can help me achieve this goal.`}
      `.trim(),
      reasonsToChooseInstitution: (input) => `
**REASONS TO CHOOSE {{INSTITUTION_NAME}}**

${input.whyThisInstitution || `Making the decision to study in Canada was a crucial one for me. I started by going to educational consultancies in Kathmandu and doing a lot of research online. It became clear that Canada has a large number of universities that provide excellent ${input.fieldOfStudy} course, all of which offer top-notch education. ${input.institutionName || 'Northern Lights College'} is a reputable educational institution that stands out among the rest.

My skills and expertise will be respected throughout the nation since ${input.institutionName || 'Northern Lights College'} offers nationally recognized qualifications. The courses are made to give students who want to advance in their employment or pursue higher education outstanding skills and qualifications. After graduating from ${input.institutionName || 'Northern Lights College'} with a nationally recognized credential, I will have many alternatives at my disposal.

Furthermore, ${input.institutionName || 'Northern Lights College'} is committed to its students’ achievement. The faculty and staff at the institution give students an education that prepares them for success, opens their minds to new ideas, and gives them the skills and mindset they need to accomplish their academic and professional goals. My professional progress as a ${input.fieldOfStudy.toLowerCase()} depends on this encouraging atmosphere.

I am enthusiastic about the path ahead and am sure that attending ${input.institutionName || 'Northern Lights College'} will give me the chances, knowledge, and abilities I need to have a significant difference in the ${input.fieldOfStudy.toLowerCase()} industry.`}
      `.trim(),
      futureCareerPlans: (input) => `
**FUTURE CAREER PLAN**

${input.futureGoals || `As we all know, Nepal is a developing country with enormous potential in every industry. As a Nepalese citizen, I bear responsibility for my homeland. I have to return to my homeland. I've always wanted to work in my own country and contribute to the country's well-being. This course's knowledge will open doors to any field, giving me an endless range of options in my career. A degree from a Canadian institution will be the most beneficial program for me to reach my goal. With a wealth of expertise and talent, I will be able to meet the demands of the role in Nepal, providing additional prospects for future success. Also, in terms of a future job in Nepal, I may expect to earn between ${input.expectedInitialSalaryNpr || 'NPR 80,000 and 90,000'} in the beginning of my career, with the potential to increase if I improve my work.`}
      `.trim(),
      incentivesToReturnHome: (input) => `
**INCENTIVES TO RETURN TO HOME-COUNTRY**

${input.incentivesToReturnHome || `I will assure that I will return to my home nation after gaining the quality education in Canada companion and culture, in brief my entirety world is here. These components play a critical part for my return. I will certainly return to my domestic nation where I can have everything that I need after completion of my study in Canada. So, I affirm that I will return back as I have a solid family holding, which does not permit me to remain away from them for long time. They have contributed their time, cash and conviction upon me for my education. I am certain that I will not let them down and will doubtlessly fulfill their dreams. Once I gain enough experience in the field, I would like to start a welfare program for elderly in Nepal. As I have already mentioned about my grandparents and situation of many elderlies in Nepal, starting a well-equipped home for them will be a great achievement for me. I have learnt so many things in my life from my grandparents and I am very close to them as well so I have a dream to do good deeds for them in their old age. So I have full intention to return to my home country.`}
      `.trim(),
      conclusion: (input) => `
**CONCLUSION**

At last, I would like to state myself as a genuine student with a good academic track record who meets the English language proficiency. Also, I would like you to know that I am financially, emotionally and mentally strong and my only intention to go to Canada is for Academic purpose only and grab internationally recognized degree. I look forward to having a long and beneficial association with my college ahead. ${input.additionalPoints || ''}
      `.trim(),
      closing: (input) => `
Thank you for your time and consideration,

Yours Sincerely,
Name: **{{FULL_NAME}}**
Passport Number: **{{PASSPORT_NUMBER}}**
      `.trim(),
    },
  },
];

export function generateSopFromTemplate(input: SopGeneratorInput): string {
  let selectedTemplate = sopTemplates.find(
    (t) =>
      t.criteria.country === input.targetCountry &&
      t.criteria.educationLevel === input.targetEducationLevel
  );

  if (!selectedTemplate) {
    selectedTemplate = sopTemplates.find(t => t.criteria.country === input.targetCountry && !t.criteria.educationLevel);
  }
  
  if (!selectedTemplate) {
    selectedTemplate = sopTemplates.find(t => t.id === 'generic');
  }

  if (!selectedTemplate) {
    return "Error: Could not find a suitable SOP template.";
  }

  const sections = selectedTemplate.sections;
  let fullSop = "";
  const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/(\d+)(st|nd|rd|th)/, "$1");


  const allInputs = { ...input, currentDate };

  if (sections.salutation) fullSop += sections.salutation(allInputs) + "\n\n";
  if (sections.subjectLine) fullSop += sections.subjectLine(allInputs) + "\n\n";
  
  fullSop += sections.introduction(allInputs) + "\n\n";
  fullSop += sections.academicBackground(allInputs) + "\n\n";
  
  if (sections.englishProficiency && (input.pteOverallScore || input.ieltsOverallScore || input.toeflOverallScore || input.duolingoOverallScore)) {
    fullSop += sections.englishProficiency(allInputs) + "\n\n";
  }
  if (sections.sponsorship && (input.fatherName || input.motherName || input.brotherName || input.uncleName || input.educationLoanBank)) {
    fullSop += sections.sponsorship(allInputs) + "\n\n";
  }
  
  fullSop += sections.reasonsToChooseCountry(allInputs) + "\n\n";
  
  if (sections.reasonsNotToChooseHomeCountry && input.whyNotHomeCountry) {
    fullSop += sections.reasonsNotToChooseHomeCountry(allInputs) + "\n\n";
  }
  
  fullSop += sections.reasonsToChooseProgram(allInputs) + "\n\n";
  
  if (sections.reasonsToChooseInstitution && input.institutionName) {
    fullSop += sections.reasonsToChooseInstitution(allInputs) + "\n\n";
  }
  
  fullSop += sections.futureCareerPlans(allInputs) + "\n\n";
  
  if (sections.incentivesToReturnHome && input.incentivesToReturnHome) {
    fullSop += sections.incentivesToReturnHome(allInputs) + "\n\n";
  }
  
  fullSop += sections.conclusion(allInputs) + "\n\n";
  
  if (sections.closing) fullSop += sections.closing(allInputs);
  
  return replacePlaceholders(fullSop, allInputs);
}
