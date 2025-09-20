'use server';
/**
 * @fileOverview A flow for suggesting a price for a new product.
 *
 * - suggestProductPrice - A function that suggests a product price.
 * - SuggestProductPriceInput - The input type for the suggestProductPrice function.
 * - SuggestProductPriceOutput - The return type for the suggestProductPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductPriceInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  description: z.string().describe('The description of the product.'),
  category: z.string().describe('The category of the product.'),
});
export type SuggestProductPriceInput = z.infer<typeof SuggestProductPriceInputSchema>;

const SuggestProductPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested retail price for the product in Indian Rupees (INR).'),
  justification: z.string().describe('A brief justification for the suggested price, considering the product details and Indian market context.'),
});
export type SuggestProductPriceOutput = z.infer<typeof SuggestProductPriceOutputSchema>;

export async function suggestProductPrice(input: SuggestProductPriceInput): Promise<SuggestProductPriceOutput> {
  return suggestProductPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductPricePrompt',
  input: {schema: SuggestProductPriceInputSchema},
  output: {schema: SuggestProductPriceOutputSchema},
  prompt: `You are an expert pricing analyst for artisanal crafts in the Indian market. Your goal is to suggest a competitive and fair price for a new product based on its details.

  Analyze the following product information:
  Product Name: {{{productName}}}
  Description: {{{description}}}
  Category: {{{category}}}

  Based on this information, suggest a retail price in Indian Rupees (INR). Also, provide a short justification for your suggestion, considering factors like perceived value, craftsmanship, materials (if mentioned), category norms, and target audience within India. The price should be a number only.
`,
});

const suggestProductPriceFlow = ai.defineFlow(
  {
    name: 'suggestProductPriceFlow',
    inputSchema: SuggestProductPriceInputSchema,
    outputSchema: SuggestProductPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
