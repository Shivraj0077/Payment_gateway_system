import { ArrowRight, FileText } from 'lucide-react';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl tracking-tight mb-6">
              Payment infrastructure built for precision
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A unified API layer for accepting, processing, and reconciling payments. 
              Designed for reliability, transparency, and clean integration.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium">
                Start Integration
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4" />
                View Docs
              </button>
            </div>
            <div className="mt-12 flex items-center gap-8 text-sm text-gray-500">
              <div>
                <div className="text-2xl font-semibold text-gray-900">99.99%</div>
                <div>Uptime SLA</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">&lt;200ms</div>
                <div>Avg. Latency</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">Global</div>
                <div>Infrastructure</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <HeroVisual />
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium">API Status: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}