'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { getSalesInsights } from '@/ai/flows/get-sales-insights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  productName: z.string().min(2),
  artisanId: z.string().min(1),
  currentPrice: z.coerce.number().positive(),
  averageOrderValue: z.coerce.number().positive(),
  regionalDemand: z.string().min(3),
  newItemVolume: z.coerce.number().int().min(0),
  itemsSoldVolume: z.coerce.number().int().min(0),
});

type FormValues = z.infer<typeof formSchema>;

export function SalesInsightsForm() {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInventoryAlert, setShowInventoryAlert] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: 'Handwoven Pashmina Shawl',
      artisanId: 'ART789',
      currentPrice: 8500,
      averageOrderValue: 9200,
      regionalDemand: 'High in North India, moderate in metropolitan areas',
      newItemVolume: 50,
      itemsSoldVolume: 35,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setInsights('');
    setShowInventoryAlert(false);

    if (values.newItemVolume > values.itemsSoldVolume) {
        setShowInventoryAlert(true);
    }

    try {
      const result = await getSalesInsights(values);
      setInsights(result.insights);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Insights',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Sales Data</CardTitle>
            <CardDescription>Provide your sales data to get AI-powered insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="productName" render={({ field }) => (
                        <FormItem><FormLabel>Product</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="artisanId" render={({ field }) => (
                        <FormItem><FormLabel>Artisan ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="currentPrice" render={({ field }) => (
                        <FormItem><FormLabel>Price (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="averageOrderValue" render={({ field }) => (
                        <FormItem><FormLabel>Avg. Order (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="newItemVolume" render={({ field }) => (
                        <FormItem><FormLabel>New Items</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="itemsSoldVolume" render={({ field }) => (
                        <FormItem><FormLabel>Items Sold</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="regionalDemand" render={({ field }) => (
                    <FormItem><FormLabel>Regional Demand</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Lightbulb />}
                  Get Insights
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle className="font-headline">Sales & Pricing Insights</CardTitle>
            <CardDescription>AI analysis of your sales data will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {showInventoryAlert && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Inventory Alert</AlertTitle>
                    <AlertDescription>
                        You've created more items than you've sold in this period. The AI insights may include strategies to address this.
                    </AlertDescription>
                </Alert>
             )}
            {isLoading ? (
                <div className="space-y-2 pt-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
                </div>
            ) : insights ? (
                <div className="prose prose-sm max-w-none text-foreground dark:prose-invert" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }} />
            ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Waiting for sales data...</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
