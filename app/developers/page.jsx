"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Code2, 
  Layers, 
  Database, 
  Server, 
  Activity, 
  ChevronRight,
  Terminal,
  Cpu,
  RefreshCw,
  Eye,
  Settings,
  Copy,
  Check
} from "lucide-react";

export default function DevelopersPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
      let codeText = steps[activeStep].code;
      navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: "1. Client Request",
      icon: <Terminal />,
      desc: "The customer or merchant server initiates a request to the Vault API. Public keys are used for tokenization, while private keys authorize charges.",
      code: `POST /gateway/api/v1/charges\nAuthorization: Bearer sk_test_...\n{\n  "amount": 5000,\n  "customer_name": "Shivraj Pawar"\n}`,
      codeJSX: <><span className="text-purple-400">POST</span> <span className="text-blue-300">/gateway/api/v1/charges</span>{'\n'}<span className="text-orange-300">Authorization:</span> Bearer sk_test_...{'\n'}{'{\n  '}<span className="text-blue-300">"amount"</span>: <span className="text-green-300">5000</span>,{'\n  '}<span className="text-blue-300">"customer_name"</span>: <span className="text-orange-300">"Shivraj Pawar"</span>{'\n}'}</>
    },
    {
      title: "2. API Validation",
      icon: <ShieldCheck />,
      desc: "Vault validates the API key, checks for idempotency to prevent duplicate charges, and ensures the merchant ID is correctly linked.",
      code: `// lib/auth.js\nconst merchant = await authorizeMerchant(req);\nif (!merchant) throw new Error("Invalid Key");`,
      codeJSX: <><span className="text-gray-500">// lib/auth.js</span>{'\n'}<span className="text-purple-400">const</span> <span className="text-blue-300">merchant</span> = <span className="text-purple-400">await</span> <span className="text-yellow-300">authorizeMerchant</span>(req);{'\n'}<span className="text-purple-400">if</span> (!merchant) <span className="text-purple-400">throw new</span> <span className="text-yellow-300">Error</span>(<span className="text-orange-300">"Invalid Key"</span>);</>
    },
    {
      title: "3. Event Store Emittance",
      icon: <Database />,
      desc: "Instead of just updating a row, we append an event. This creates an immutable audit log of every state change (created, authorized, captured).",
      code: `// app/gateway/core/eventStore.js\nawait appendEvent({\n  aggregate_id: chargeId,\n  event_type: "charge.authorized",\n  event_data: { ... }\n});`,
      codeJSX: <><span className="text-gray-500">// app/gateway/core/eventStore.js</span>{'\n'}<span className="text-purple-400">await</span> <span className="text-yellow-300">appendEvent</span>{`({\n  `}<span className="text-blue-300">aggregate_id</span>: chargeId,{'\n  '}<span className="text-blue-300">event_type</span>: <span className="text-orange-300">"charge.authorized"</span>,{'\n  '}<span className="text-blue-300">event_data</span>: {`{ ... }\n});`}</>
    },
    {
      title: "4. Ledger Recording",
      icon: <Layers />,
      desc: "Double-entry accounting. We record every movement of funds between the customer, the platform fee, and the merchant's net balance.",
      code: `// app/gateway/core/ledger.js\nawait recordCaptureLedger({\n  chargeId: "ch_123",\n  platform_fee: 500,\n  net_amount: 4500\n});`,
      codeJSX: <><span className="text-gray-500">// app/gateway/core/ledger.js</span>{'\n'}<span className="text-purple-400">await</span> <span className="text-yellow-300">recordCaptureLedger</span>{`({\n  `}<span className="text-blue-300">chargeId</span>: <span className="text-orange-300">"ch_123"</span>,{'\n  '}<span className="text-blue-300">platform_fee</span>: <span className="text-green-300">500</span>,{'\n  '}<span className="text-blue-300">net_amount</span>: <span className="text-green-300">4500</span>{'\n});'}</>
    },
    {
      title: "5. Webhook Notification",
      icon: <Activity />,
      desc: "A background dispatcher picks up the pending webhook delivery and sends it to the merchant with exponential backoff retries.",
      code: `// webhooks/route.js\n{\n  "type": "charge.captured",\n  "data": { "charge_id": "ch_123" }\n}`,
      codeJSX: <><span className="text-gray-500">// webhooks/route.js</span>{'\n{\n  '}<span className="text-blue-300">"type"</span>: <span className="text-orange-300">"charge.captured"</span>,{'\n  '}<span className="text-blue-300">"data"</span>: {`{ `}<span className="text-blue-300">"charge_id"</span>: <span className="text-orange-300">"ch_123"</span>{` }\n}`}</>
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Mini Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="font-black text-lg tracking-tighter uppercase italic">Vault <span className="text-slate-400 not-italic font-medium">Dev</span></span>
          </Link>
          <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/merchant/login" className="hover:text-blue-600">Merchant Portal</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <header className="mb-20">
           <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Cpu className="w-3 h-3" /> Architecture Overview
           </div>
           <h1 className="text-5xl font-black tracking-tight mb-6">How Vault Works</h1>
           <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
              Explore the internals of our event-driven payment architecture. Every transaction is an immutable chain of events backed by a double-entry ledger.
           </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
           {/* Steps List */}
           <div className="space-y-4">
              {steps.map((step, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-8 rounded-3xl border transition-all duration-300 ${activeStep === idx ? 'bg-white border-blue-600 shadow-2xl shadow-blue-100 z-10 scale-[1.02]' : 'bg-slate-50 border-transparent hover:bg-slate-100 opacity-70'}`}
                 >
                    <div className="flex items-start gap-6">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeStep === idx ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm'}`}>
                          {step.icon}
                       </div>
                       <div>
                          <h3 className={`font-black uppercase tracking-widest text-sm mb-2 ${activeStep === idx ? 'text-blue-600' : 'text-slate-500'}`}>{step.title}</h3>
                          <p className={`text-sm font-medium leading-relaxed ${activeStep === idx ? 'text-slate-700' : 'text-slate-500'}`}>{step.desc}</p>
                       </div>
                    </div>
                 </button>
              ))}
           </div>

            {/* Preview Panel */}
            <div className="sticky top-40">
                <div className="bg-[#101828] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#101828]">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-xs text-gray-400">Vault SDK Implementation</span>
                        <button
                            onClick={handleCopy}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            aria-label="Copy code"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <pre className="p-6 text-sm overflow-x-auto min-h-[400px]">
                        <code className="text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                            {steps[activeStep].codeJSX}
                        </code>
                    </pre>
                </div>

              <div className="mt-8 flex items-center gap-4 bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
                      <Settings className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Interactive Sandbox</p>
                      <p className="text-[11px] font-bold text-blue-800 leading-tight">Copy your Public Key from the Merchant Dashboard to test the payment system securely.</p>
                  </div>
              </div>
           </div>
        </div>
      </main>

      <footer className="footer border-t border-slate-100 py-10 text-center">
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Advanced Agentic Coding Project • Vault Infrastructure</p>
      </footer>
    </div>
  );
}
