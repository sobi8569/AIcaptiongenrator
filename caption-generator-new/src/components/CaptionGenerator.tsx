'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

type Tone = 'Funny' | 'Professional' | 'Casual' | 'Motivational' | 'Salesy';

export default function CaptionGenerator() {
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState<Tone>('Casual');
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');

  const generateCaption = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, tone }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data = await response.json();
      setCaption(data.caption);
      toast.success('Caption generated!');
    } catch (error) {
      toast.error('Failed to generate caption');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-200">
            What's your post about?
          </label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., sunset at the beach, new product launch"
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white shadow-sm p-3"
          />
        </div>

        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-200">
            Select the tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white shadow-sm p-3"
          >
            <option value="Casual">Casual</option>
            <option value="Professional">Professional</option>
            <option value="Funny">Funny</option>
            <option value="Motivational">Motivational</option>
            <option value="Salesy">Salesy</option>
          </select>
        </div>

        <button
          onClick={generateCaption}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-md py-3 font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Caption'}
        </button>
      </div>

      {caption && (
        <div className="mt-6 p-4 bg-gray-800 rounded-md">
          <p className="text-gray-200">{caption}</p>
          <button
            onClick={copyToClipboard}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
