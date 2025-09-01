import React, { useState } from 'react';
import { Copy, Check, Terminal, Book, Users } from 'lucide-react';

const GettingStarted = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const codeExamples = [
    {
      title: 'Initialize Project',
      code: 'gradle init --type java-application'
    },
    {
      title: 'Build Project',
      code: './gradlew build'
    },
    {
      title: 'Run Tests',
      code: './gradlew test'
    },
    {
      title: 'Create Distribution',
      code: './gradlew distZip'
    }
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jump right in with these simple commands. No complex setup required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Code examples */}
          <div className="space-y-4">
            {codeExamples.map((example, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    {example.title}
                  </span>
                </div>
                <div className="relative bg-gray-900 rounded-lg p-4 group-hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <code className="text-green-400 font-mono text-sm">
                      {example.code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(example.code, index)}
                      className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedIndex === index ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-8 rounded-2xl text-white">
              <Terminal className="w-12 h-12 mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">Ready to Build?</h3>
              <p className="mb-6 opacity-90">
                Start your first project with our comprehensive getting started guide.
              </p>
              <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Quick Start Guide
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                <Book className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                <p className="text-sm text-gray-600">Complete guides and API reference</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                <Users className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
                <p className="text-sm text-gray-600">Get help from our developer community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Join Millions of Developers
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trusted by teams at Google, Netflix, LinkedIn, and thousands of other companies worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Download Now
            </button>
            <button className="text-teal-600 hover:text-teal-700 font-semibold text-lg transition-colors">
              View on GitHub →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;