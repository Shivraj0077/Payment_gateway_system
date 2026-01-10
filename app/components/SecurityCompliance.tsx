import { Lock, Key, FileCheck, Shield } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Tokenization',
    description: 'Sensitive card data never touches your servers. All credentials are tokenized at ingestion.',
  },
  {
    icon: Key,
    title: 'Encrypted Secrets',
    description: 'API keys and webhook secrets encrypted at rest using AES-256. Automatic rotation support.',
  },
  {
    icon: FileCheck,
    title: 'Signed Webhooks',
    description: 'Every webhook includes HMAC signature for verification. Prevent replay attacks with timestamps.',
  },
  {
    icon: Shield,
    title: 'HTTPS Enforced',
    description: 'TLS 1.3 required for all API communication. Certificate pinning available for mobile SDKs.',
  },
];

export function SecurityCompliance() {
  return (
    <section id="security" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl tracking-tight mb-4">Security & Compliance</h2>
          <p className="text-lg text-gray-600 mb-4">
            Built with security at every layer
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
            <Shield className="w-4 h-4" />
            <span>PCI-aligned architecture</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Regular third-party security audits • SOC 2 Type II in progress • 24/7 monitoring
          </p>
        </div>
      </div>
    </section>
  );
}
