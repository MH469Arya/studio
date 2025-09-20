'use server';

/**
 * @fileOverview A flow for generating compelling product descriptions using AI.
 *
 * - generateProductDescription - A function that generates a product description.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  craftsmanshipDetails: z.string().describe('Details about the craftsmanship involved in making the product.'),
  culturalSignificance: z.string().describe('The cultural significance of the product.'),
  targetAudience: z.string().describe('Description of the ideal customer for this product.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('A compelling product description that highlights the craftsmanship and cultural significance of the product.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in crafting compelling product descriptions for artisan crafts. Your goal is to highlight the craftsmanship and cultural significance of each product to attract more customers.

  Product Name: {{{productName}}}
  Craftsmanship Details: {{{craftsmanshipDetails}}}
  Cultural Significance: {{{culturalSignificance}}}
  Target Audience: {{{targetAudience}}}

  Write a product description that is engaging, informative, and persuasive. Focus on the unique aspects of the product and its appeal to the target audience. The description should be no more than 150 words.
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
