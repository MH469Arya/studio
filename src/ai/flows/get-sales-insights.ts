'use server';

/**
 * @fileOverview Provides AI-driven sales insights and suggests optimal pricing strategies for artisans.
 *
 * - getSalesInsights - A function that generates sales insights.
 * - GetSalesInsightsInput - The input type for the getSalesInsights function.
 * - GetSalesInsightsOutput - The return type for the getSalesInsights function.
 */

import {ai} from '@/ai/genkit';
import {getSalesDataForProduct} from '@/ai/tools/get-sales-data';
import {z} from 'genkit';

const GetSalesInsightsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  artisanId: z.string().describe('The ID of the artisan.'),
  currentPrice: z.number().describe('The current price of the product.'),
  averageOrderValue: z.number().describe('The current average order value for the product.'),
  regionalDemand: z.string().describe('Information about the regional demand for the product.'),
  newItemVolume: z.number().describe('The number of new items created within a defined period.'),
});
export type GetSalesInsightsInput = z.infer<typeof GetSalesInsightsInputSchema>;

const GetSalesInsightsOutputSchema = z.object({
  insights: z.string().describe('Sales insights and optimal pricing strategies for the product.'),
  itemsSoldVolume: z.number().optional().describe('The number of items sold, if fetched.'),
});
export type GetSalesInsightsOutput = z.infer<typeof GetSalesInsightsOutputSchema>;

export async function getSalesInsights(input: GetSalesInsightsInput): Promise<GetSalesInsightsOutput> {
  return getSalesInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSalesInsightsPrompt',
  input: {schema: GetSalesInsightsInputSchema},
  output: {schema: GetSalesInsightsOutputSchema},
  tools: [getSalesDataForProduct],
  prompt: `You are an AI-powered sales analysis tool for artisans.

  Based on the following information, provide sales insights and suggest optimal pricing strategies for the product.

  To get the number of items sold, you MUST use the 'getSalesDataForProduct' tool. Do not ask the user for this information.

  Product Name: {{{productName}}}
  Artisan ID: {{{artisanId}}}
  Current Price: {{{currentPrice}}}
  Average Order Value: {{{averageOrderValue}}}
  Regional Demand: {{{regionalDemand}}}
  New Item Volume: {{{newItemVolume}}}

  Analyze this data and provide actionable insights to help the artisan make better decisions and increase sales.  If the volume of new items created exceeds the number of items sold, highlight this and suggest strategies to address the imbalance.
`,
});

const getSalesInsightsFlow = ai.defineFlow(
  {
    name: 'getSalesInsightsFlow',
    inputSchema: GetSalesInsightsInputSchema,
    outputSchema: GetSalesInsightsOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const toolResponse = llmResponse.toolRequests;

    // Note: The model may not always call the tool.
    let itemsSoldVolume: number | undefined;
    if (toolResponse.length > 0 && toolResponse[0].tool === 'getSalesDataForProduct') {
        const toolOutput = await toolResponse[0].run();
        if (toolOutput) {
            itemsSoldVolume = (toolOutput as any).itemsSoldVolume;
        }
    }
    
    const {output} = llmResponse;
    return {
        insights: output!.insights,
        itemsSoldVolume: itemsSoldVolume,
    };
  }
);
