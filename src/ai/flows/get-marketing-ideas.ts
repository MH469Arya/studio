'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating marketing ideas tailored for artisans for upcoming events and festivals.
 *
 * - getMarketingIdeas - A function that takes event details and artisan product information to generate marketing ideas.
 * - GetMarketingIdeasInput - The input type for the getMarketingIdeas function.
 * - GetMarketingIdeasOutput - The return type for the getMarketingIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMarketingIdeasInputSchema = z.object({
  eventDetails: z.string().describe('Details about the upcoming event or festival, including name, date, and theme.'),
  artisanProducts: z.string().describe('Information about the artisan\'s products, including descriptions, materials, and cultural significance.'),
});
export type GetMarketingIdeasInput = z.infer<typeof GetMarketingIdeasInputSchema>;

const GetMarketingIdeasOutputSchema = z.object({
  marketingIdeas: z.array(z.string()).describe('A list of AI-generated marketing ideas tailored for the artisan and the event.'),
});
export type GetMarketingIdeasOutput = z.infer<typeof GetMarketingIdeasOutputSchema>;

export async function getMarketingIdeas(input: GetMarketingIdeasInput): Promise<GetMarketingIdeasOutput> {
  return getMarketingIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getMarketingIdeasPrompt',
  input: {schema: GetMarketingIdeasInputSchema},
  output: {schema: GetMarketingIdeasOutputSchema},
  prompt: `You are a marketing expert specializing in promoting artisanal products at events and festivals.

  Based on the event details and the artisan's product information, generate a list of marketing ideas to help the artisan effectively promote their products and reach a wider audience.

  Event Details: {{{eventDetails}}}
  Artisan Products: {{{artisanProducts}}}

  Provide a list of diverse and creative marketing ideas. Each idea should be concise and actionable.

  Example:
  - Create a visually appealing booth showcasing the cultural significance of the products.
  - Offer interactive demonstrations of the crafting process to engage attendees.
  - Partner with local influencers to promote the products on social media.
  `,
});

const getMarketingIdeasFlow = ai.defineFlow(
  {
    name: 'getMarketingIdeasFlow',
    inputSchema: GetMarketingIdeasInputSchema,
    outputSchema: GetMarketingIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
