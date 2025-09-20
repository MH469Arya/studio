'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Copy, Wand2, Loader2 } from 'lucide-react';
import { generateProductDescription } from '@/ai/flows/generate-product-descriptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  productName: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
  craftsmanshipDetails: z.string().min(10, { message: 'Please provide more detail about craftsmanship.' }),
  culturalSignificance: z.string().min(10, { message: 'Please provide more detail about cultural significance.' }),
  targetAudience: z.string().min(5, { message: 'Describe your target audience.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductDescriptionForm() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      craftsmanshipDetails: '',
      culturalSignificance: '',
      targetAudience: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setDescription('');
    try {
      const result = await generateProductDescription(values);
      setDescription(result.productDescription);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Description',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast({
        title: 'Copied to clipboard!',
        description: 'The product description has been copied.',
    })
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Product Details</CardTitle>
            <CardDescription>Enter your product information to generate a description.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hand-painted Madhubani Saree" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="craftsmanshipDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Craftsmanship Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Woven with pure silk, natural dyes, intricate fish and peacock motifs..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="culturalSignificance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cultural Significance</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Represents stories from ancient Indian epics, a symbol of tradition..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Art lovers, collectors of ethnic wear" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                  Generate Description
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle className="font-headline">Generated Description</CardTitle>
            <CardDescription>Your AI-crafted product description will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
                </div>
            ) : description ? (
                <div className="relative">
                    <Textarea value={description} readOnly rows={14} className="bg-background" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleCopy}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Waiting for product details...</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
