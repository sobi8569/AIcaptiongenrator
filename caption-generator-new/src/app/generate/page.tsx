import { Metadata } from 'next';
import CaptionGenerator from '@/components/CaptionGenerator';
import HashtagGenerator from '@/components/HashtagGenerator';

export const metadata: Metadata = {
  title: 'Generate Captions - AI Caption Generator',
  description: 'Create engaging social media captions and hashtags using AI.',
};

export default function GeneratePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10">
          Generate Your Content
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Caption Generator</h2>
            <CaptionGenerator />
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Hashtag Generator</h2>
            <HashtagGenerator />
          </div>
        </div>
      </div>
    </main>
  );
}
