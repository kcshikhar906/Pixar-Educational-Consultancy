import { config } from 'dotenv';
config();

import '@/ai/flows/pathway-planner.ts';
import '@/ai/flows/document-checklist-flow.ts';
// SOP Generator is now template-based and client-side, no AI flow to import.

