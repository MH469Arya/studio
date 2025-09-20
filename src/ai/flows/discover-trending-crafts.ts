'use server';
/**
 * @fileOverview An AI agent that provides insights on current market trends and consumer preferences in the craft industry.
 *
 * - discoverTrendingCrafts - A function that returns the trending crafts.
 * - DiscoverTrendingCraftsInput - The input type for the discoverTrendingCrafts function.
 * - DiscoverTrendingCraftsOutput - The return type for the discoverTrendingCrafts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverTrendingCraftsInputSchema = z.object({
  recentSalesData: z
    .string()
    .describe(
      'A summary of the recent sales data, including product types, quantities sold, and regions.'
    ),
  consumerFeedback: z
    .string()
    .describe(
      'A collection of recent customer feedback, reviews, and survey responses related to craft products.'
    ),
  demographicData: z
    .string()
    .describe(
      'Demographic data of craft consumers, including age, location, and income level.'
    ),
});
export type DiscoverTrendingCraftsInput = z.infer<
  typeof DiscoverTrendingCraftsInputSchema
>;

const DiscoverTrendingCraftsOutputSchema = z.object({
  trendingCrafts: z
    .string()
    .describe(
      'A summary of the current trending crafts, including specific product types and styles.'
    ),
  consumerPreferences: z
    .string()
    .describe(
      'An analysis of consumer preferences, including popular materials, colors, and design elements.'
    ),
  marketGaps: z
    .string()
    .describe(
      'Identification of gaps in the market, where demand is not being adequately met by current offerings.'
    ),
  regionalDemand: z
    .string()
    .describe(
      'An overview of regional demand for different types of crafts, highlighting areas with high growth potential.'
    ),
});
export type DiscoverTrendingCraftsOutput = z.infer<
  typeof DiscoverTrendingCraftsOutputSchema
>;

export async function discoverTrendingCrafts(
  input: DiscoverTrendingCraftsInput
): Promise<DiscoverTrendingCraftsOutput> {
  return discoverTrendingCraftsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discoverTrendingCraftsPrompt',
  input: {schema: DiscoverTrendingCraftsInputSchema},
  output: {schema: DiscoverTrendingCraftsOutputSchema},
  prompt: `You are an expert market analyst in the craft industry.

You will analyze the provided data to identify current market trends and consumer preferences.
Based on your analysis, you will provide insights into trending crafts, consumer preferences,
market gaps, and regional demand.

Recent Sales Data: {{{recentSalesData}}}
Consumer Feedback: {{{consumerFeedback}}}
Demographic Data: {{{demographicData}}}

Your analysis should be detailed and actionable, providing artisans with valuable information
to guide their product development and marketing strategies.`,
});

const discoverTrendingCraftsFlow = ai.defineFlow(
  {
    name: 'discoverTrendingCraftsFlow',
    inputSchema: DiscoverTrendingCraftsInputSchema,
    outputSchema: DiscoverTrendingCraftsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
