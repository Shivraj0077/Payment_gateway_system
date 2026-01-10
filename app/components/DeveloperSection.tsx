"use client"

import { Copy, Check } from 'lucide-react';
import React from 'react';
import { useState } from 'react';

const codeSnippet = `// Create a payment intent
const payment = await vortex.payments.create({
  amount: 5000,
  currency: 'usd',
  customer: 'cus_abc123',
  idempotency_key: 'order_xyz789',
  metadata: {
    order_id: 'xyz789',
    source: 'web_checkout'
  }
});

// Handle response
if (payment.status === 'succeeded') {
  await fulfillOrder(payment.id);
}

// Listen for events
vortex.webhooks.on('payment.succeeded', async (event) => {
  await updateLedger(event.data);
});`;

export function DeveloperSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl tracking-tight mb-4">Built for developers</h2>
            <p className="text-lg text-gray-600 mb-6">
              Predictable APIs with clear error handling. TypeScript-first with comprehensive documentation.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                <span>Strongly typed SDK with autocomplete</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                <span>Detailed error codes and recovery strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                <span>Interactive API reference with live examples</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                <span>Test mode with realistic sandbox behavior</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-400">payment.ts</span>
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label="Copy code"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="p-6 text-sm overflow-x-auto">
                <code className="text-gray-300 font-mono leading-relaxed">
                  <span className="text-gray-500">// Create a payment intent</span>
                  {'\n'}
                  <span className="text-purple-400">const</span> <span className="text-blue-300">payment</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">vortex</span>.<span className="text-blue-300">payments</span>.<span className="text-yellow-300">create</span>{'({\n'}
                  {'  '}<span className="text-blue-300">amount</span>: <span className="text-green-300">5000</span>,{'\n'}
                  {'  '}<span className="text-blue-300">currency</span>: <span className="text-orange-300">'usd'</span>,{'\n'}
                  {'  '}<span className="text-blue-300">customer</span>: <span className="text-orange-300">'cus_abc123'</span>,{'\n'}
                  {'  '}<span className="text-blue-300">idempotency_key</span>: <span className="text-orange-300">'order_xyz789'</span>,{'\n'}
                  {'  '}<span className="text-blue-300">metadata</span>: {'{\n'}
                  {'    '}<span className="text-blue-300">order_id</span>: <span className="text-orange-300">'xyz789'</span>,{'\n'}
                  {'    '}<span className="text-blue-300">source</span>: <span className="text-orange-300">'web_checkout'</span>{'\n'}
                  {'  }\n'}{'})'};{'\n\n'}
                  <span className="text-gray-500">// Handle response</span>
                  {'\n'}
                  <span className="text-purple-400">if</span> {'('}<span className="text-blue-300">payment</span>.<span className="text-blue-300">status</span> === <span className="text-orange-300">'succeeded'</span>{')'} {'{\n'}
                  {'  '}<span className="text-purple-400">await</span> <span className="text-yellow-300">fulfillOrder</span>{'('}<span className="text-blue-300">payment</span>.<span className="text-blue-300">id</span>{');\n'}
                  {'}\n\n'}
                  <span className="text-gray-500">// Listen for events</span>
                  {'\n'}
                  <span className="text-blue-300">vortex</span>.<span className="text-blue-300">webhooks</span>.<span className="text-yellow-300">on</span>{'('}<span className="text-orange-300">'payment.succeeded'</span>, <span className="text-purple-400">async</span> {'('}<span className="text-blue-300">event</span>{')'} {'=> {\n'}
                  {'  '}<span className="text-purple-400">await</span> <span className="text-yellow-300">updateLedger</span>{'('}<span className="text-blue-300">event</span>.<span className="text-blue-300">data</span>{');\n'}
                  {'});'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
