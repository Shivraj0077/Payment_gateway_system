import { ArrowRight, Code2 } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl tracking-tight mb-6">
          Begin integrating
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Start building with production-ready APIs. Full documentation and sandbox access included.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
            Get API Keys
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
            <Code2 className="w-5 h-5" />
            Explore the Platform
          </button>
        </div>
        <div className="pt-16 border-t border-gray-200">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Documentation</a>
            <a href="#" className="hover:text-gray-900 transition-colors">API Reference</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Status</a>
            <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
          </div>
          <div className="mt-8 text-sm text-gray-400">
            © 2026 Vortex. Infrastructure for modern payments.
          </div>
        </div>
      </div>
    </section>
  );
}
