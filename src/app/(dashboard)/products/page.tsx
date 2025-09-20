'use client';

import { ProductDescriptionForm } from './_components/product-description-form';
import { useLanguage } from '../_components/language-provider';

export default function ProductsPage() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">{t('AI Product Descriptions')}</h2>
      </div>
      <ProductDescriptionForm />
    </div>
  );
}
