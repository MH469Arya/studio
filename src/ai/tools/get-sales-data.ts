
'use server';

import { ai } from '@/ai/genkit';
import { getSalesVolumeForProduct } from '@/services/orders-service';
import { z } from 'genkit';

export const getSalesDataForProduct = ai.defineTool(
    {
        name: 'getSalesDataForProduct',
        description: 'Get sales data for a specific product from the order history.',
        inputSchema: z.object({
            productName: z.string().describe('The name of the product to get sales data for.'),
        }),
        outputSchema: z.object({
            itemsSoldVolume: z.number().describe('The total number of units sold for the product.'),
        }),
    },
    async (input) => {
        const itemsSoldVolume = await getSalesVolumeForProduct(input.productName);
        return {
            itemsSoldVolume,
        };
    }
);
