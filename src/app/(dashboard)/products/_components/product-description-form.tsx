'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2, Send } from 'lucide-react';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      craftsmanshipDetails: 'Hand-painted on circular or rectangular pieces of cloth or paper, featuring intricate details and natural colors.',
      culturalSignificance: 'A traditional playing card game from medieval India, often depicting stories from Hindu mythology like the Ramayana and Mahabharata.',
      targetAudience: 'Art collectors, history enthusiasts, and people looking for unique, cultural gift items.',
    },
  });

  useEffect(() => {
    const productName = searchParams.get('productName');
    const category = searchParams.get('category');
    if (productName) {
      form.setValue('productName', productName);
    }
    if (category) {
      form.setValue('targetAudience', `People interested in ${category}`);
    }
  }, [searchParams, form]);

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

  const handleAddDescription = () => {
    // This is a simplified way to pass state.
    // In a real app, you might use a shared state management library (like Zustand or Redux),
    // or pass the data via browser storage (localStorage/sessionStorage).
    // @ts-ignore
    window.descriptionFromAI = description;
    router.push('/my-products?fromAI=true');
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
                <div className="relative space-y-4">
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={12} className="bg-background" />
                    <Button
                        className="w-full"
                        onClick={handleAddDescription}
                    >
                        <Send />
                        Add Description to Product
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
