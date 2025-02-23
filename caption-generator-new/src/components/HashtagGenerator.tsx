'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function HashtagGenerator() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const generateHashtags = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-hashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate hashtags');
      }

      const data = await response.json();
      setHashtags(data.hashtags);
      toast.success('Hashtags generated!');
    } catch (error) {
      toast.error('Failed to generate hashtags');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-200">
            Enter a topic or keyword
          </label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., photography, fitness, food"
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white shadow-sm p-3"
          />
        </div>

        <button
          onClick={generateHashtags}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-md py-3 font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Hashtags'}
        </button>
      </div>

      {hashtags.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag, index) => (
              <button
                key={index}
                onClick={() => copyToClipboard(hashtag)}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-200 hover:bg-gray-700 transition-colors"
              >
                {hashtag}
              </button>
            ))}
          </button>
          <button
            onClick={() => copyToClipboard(hashtags.join(' '))}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Copy All Hashtags
          </button>
        </div>
      )}
    </div>
  );
}
