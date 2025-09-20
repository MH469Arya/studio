import { AiGuideForm } from './_components/ai-guide-form';

export default function TourPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">AI-Powered Platform Guide</h2>
      </div>
      <AiGuideForm />
    </div>
  );
}
