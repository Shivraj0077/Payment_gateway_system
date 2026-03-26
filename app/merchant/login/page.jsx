"use client";

import { useState } from "react";
import { 
  Shield, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  RefreshCw,
  Layout,
  Info
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [sk, setSk] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!sk.startsWith("sk_test_")) {
        alert("Invalid Private Key format. Use sk_test_...");
        setLoading(false);
        return;
    }
    
    try {
        const res = await fetch("/gateway/api/v1/merchants/dashboard", {
            headers: { "Authorization": `Bearer ${sk}` }
        });
        if (res.ok) {
            window.location.href = `/merchant/dashboard?sk=${sk}`;
        } else {
            alert("Invalid Private Key. Access Denied.");
            setLoading(false);
        }
    } catch(err) {
        alert("Network error.");
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans flex flex-col">
      {/* Small Navbar */}
      <nav className="h-16 border-b border-gray-100 flex items-center px-8 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
         <Link href="/" className="flex items-center gap-2 group">
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
            <div className="bg-blue-600 p-1 rounded-lg"><Shield className="w-4 h-4 text-white" /></div>
            <span className="font-black uppercase italic tracking-tighter text-gray-900">Vault</span>
         </Link>
         <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Merchant Portal Access</div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-gray-200 border border-gray-100 relative overflow-hidden max-w-lg w-full">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 blur-[80px] rounded-full -mr-20 -mt-20"></div>
           
           <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200">
                 <Lock className="w-8 h-8" />
              </div>
              
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4 leading-none text-center sm:text-left">Secure Login</h1>
              <p className="text-gray-500 font-medium mb-12 leading-relaxed text-center sm:text-left">Use your <span className="text-blue-600 font-black">Private Key</span> (`sk_test_...`) to access the merchant portal. Your session is protected by Vault encryption.</p>

              <form onSubmit={handleLogin} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1">Private Key (sk_test_...)</label>
                    <input 
                       type="password"
                       className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-2xl px-6 py-4 transition-all outline-none font-bold text-gray-800 font-mono text-sm"
                       placeholder="Paste your key here..."
                       value={sk}
                       onChange={(e) => setSk(e.target.value)}
                       required
                    />
                 </div>

                 <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Enter Portal <ArrowRight className="w-5 h-5" /></>}
                 </button>
              </form>

              <div className="mt-12 flex flex-col gap-4 text-center">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Don't have a key yet?</p>
                 <Link href="/merchant/onboarding" className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest italic decoration-2 underline-offset-4 underline">
                    Register a new business →
                 </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl">
                 <Info className="w-5 h-5 text-blue-600 shrink-0" />
                 <p className="text-[11px] font-bold text-blue-800 leading-tight">Private keys are never saved in local storage. They are only used for the current session's API authorization.</p>
              </div>
           </div>
        </div>
      </main>

      <footer className="footer py-10 text-center border-t border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[3px]">
         Secure Environment • PCI Standards • Vault Infrastructure
      </footer>
    </div>
  );
}
