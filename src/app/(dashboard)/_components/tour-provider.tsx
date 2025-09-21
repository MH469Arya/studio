'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useLanguage } from './language-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TourContextType {
  startTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface Step {
  target: string;
  title: string;
  content: string;
}

const getTourSteps = (t: (text: string) => string): Step[] => [
  {
    target: '#nav-dashboard',
    title: t('Dashboard'),
    content: t('This is your main Dashboard, where you get an overview of your store.'),
  },
  {
    target: '#nav-orders',
    title: t('Orders'),
    content: t('Manage all your customer orders from this section.'),
  },
  {
    target: '#nav-my-products',
    title: t('My Products'),
    content: t('Here you can add, view, and edit all of your product listings.'),
  },
  {
    target: '#nav-ai-tools',
    title: t('AI Tools'),
    content: t('Explore powerful AI tools to help you with product descriptions, sales insights, and more!'),
  },
  {
    target: '#user-nav-trigger',
    title: t('Your Profile'),
    content: t('Access your profile, settings, and logout from here.'),
  },
  {
    target: '#kal-guide-trigger',
    title: t('KlaGuide'),
    content: t('You can restart this tour anytime by clicking this button!'),
  },
];

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const startTour = useCallback(() => {
    const tourSteps = getTourSteps(t);
    setSteps(tourSteps);
    setCurrentStepIndex(0);
    setIsOpen(true);
  }, [t]);

  const stopTour = () => {
    setIsOpen(false);
    setCurrentStepIndex(0);
    setSteps([]);
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      stopTour();
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const currentStep = steps[currentStepIndex];

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
      {isOpen && currentStep && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            className="tour-dialog"
            onEscapeKeyDown={stopTour}
            onPointerDownOutside={stopTour}
          >
            <DialogHeader>
              <DialogTitle>{currentStep.title}</DialogTitle>
              <DialogDescription>{currentStep.content}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between">
              <div>
                <span className="text-sm text-muted-foreground">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <div className="flex gap-2">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={goToPreviousStep}>
                    Previous
                  </Button>
                )}
                <Button onClick={goToNextStep}>
                  {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </TourContext.Provider>
  );
};
