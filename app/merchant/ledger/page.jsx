"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Book, ChevronLeft, RefreshCw, Hash, DollarSign } from "lucide-react";
import Link from "next/link";

export default function MerchantLedger() {
  const searchParams = useSearchParams();
  const sk = searchParams.get("sk");
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLedger() {
      if (!sk) return;
      setLoading(true);
      try {
        const res = await fetch("/gateway/api/v1/merchants/ledger", {
          headers: { "Authorization": `Bearer ${sk}` }
        });
        const data = await res.json();
        setEntries(data.entries || []);
      } catch (err) {
        console.error("Failed to fetch ledger", err);
      }
      setLoading(false);
    }
    fetchLedger();
  }, [sk]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-20">
      <nav className="h-16 border-b border-slate-100 flex items-center px-6 justify-between bg-white sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <Link href={`/merchant/dashboard?sk=${sk}`} className="flex items-center gap-2 group">
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
              <div className="bg-blue-600 p-1 rounded-lg"><Book className="w-4 h-4 text-white" /></div>
              <span className="font-black uppercase italic tracking-tighter text-slate-900">Ledger</span>
           </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-12">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Double-Entry <span className="text-blue-600 italic">Ledger</span></h1>
           <p className="text-slate-500 font-medium">Immutable accounting record of all debits and credits across your merchant profile.</p>
        </header>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden mb-20">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50">
                <Book className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Master Transaction Log</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                      <tr className="bg-white uppercase text-[10px] font-black tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="px-8 py-5">Entry ID / Date</th>
                        <th className="px-8 py-5 text-center">Reference Charge</th>
                        <th className="px-8 py-5">Account Type</th>
                        <th className="px-8 py-5 text-right">Debit / Credit</th>
                      </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-slate-700">
                      {loading ? (
                          <tr><td colSpan="4" className="py-20 text-center italic text-slate-400 font-medium"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading ledger items...</td></tr>
                      ) : entries.length === 0 ? (
                          <tr><td colSpan="4" className="py-20 text-center italic text-slate-400 font-medium">No ledger entries found.</td></tr>
                      ) : (
                          entries.map(entry => (
                              <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 mb-1 text-slate-900">
                                      <Hash className="w-3 h-3 text-slate-400" /> <span className="font-mono text-xs">{entry.id.split('-')[0]}...</span>
                                    </div>
                                    <div className="text-[10px] font-medium text-slate-400">{new Date(entry.created_at).toLocaleString()}</div>
                                  </td>
                                  <td className="px-8 py-6 text-center">
                                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">{entry.aggregate_id}</span>
                                  </td>
                                  <td className="px-8 py-6">
                                    <span className="text-xs uppercase tracking-widest font-black text-slate-600">{entry.account_type.replace('_', ' ')}</span>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                    <span className={`inline-flex items-center gap-1 font-black px-3 py-1.5 rounded-xl ${entry.credit > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        <DollarSign className="w-3.5 h-3.5" /> {(entry.credit > 0 ? entry.credit : entry.debit).toLocaleString()} {entry.currency}
                                    </span>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}
