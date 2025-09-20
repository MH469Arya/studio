'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

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

const tourSteps: Step[] = [
  {
    target: '#nav-dashboard',
    content: 'This is your main Dashboard, where you get an overview of your store.',
    title: 'Dashboard',
    disableBeacon: true,
  },
  {
    target: '#nav-orders',
    content: 'Manage all your customer orders from this section.',
    title: 'Orders',
  },
  {
    target: '#nav-my-products',
    content: 'Here you can add, view, and edit all of your product listings.',
    title: 'My Products',
  },
  {
    target: '#nav-ai-tools',
    content: 'Explore powerful AI tools to help you with product descriptions, sales insights, and more!',
    title: 'AI Tools',
  },
  {
    target: '#user-nav-trigger',
    content: 'Access your profile, settings, and logout from here.',
    title: 'Your Profile',
  },
  {
    target: '#kal-guide-trigger',
    content: 'You can restart this tour anytime by clicking this button!',
    title: 'KalGuide',
  },
];


export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const startTour = useCallback(() => {
    setRun(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRun(false);
    }
  };

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
      {isClient && (
        <Joyride
          steps={tourSteps}
          run={run}
          callback={handleJoyrideCallback}
          continuous
          showProgress
          showSkipButton
          styles={{
            options: {
              zIndex: 10000,
              primaryColor: '#D4A24E',
              arrowColor: '#F5F5DC',
              backgroundColor: '#F5F5DC',
              textColor: '#333'
            },
            tooltip: {
              fontFamily: 'Alegreya, serif',
              borderRadius: 'var(--radius)',
            },
            tooltipTitle: {
              fontFamily: 'Alegreya, serif',
              fontWeight: 'bold',
            },
             buttonClose: {
              display: 'none',
            },
          }}
        />
      )}
    </TourContext.Provider>
  );
};
