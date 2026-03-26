"use client";

import { useState } from "react";
import { ArrowLeftRight, ChevronLeft, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CustomerRefunds() {
  const [orderId, setOrderId] = useState("");

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-20">
      <nav className="h-16 border-b border-slate-100 flex items-center px-6 justify-between bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <div className="bg-red-500 p-1 rounded-lg"><ArrowLeftRight className="w-4 h-4 text-white" /></div>
            <span className="font-black uppercase italic tracking-tighter text-slate-900">Refund Status</span>
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-12">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Track <span className="text-red-500 italic">Refunds</span></h1>
           <p className="text-slate-500 font-medium max-w-lg">Check the status of your refund requests across any Vault-powered merchant.</p>
        </header>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden mb-20 p-10 max-w-lg">
             <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-blue-600 transition-all flex items-center gap-4">
                   <Search className="w-6 h-6 text-slate-400" />
                   <input 
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 w-full" 
                      placeholder="e.g. order_xyz123" 
                      value={orderId}
                      onChange={e => setOrderId(e.target.value)}
                   />
                </div>
                
                <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10">
                   Track Order Refund
                </button>
             </div>
        </div>
      </main>
    </div>
  );
}
