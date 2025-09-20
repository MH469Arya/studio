'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2 } from 'lucide-react';
import { discoverTrendingCrafts, DiscoverTrendingCraftsOutput } from '@/ai/flows/discover-trending-crafts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../../_components/language-provider';

const formSchema = z.object({
  recentSalesData: z.string().min(20, { message: 'Please provide more sales data.' }),
  consumerFeedback: z.string().min(20, { message: 'Please provide more consumer feedback.' }),
  demographicData: z.string().min(20, { message: 'Please provide more demographic data.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function TrendingCraftsForm() {
  const [trends, setTrends] = useState<DiscoverTrendingCraftsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recentSalesData: 'Sold 50 units of block-printed textiles in Mumbai, 30 units of terracotta jewelry in Delhi. Best-sellers are items under ₹1500.',
      consumerFeedback: 'Customers love the vibrant colors and traditional motifs. Some reviews mention that shipping is slow. Requests for more home decor items.',
      demographicData: 'Primary audience is women aged 25-45 in metro cities. Growing interest from international buyers in the US and UK.',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setTrends(null);
    try {
      const result = await discoverTrendingCrafts(values);
      setTrends(result);
    } catch (error) {
      console.error(error);
      toast({
        title: t('Error Discovering Trends'),
        description: t('An unexpected error occurred. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderInsightCard = (title: string, content: string | undefined) => (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">{t(title)}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
            </div>
        ) : (
            <p className="text-sm text-muted-foreground">{content ? t(content) : ''}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t('Market Data')}</CardTitle>
            <CardDescription>{t('Enter market data to discover trending crafts.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="recentSalesData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Recent Sales Data')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Summarize recent sales..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consumerFeedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Consumer Feedback')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Summarize customer reviews, feedback..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demographicData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Demographic Data')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your customer demographics..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  {t('Discover Trends')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3">
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('Market Insights')}</CardTitle>
                <CardDescription>{t('AI-generated insights on craft market trends.')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {renderInsightCard("Trending Crafts", trends?.trendingCrafts)}
                {renderInsightCard("Consumer Preferences", trends?.consumerPreferences)}
                {renderInsightCard("Market Gaps", trends?.marketGaps)}
                {renderInsightCard("Regional Demand", trends?.regionalDemand)}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
