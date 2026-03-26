"use client";

import { useState } from "react";
import { 
  Rocket, 
  Check, 
  Copy, 
  ShieldCheck, 
  Shield, 
  Lock, 
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Database,
  RefreshCw,
  Layout
} from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const [businessName, setBusinessName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/gateway/api/v1/merchants/register", {
        method: "POST",
        body: JSON.stringify({ name: businessName, webhook_url: webhookUrl }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setKeys(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans">
      {/* Small Navbar */}
      <nav className="h-16 border-b border-gray-100 flex items-center px-8 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
         <Link href="/" className="flex items-center gap-2 group">
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
            <div className="bg-blue-600 p-1 rounded-lg"><Shield className="w-4 h-4 text-white" /></div>
            <span className="font-black uppercase italic tracking-tighter text-gray-900">Vault</span>
         </Link>
         <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Merchant Onboarding v2.0</div>
      </nav>

      <main className="max-w-4xl mx-auto py-20 px-6">
        {!keys ? (
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-gray-200 border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 blur-[80px] rounded-full -mr-20 -mt-20"></div>
             
             <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200">
                   <Rocket className="w-8 h-8" />
                </div>
                
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4 leading-none">Activate your business</h1>
                <p className="text-gray-500 font-medium mb-12 max-w-lg leading-relaxed">Join thousands of businesses moving money with precision. Setup your environment and get your developer keys instantly.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1">Business Name</label>
                         <input 
                            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-2xl px-6 py-4 transition-all outline-none font-bold text-gray-800"
                            placeholder="Vault Labs Inc."
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1">Webhook URL (Optional)</label>
                         <input 
                            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-2xl px-6 py-4 transition-all outline-none font-bold text-gray-800"
                            placeholder="https://api.myapp.com/webhooks"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                         />
                      </div>
                   </div>

                   <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Generate API Keys <ArrowRight className="w-5 h-5" /></>}
                   </button>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-50 grid grid-cols-2 gap-8">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold text-xs">01</div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Instant Activation</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs">02</div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">PCI Aligned</p>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
             <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10 text-center mb-12">
                   <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-green-500/20">
                      <Check className="w-8 h-8" />
                   </div>
                   <h2 className="text-4xl font-black tracking-tight mb-2">You're operational.</h2>
                   <p className="text-slate-400 font-medium">Save these keys securely. You won't be able to see the Private Key again.</p>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 hover:bg-slate-800 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Public Key (Frontend)</span>
                         </div>
                         <button onClick={() => copyToClipboard(keys.public_key, 'pk')} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">
                           {copied === 'pk' ? 'Copied' : 'Copy'}
                         </button>
                      </div>
                      <code className="text-sm font-mono text-blue-300 break-all bg-slate-950 p-4 rounded-xl block border border-white/5">{keys.public_key}</code>
                   </div>

                   <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 hover:bg-slate-800 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-red-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Private Key (Backend)</span>
                         </div>
                         <button onClick={() => copyToClipboard(keys.private_key, 'sk')} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-white transition-colors">
                           {copied === 'sk' ? 'Copied' : 'Copy'}
                         </button>
                      </div>
                      <code className="text-sm font-mono text-red-300 break-all bg-slate-950 p-4 rounded-xl block border border-white/5">{keys.private_key}</code>
                   </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                   <Link href={`/merchant/dashboard?sk=${keys.private_key}`} className="flex-1">
                      <button className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95">
                         Go to Dashboard <ChevronRight className="w-5 h-5" />
                      </button>
                   </Link>
                </div>
             </div>

             <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                   <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-[2px] text-blue-600 mb-1">Developer Quick-start</p>
                   <p className="text-[11px] font-bold text-blue-800">Use your Public Key in the checkout script and Private Key for charge authorization.</p>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="footer py-10 text-center border-t border-gray-100">
         <p className="text-gray-400 text-[10px] font-black uppercase tracking-[3px]">Secure Payment Infrastructure by Vault</p>
      </footer>
    </div>
  );
}
