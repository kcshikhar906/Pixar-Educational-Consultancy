'use server';

/**
 * @fileOverview A conversational chatbot flow for Pixar Educational Consultancy.
 * This flow is designed to answer user questions based on provided website context
 * and general knowledge, acting as a friendly educational consultant.
 *
 * - chat - A function that handles the conversational logic.
 */

import { ai } from '@/ai/genkit';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from '@/ai/schemas/chatbot-schemas';

// Define the main function that will be called by the chatbot component
export async function chat(input: ChatInput): Promise<ChatOutput> {
  // Call the Genkit flow with the provided input
  const flowResult = await chatFlow(input);
  return flowResult;
}

// Define the Genkit prompt
const chatPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Specify the model to use
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for Pixar Educational Consultancy, a company that helps Nepalese students study abroad in countries like USA, UK, Australia, Canada, and New Zealand.

  Your persona is professional, encouraging, and knowledgeable. Your goal is to answer user questions accurately based on the provided website context and your general knowledge about studying abroad.

  You MUST NOT invent information about Pixar's services, fees, or specific processes. If the answer is not in the provided context or your general knowledge, politely state that you don't have that specific information and suggest the user contact the consultancy directly for the most accurate details using the contact forms.

  **Do not answer questions that are not related to studying abroad or Pixar Educational Consultancy's services.** If the user asks an unrelated question, politely steer the conversation back to study abroad topics.

  **CONTEXT FROM WEBSITE:**
  ---
  {{{context}}}
  ---

  **CONVERSATION HISTORY:**
  {{#each history}}
  - {{role}}: {{{content}}}
  {{/each}}

  **USER's CURRENT QUESTION:**
  "{{{query}}}"

  Based on the context and history, provide a helpful and concise response. Keep your answers relatively short and easy to read in a chat format. Use markdown for formatting if it helps clarity (e.g., bullet points).`,
});

// Define the Genkit flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    if (!output) {
      return { response: "I'm sorry, I'm having trouble generating a response at the moment. Please try again." };
    }
    return output;
  }
);
