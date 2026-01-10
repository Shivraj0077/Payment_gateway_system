import { ArrowRight } from 'lucide-react';

const flowSteps = [
  { label: 'Client', sublabel: 'Request' },
  { label: 'API', sublabel: 'Validate' },
  { label: 'Processing', sublabel: 'Execute' },
  { label: 'Events', sublabel: 'Emit' },
  { label: 'Ledger', sublabel: 'Record' },
  { label: 'Webhooks', sublabel: 'Notify' },
];

export function PaymentFlow() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl tracking-tight mb-4">How payments flow</h2>
          <p className="text-lg text-gray-600">Every transaction follows a predictable, observable path</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          {flowSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center mb-2 shadow-lg">
                  <div className="text-white font-semibold text-sm mb-1">{step.label}</div>
                  <div className="text-gray-300 text-xs">{step.sublabel}</div>
                </div>
              </div>
              {index < flowSteps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-gray-400 hidden md:block flex-shrink-0" />
              )}
              {index < flowSteps.length - 1 && (
                <div className="w-px h-8 bg-gray-300 md:hidden"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
