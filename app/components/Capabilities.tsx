import { Zap, Shield, Webhook, Book } from 'lucide-react';

const capabilities = [
  {
    icon: Zap,
    title: 'Unified Payments API',
    description: 'Single integration for cards, bank transfers, and wallets. Abstract provider complexity with a consistent interface.',
  },
  {
    icon: Shield,
    title: 'Idempotent & Safe Requests',
    description: 'Built-in idempotency keys prevent duplicate charges. Retry safely without side effects.',
  },
  {
    icon: Webhook,
    title: 'Webhooks & Event-driven Flow',
    description: 'Real-time event notifications with automatic retries and signature verification. Build reactive systems.',
  },
  {
    icon: Book,
    title: 'Ledger-based Accounting',
    description: 'Double-entry ledger tracking for every transaction. Immutable audit trail with automatic reconciliation.',
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl tracking-tight mb-4">Built for scale and reliability</h2>
          <p className="text-lg text-gray-600">
            Core primitives designed to handle complexity without compromising on developer experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {capabilities.map((capability, index) => (
            <div key={index} className="bg-white rounded-xl p-8 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-6">
                <capability.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
              <p className="text-gray-600 leading-relaxed">{capability.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
