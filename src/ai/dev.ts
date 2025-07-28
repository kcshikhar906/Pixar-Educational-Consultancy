import { config } from 'dotenv';
config();

import '@/ai/flows/pathway-planner.ts';
import '@/ai/flows/chatbot-flow.ts'; // Add chatbot flow
// document-checklist-flow.ts is removed as it's now rule-based
// english-test-advisor.ts is removed as it's now rule-based or static guide
// sop-generator-flow.ts is removed
