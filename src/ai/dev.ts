import { config } from 'dotenv';
config();

import '@/ai/flows/pathway-planner.ts';
// import '@/ai/flows/english-test-advisor.ts'; // Replaced with SOP Generator
import '@/ai/flows/document-checklist-flow.ts';
import '@/ai/flows/sop-generator-flow.ts'; // Added SOP Generator
