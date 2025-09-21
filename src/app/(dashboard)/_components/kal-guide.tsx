'use client';

import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTour } from './tour-provider';

export function KalGuide() {
  const { startTour } = useTour();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-full"
      onClick={() => startTour()}
      id="kal-guide-trigger"
    >
      <Wand2 />
      <span className="sr-only">Start Website Tour</span>
    </Button>
  );
}
