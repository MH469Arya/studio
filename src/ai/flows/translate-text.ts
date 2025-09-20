'use server';
/**
 * @fileOverview A flow for translating text from English to Hindi.
 *
 * - translateText - A function that translates text.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  texts: z.array(z.string()).describe('The English texts to translate.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslationPairSchema = z.object({
  english: z.string().describe('The original English text.'),
  hindi: z.string().describe('The Hindi translation.'),
});

const TranslateTextOutputSchema = z.object({
  translations: z
    .array(TranslationPairSchema)
    .describe('An array of translation pairs.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `You are a professional translator. Translate the following English texts to Hindi.
Return the result as a JSON object containing a 'translations' array. Each item in the array should be an object with 'english' and 'hindi' keys.

English Texts:
{{#each texts}}
- "{{this}}"
{{/each}}
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    if (input.texts.length === 0) {
      return { translations: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
