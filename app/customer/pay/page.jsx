"use client";

import { useState } from "react";
import { 
  Search, 
  ChevronRight, 
  Shield, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";

export default function CustomerPayIndex() {
  const [mId, setMId] = useState("");

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans flex flex-col items-center justify-center p-6">
       <Link href="/" className="mb-12 group flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 hover:scale-105 transition-all active:scale-95">
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
          <div className="bg-blue-600 p-1 rounded-lg"><Shield className="w-4 h-4 text-white" /></div>
          <span className="font-black uppercase italic tracking-tighter text-slate-900">Back to Home</span>
       </Link>

       <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 w-full max-w-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 blur-[80px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
             <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 leading-none text-center italic">Checkout <span className="text-blue-600">Portal</span></h1>
             <p className="text-slate-500 font-medium mb-12 text-center">Enter the Business Name to continue to the secure payment page.</p>
             
             <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-blue-600 transition-all flex items-center gap-4">
                   <Search className="w-6 h-6 text-slate-400" />
                   <input 
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 w-full" 
                      placeholder="e.g. Vault Labs Inc." 
                      value={mId}
                      onChange={e => setMId(e.target.value)}
                   />
                </div>
                
                <Link href={`/customer/pay/${mId || 'guest'}`} className={`block ${!mId ? 'opacity-50 pointer-events-none' : ''}`}>
                   <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10">
                      Continue to Payment <ChevronRight className="w-5 h-5" />
                   </button>
                </Link>
             </div>
          </div>
       </div>

       <footer className="mt-20 text-[10px] font-black uppercase tracking-[5px] text-slate-300">Vault Secure Payments Network</footer>
    </div>
  );
}
