'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HelpCircle, Loader2, Navigation, Wand2 } from 'lucide-react';
import { getAiPlatformTour, GetAiPlatformTourOutput } from '@/ai/flows/get-ai-platform-tour';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  userBehavior: z.string().min(10, { message: 'Please describe user behavior.' }),
  supportNeed: z.string().min(10, { message: 'Please describe the support need.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function KalGuide() {
  const [tour, setTour] = useState<GetAiPlatformTourOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Wand2 />
          <span className="sr-only">Open KalGuide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Wand2 className="text-primary" />
            KalGuide
          </DialogTitle>
          <DialogDescription>
            Your personal AI-powered guide to the platform. Tell me what you need help with.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Left side: Form */}
            <div>
                 <h3 className="font-semibold mb-2">Your Context</h3>
                 <p className="text-sm text-muted-foreground mb-4">This data can be automatically collected to personalize your guide. For this demo, you can edit it.</p>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="userBehavior"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-xs">Behavior Summary</FormLabel>
                        <FormControl>
                            <Textarea {...field} rows={4} className="text-xs" />
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
                        <FormLabel className="text-xs">What do you need help with?</FormLabel>
                        <FormControl>
                            <Textarea {...field} rows={4} className="text-xs" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="mr-2" />
                          Generate My Guide
                        </>
                      )}
                    </Button>
                </form>
                </Form>
            </div>
            {/* Right side: Results */}
            <ScrollArea className="h-96 pr-4">
                 <div className="space-y-6">
                    <div>
                    <h3 className="font-semibold mb-2 flex items-center"><Navigation className="w-4 h-4 mr-2 text-primary"/> Interactive Tour</h3>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => <div key={i} className="flex items-start space-x-3">
                                <div className="h-6 w-6 bg-muted rounded-full animate-pulse"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-5/6 mt-1"></div>
                            </div>)}
                        </div>
                    ) : tour?.tourSteps ? (
                        <ol className="space-y-3">
                            {tour.tourSteps.map((step, index) => (
                                <li key={index} className="flex items-start">
                                <Badge variant="outline" className="mr-3 mt-1 flex-shrink-0 h-6 w-6 flex items-center justify-center">{index+1}</Badge>
                                <span className="text-sm">{step}</span>
                                </li>
                            ))}
                        </ol>
                    ) : <p className="text-sm text-muted-foreground text-center py-10">Generate a guide to see your personalized tour.</p>}
                    </div>
                    <div>
                    <h3 className="font-semibold mb-2 flex items-center"><HelpCircle className="w-4 h-4 mr-2 text-primary"/> Additional Tips</h3>
                    {isLoading && !tour ? (
                         <div className="space-y-3">
                           {[...Array(2)].map((_, i) => <div key={i} className="flex items-start space-x-3">
                                <div className="h-4 w-4 bg-muted rounded-full animate-pulse mt-1"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-4/6 mt-1"></div>
                            </div>)}
                        </div>
                    ) : tour?.additionalTips ? (
                        <ul className="space-y-2 list-inside list-disc">
                            {tour.additionalTips.map((tip, index) => (
                                <li key={index} className="text-sm ml-4">{tip}</li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-muted-foreground text-center py-10">Generate a guide to see additional tips.</p>}
                    </div>
                 </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
