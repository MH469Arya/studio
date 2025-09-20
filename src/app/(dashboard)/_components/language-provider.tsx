'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useTransition } from 'react';
import { translateText } from '@/ai/flows/translate-text';

type Locale = 'en' | 'hi';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleSetLocale = (newLocale: Locale) => {
    startTransition(() => {
        setLocale(newLocale);
    });
  };

  const t = useCallback((text: string): string => {
    if (locale === 'en') {
      return text;
    }
    return translations[text] || text;
  }, [locale, translations]);

  const translateAndStore = useCallback(async (texts: string[]) => {
    const textsToTranslate = texts.filter(text => !translations[text] && text);
    if (textsToTranslate.length === 0) return;

    try {
        const uniqueTexts = Array.from(new Set(textsToTranslate));
        const newTranslations: Record<string, string> = {};
        
        await Promise.all(uniqueTexts.map(async (text) => {
            const result = await translateText({ text });
            if (result.translation) {
                newTranslations[text] = result.translation;
            }
        }));

        setTranslations(prev => ({ ...prev, ...newTranslations }));

    } catch (error) {
      console.error('Translation error:', error);
    }
  }, [translations]);


  useEffect(() => {
    if (locale === 'hi') {
      // Collect all text that needs to be translated from the entire app
      const textsToTranslate: string[] = [
        // Main Nav
        'Dashboard', 'Orders', 'My Products', 'AI Tools', 
        'Product Descriptions', 'Sales Insights', 'Trending Crafts', 'Marketing Coach',
        // User Nav
        'Artisan Kumar', 'artisan.kumar@example.com', 'Profile', 'Settings', 'Choose Language', 'English', 'Hindi', 'Support', 'Log out',
        // Dashboard Page
        'Welcome to KalConnect', 'Empowering artisans, connecting cultures. Here are your tools for success.',
        'Manage Orders', 'View and process your incoming orders efficiently.', 'Go to Orders',
        'Analyze Sales', 'Get AI-powered insights into your sales performance.', 'Go to Sales',
        'Create Descriptions', 'Generate compelling product descriptions with AI.', 'Go to Products',
        // Marketing Page
        'Marketing Coach', 'Event & Product Info', 'Describe the event and your products to get marketing ideas.',
        'Event Details', 'Your Products', 'Get Marketing Ideas', 'Marketing Ideas', 'Your AI-generated marketing ideas will appear below.',
        'Waiting for event and product info...', 'Error Generating Ideas', 'An unexpected error occurred. Please try again.',
        // My Products Page
        'My Products', 'Add New Product', 'Add New Product', 'Fill in the details below to add a new product to your inventory.',
        'Product Name', 'Category', 'Description', 'Generate with AI', 'Image URL', 'Price', 'Suggest Price',
        'Missing Information', 'Please fill out the Product Name, Description, and Category before suggesting a price.',
        'Error Suggesting Price', 'Suggested Price: ₹', 'Apply this price', 'Stock', 'Add Product', 'Stock: ', 'Category: ',
        'Edit Product', "Update the details for your product. Click save when you're done.", 'Remove Product', 'Save Changes',
        // Orders Page
        'Manage and track your recent orders.', 'Filter Status', 'Filter by status', 'Order ID', 'Customer', 'Product', 'Date', 'Status', 'Total', 'Actions',
        'View Details', 'Print Invoice', 'No orders found.', 'Previous', 'Next', 'Fulfilled', 'Shipped', 'Processing', 'Pending', 'Cancelled',
        // Product Descriptions Page
        'AI Product Descriptions', 'Product Details', 'Enter your product information to generate a description.',
        'Craftsmanship Details', 'Cultural Significance', 'Target Audience', 'Generate Description', 'Error Generating Description',
        'Generated Description', 'Your AI-crafted product description will appear here.', 'Add Description to Product',
        'Waiting for product details...',
        // Sales Insights Page
        'Sales Insights Tool', 'Sales Data', 'Provide your sales data to get AI-powered insights.', 'Product', 'Artisan ID',
        'Price (₹)', 'Avg. Order (₹)', 'New Items', 'Items Sold', 'Regional Demand', 'Get Insights', 'Error Generating Insights',
        'Sales & Pricing Insights', 'AI analysis of your sales data will appear here.', 'Inventory Alert',
        "You've created more items than you've sold in this period. The AI insights may include strategies to address this.",
        'Waiting for sales data...',
        // Trending Crafts Page
        'Trending Craft Insights', 'Market Data', 'Enter market data to discover trending crafts.',
        'Recent Sales Data', 'Consumer Feedback', 'Demographic Data', 'Discover Trends', 'Error Discovering Trends',
        'Market Insights', 'AI-generated insights on craft market trends.', 'Trending Crafts', 'Consumer Preferences', 'Market Gaps', 'Regional Demand',
        // Tour provider
        'This is your main Dashboard, where you get an overview of your store.', 'Dashboard',
        'Manage all your customer orders from this section.', 'Orders',
        'Here you can add, view, and edit all of your product listings.', 'My Products',
        'Explore powerful AI tools to help you with product descriptions, sales insights, and more!', 'AI Tools',
        'Access your profile, settings, and logout from here.', 'Your Profile',
        'You can restart this tour anytime by clicking this button!', 'KalGuide'
      ];
      translateAndStore(textsToTranslate);
    }
  }, [locale, translateAndStore]);


  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
