"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeftRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function MerchantRefunds() {
  const searchParams = useSearchParams();
  const sk = searchParams.get("sk");

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-20">
      <nav className="h-16 border-b border-slate-100 flex items-center px-6 justify-between bg-white sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <Link href={`/merchant/dashboard?sk=${sk}`} className="flex items-center gap-2 group">
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
              <div className="bg-red-500 p-1 rounded-lg"><ArrowLeftRight className="w-4 h-4 text-white" /></div>
              <span className="font-black uppercase italic tracking-tighter text-slate-900">Refunds</span>
           </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-12">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Merchant <span className="text-red-500 italic">Disputes & Refunds</span></h1>
           <p className="text-slate-500 font-medium">Issue full or partial refunds directly back to customer token streams.</p>
        </header>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden mb-20 p-20 text-center flex flex-col items-center justify-center">
             <ArrowLeftRight className="w-16 h-16 text-slate-200 mb-6" />
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-2">No Active Refunds</h2>
             <p className="text-slate-500 max-w-md mx-auto">Customer chargebacks and merchant-driven refunds will populate here with automatic general ledger correction.</p>
        </div>
      </main>
    </div>
  );
}
