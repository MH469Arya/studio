'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HelpCircle, Loader2, Navigation, Wand2 } from 'lucide-react';
import { getAiPlatformTour, GetAiPlatformTourOutput } from '@/ai/flows/get-ai-platform-tour';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  userBehavior: z.string().min(10, { message: 'Please describe user behavior.' }),
  supportNeed: z.string().min(10, { message: 'Please describe the support need.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function AiGuideForm() {
  const [tour, setTour] = useState<GetAiPlatformTourOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userBehavior: 'User spent 5 minutes on the dashboard, visited the "Add Product" page but did not complete the form. Clicked on the "Orders" tab twice.',
      supportNeed: 'Viewed the help article "How to set up shipping?" and searched for "international shipping rates".',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setTour(null);
    try {
      const result = await getAiPlatformTour(values);
      setTour(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Guide',
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
            <CardTitle className="font-headline">User Context</CardTitle>
            <CardDescription>This data is automatically collected to personalize your guide.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="userBehavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Behavior Summary</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Visited dashboard, tried to add product..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supportNeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicated Support Need</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Searched for 'payment options'..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                  Generate My Personal Guide
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle className="font-headline">Your Personalized Guide</CardTitle>
            <CardDescription>Follow these steps and tips to get the most out of KalConnect.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center"><Navigation className="w-4 h-4 mr-2"/> Interactive Tour Steps</h3>
              {isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-muted rounded animate-pulse w-full"></div>)}
                </div>
              ) : tour?.tourSteps ? (
                <ol className="space-y-2 list-inside">
                    {tour.tourSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                           <Badge variant="outline" className="mr-3 mt-1">{index+1}</Badge>
                           <span className="text-sm">{step}</span>
                        </li>
                    ))}
                </ol>
              ) : <p className="text-sm text-muted-foreground text-center py-10">Generate a guide to see your personalized tour.</p>}
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center"><HelpCircle className="w-4 h-4 mr-2"/> Additional Tips</h3>
              {isLoading ? (
                <div className="space-y-3">
                     {[...Array(2)].map((_, i) => <div key={i} className="h-8 bg-muted rounded animate-pulse w-full"></div>)}
                </div>
              ) : tour?.additionalTips ? (
                <ul className="space-y-2 list-inside list-disc">
                    {tour.additionalTips.map((tip, index) => (
                        <li key={index} className="text-sm ml-4">{tip}</li>
                    ))}
                </ul>
              ) : <p className="text-sm text-muted-foreground text-center py-10">Generate a guide to see additional tips.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
