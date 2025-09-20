'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Megaphone, Loader2, Check } from 'lucide-react';
import { getMarketingIdeas } from '@/ai/flows/get-marketing-ideas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useLanguage } from '../../_components/language-provider';

const formSchema = z.object({
  eventDetails: z.string().min(10, { message: 'Please provide more event details.' }),
  artisanProducts: z.string().min(10, { message: 'Please describe your products.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function MarketingIdeasForm() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDetails: 'Diwali Mela in Delhi, focusing on festive gifts and home decor.',
      artisanProducts: 'Handmade clay diyas, bandhanwar (door hangings) with mirror work, and painted terracotta statues of Ganesha and Lakshmi.',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setIdeas([]);
    try {
      const result = await getMarketingIdeas(values);
      setIdeas(result.marketingIdeas);
    } catch (error) {
      console.error(error);
      toast({
        title: t('Error Generating Ideas'),
        description: t('An unexpected error occurred. Please try again.'),
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
            <CardTitle className="font-headline">{t('Event & Product Info')}</CardTitle>
            <CardDescription>{t('Describe the event and your products to get marketing ideas.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="eventDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Event Details')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Local craft fair, online festival" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="artisanProducts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Your Products')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Hand-painted pottery, woven scarves" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Megaphone />}
                  {t('Get Marketing Ideas')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle className="font-headline">{t('Marketing Ideas')}</CardTitle>
            <CardDescription>{t('Your AI-generated marketing ideas will appear below.')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
                            <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                        </div>
                    ))}
                </div>
            ) : ideas.length > 0 ? (
                <ul className="space-y-3">
                    {ideas.map((idea, index) => (
                        <li key={index} className="flex items-start">
                           <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-3" />
                           <span className="text-sm">{t(idea)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">{t('Waiting for event and product info...')}</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
