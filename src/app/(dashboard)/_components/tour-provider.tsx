'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { useLanguage } from './language-provider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

const getTourSteps = (t: (text: string) => string): Step[] => [
  {
    target: '#nav-dashboard',
    title: t('Dashboard'),
    content: t('This is your main Dashboard, where you get an overview of your store.'),
    side: 'right',
    align: 'start',
  },
  {
    target: '#nav-orders',
    title: t('Orders'),
    content: t('Manage all your customer orders from this section.'),
    side: 'right',
    align: 'start',
  },
  {
    target: '#nav-my-products',
    title: t('My Products'),
    content: t('Here you can add, view, and edit all of your product listings.'),
    side: 'right',
    align: 'start',
  },
  {
    target: '#nav-ai-tools',
    title: t('AI Tools'),
    content: t('Explore powerful AI tools to help you with product descriptions, sales insights, and more!'),
    side: 'right',
    align: 'start',
  },
  {
    target: '#user-nav-trigger',
    title: t('Your Profile'),
    content: t('Access your profile, settings, and logout from here.'),
    side: 'left',
    align: 'end',
  },
  {
    target: '#kal-guide-trigger',
    title: t('KlaGuide'),
    content: t('You can restart this tour anytime by clicking this button!'),
    side: 'left',
    align: 'end',
  },
];

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const targetRef = useRef<HTMLElement | null>(null);

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
  
  const currentStep = isOpen ? steps[currentStepIndex] : null;

  useEffect(() => {
    let originalTargetZIndex: string | undefined;
    let targetElement: HTMLElement | null = null;
    
    if (currentStep) {
      targetElement = document.querySelector(currentStep.target) as HTMLElement;
      
      if (targetElement) {
        targetRef.current = targetElement;
        
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        
        const updateStyle = () => {
            if (!targetRef.current) return;
            const rect = targetRef.current.getBoundingClientRect();
            setSpotlightStyle({
                width: `${rect.width + 16}px`,
                height: `${rect.height + 16}px`,
                top: `${rect.top - 8}px`,
                left: `${rect.left - 8}px`,
            });
            originalTargetZIndex = targetRef.current.style.zIndex;
            targetRef.current.style.zIndex = '101';
            document.body.classList.add('tour-active');
        }

        const timer = setTimeout(updateStyle, 300); // Wait for scroll to finish
        window.addEventListener('resize', updateStyle);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateStyle);
            if (targetRef.current && originalTargetZIndex !== undefined) {
                targetRef.current.style.zIndex = originalTargetZIndex;
            }
            document.body.classList.remove('tour-active');
        }
      } else {
        // if target not found, go to next step
        goToNextStep();
      }
    } else {
        document.body.classList.remove('tour-active');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  return (
    <TourContext.Provider value={{ startTour }}>
      {isOpen && <div className="fixed inset-0 z-[99] bg-black/50" onClick={stopTour} />}
      {isOpen && currentStep && <div className="fixed z-[100] bg-background rounded-lg shadow-2xl transition-all duration-300 pointer-events-none" style={spotlightStyle} />}
      
      {children}

      {isOpen && currentStep && targetRef.current && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div 
                    className="fixed" 
                    style={{
                        ...spotlightStyle,
                        zIndex: 102
                    }}
                />
            </PopoverTrigger>
            <PopoverContent 
                side={currentStep.side} 
                align={currentStep.align}
                className="z-[103] w-80"
                onEscapeKeyDown={stopTour}
                onPointerDownOutside={(e) => {
                    if (targetRef.current && targetRef.current.contains(e.target as Node)) {
                       e.preventDefault();
                       return;
                    }
                    stopTour();
                }}
            >
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="font-medium leading-none">{currentStep.title}</h4>
                        <p className="text-sm text-muted-foreground">{currentStep.content}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                            {t('Step')} {currentStepIndex + 1} of {steps.length}
                        </span>
                        <div className="flex gap-2">
                        {currentStepIndex > 0 && (
                            <Button variant="outline" size="sm" onClick={goToPreviousStep}>
                                {t('Previous')}
                            </Button>
                        )}
                        <Button size="sm" onClick={goToNextStep}>
                            {currentStepIndex === steps.length - 1 ? t('Finish') : t('Next')}
                        </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
      )}
    </TourContext.Provider>
  );
};
