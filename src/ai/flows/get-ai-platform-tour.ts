// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview An AI-powered guide for new artisans to learn the platform.
 *
 * - getAiPlatformTour - A function that returns a tailored interactive website tour based on user behavior and indicated support need.
 * - GetAiPlatformTourInput - The input type for the getAiPlatformTour function.
 * - GetAiPlatformTourOutput - The return type for the getAiPlatformTour function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetAiPlatformTourInputSchema = z.object({
  userBehavior: z
    .string()
    .describe(
      'A description of the user behavior on the platform, including pages visited, actions taken, and time spent on each page.'
    ),
  supportNeed: z
    .string()
    .describe(
      'A description of the user indicated support need, including questions asked, help articles viewed, and support tickets submitted.'
    ),
});
export type GetAiPlatformTourInput = z.infer<typeof GetAiPlatformTourInputSchema>;

const GetAiPlatformTourOutputSchema = z.object({
  tourSteps: z
    .array(z.string())
    .describe(
      'An array of strings, where each string is a step in the interactive website tour. The steps should be tailored to the user behavior and indicated support need.'
    ),
  additionalTips: z
    .array(z.string())
    .describe(
      'An array of strings, where each string is an additional tip or suggestion for the user. The tips should be tailored to the user behavior and indicated support need.'
    ),
});
export type GetAiPlatformTourOutput = z.infer<typeof GetAiPlatformTourOutputSchema>;

export async function getAiPlatformTour(input: GetAiPlatformTourInput): Promise<GetAiPlatformTourOutput> {
  return getAiPlatformTourFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAiPlatformTourPrompt',
  input: {schema: GetAiPlatformTourInputSchema},
  output: {schema: GetAiPlatformTourOutputSchema},
  prompt: `You are an AI-powered guide for a platform that helps artisans sell their crafts online.

You will use the following information to generate a tailored interactive website tour for the artisan, as well as some additional tips.

User Behavior: {{{userBehavior}}}
Support Need: {{{supportNeed}}}

Based on the user's behavior and support needs, generate an array of tour steps that will guide the user through the platform's features and functionalities.
Also generate an array of additional tips that will help the user get the most out of the platform.

Ensure the tour steps are clear, concise, and actionable.
Ensure the additional tips are relevant and helpful.

Output the tour steps and additional tips as JSON arrays of strings.`, safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    },
  ],
});

const getAiPlatformTourFlow = ai.defineFlow(
  {
    name: 'getAiPlatformTourFlow',
    inputSchema: GetAiPlatformTourInputSchema,
    outputSchema: GetAiPlatformTourOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
