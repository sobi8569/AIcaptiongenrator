import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Caption Generator - Create Engaging Social Media Captions',
  description: 'Generate perfect captions for your social media posts with AI. Support for Instagram, TikTok, YouTube, and Twitter.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background animation container */}
        <div id="bgNumbers" className="absolute inset-0 opacity-10" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
              Create Perfect Social Media Captions
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Generate engaging captions and trending hashtags for all your social media posts in seconds
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Link
                href="/generate"
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors"
              >
                Start Creating
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-3 bg-gray-800 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-700 rounded-lg">
              <div className="text-emerald-400 text-3xl mb-4">
                <i className="fas fa-magic"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Captions</h3>
              <p className="text-gray-300">
                Generate engaging captions tailored to your content and brand voice
              </p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <div className="text-emerald-400 text-3xl mb-4">
                <i className="fas fa-hashtag"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trending Hashtags</h3>
              <p className="text-gray-300">
                Get relevant and trending hashtags to increase your post's reach
              </p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <div className="text-emerald-400 text-3xl mb-4">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Generation</h3>
              <p className="text-gray-300">
                Create multiple captions in seconds and pick your favorite
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Supported Platforms</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="platform-badge">
              <i className="fab fa-instagram text-2xl"></i>
              <span>Instagram</span>
            </div>
            <div className="platform-badge">
              <i className="fab fa-tiktok text-2xl"></i>
              <span>TikTok</span>
            </div>
            <div className="platform-badge">
              <i className="fab fa-youtube text-2xl"></i>
              <span>YouTube</span>
            </div>
            <div className="platform-badge">
              <i className="fab fa-twitter text-2xl"></i>
              <span>Twitter</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
