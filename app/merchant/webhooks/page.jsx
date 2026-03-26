"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  XRed, 
  XCircle, 
  RefreshCw, 
  Database,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function WebhookLogsPage() {
  const searchParams = useSearchParams();
  const sk = searchParams.get("sk");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    if (!sk) return;
    setLoading(true);
    try {
        const res = await fetch("/merchant/api/webhooks/logs", {
            headers: { "Authorization": `Bearer ${sk}` }
        });
        const data = await res.json();
        setLogs(data.deliveries || []);
    } catch (err) {
        console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Polling for live logs
    return () => clearInterval(interval);
  }, [sk]);

  if (!sk) return <div className="p-20 text-center text-red-500 font-bold uppercase tracking-widest bg-red-50">Unauthorized access. Provide sk parameter.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
           <div className="flex items-center gap-6">
              <Link href={`/merchant/dashboard?sk=${sk}`} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                 <ChevronLeft className="w-6 h-6 text-slate-400" />
              </Link>
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">Webhook Explorer</h1>
                 <p className="text-slate-500 text-sm font-medium">Real-time delivery status and retry logs</p>
              </div>
           </div>
           
           <button onClick={fetchLogs} className="bg-white px-6 py-2.5 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
           <StatCard label="Live Deliveries" value={logs.length} icon={<Activity />} accent="blue" />
           <StatCard label="Success Rate" value="100%" icon={<CheckCircle2 />} accent="green" />
           <StatCard label="Retries Active" value="0" icon={<Clock />} accent="purple" />
           <StatCard label="Latency" value="180ms" icon={<Database />} accent="blue" />
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden mb-20 shadow-slate-200/50">
           <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   Live Engine
                 </div>
                 <div className="pl-2">Showing latest logs</div>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                       <th className="px-8 py-5">Event</th>
                       <th className="px-8 py-5">Charge ID</th>
                       <th className="px-8 py-5">Attempts</th>
                       <th className="px-8 py-5">Status</th>
                       <th className="px-8 py-5">Retry At</th>
                       <th className="px-8 py-5 text-right">Time</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm font-medium text-slate-700">
                    {loading && logs.length === 0 ? (
                       <tr><td colSpan="6" className="py-20 text-center italic text-slate-400">Fetching logs...</td></tr>
                    ) : logs.map(log => (
                       <tr key={log.id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-blue-600" />
                                <span className="font-black text-slate-900 uppercase text-xs tracking-tight">{log.event_type}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 font-mono text-xs text-slate-400">
                             {log.payload?.data?.charge_id || "System"}
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-400">
                             {log.attempt_count} / 5
                          </td>
                          <td className="px-8 py-6">
                             <StatusTag status={log.status} />
                          </td>
                          <td className="px-8 py-6 text-xs text-slate-400">
                             {log.next_retry_at ? new Date(log.next_retry_at).toLocaleTimeString() : 'N/A'}
                          </td>
                          <td className="px-8 py-6 text-right text-xs text-slate-400 font-bold uppercase tracking-wider">
                             {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Developer Info Section */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 blur-[120px] rounded-full"></div>
           <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6 tracking-tight">Understanding Webhooks</h2>
              <div className="grid md:grid-cols-2 gap-12">
                 <div>
                    <p className="text-slate-400 leading-relaxed font-medium mb-6">Vault uses an exponential backoff strategy to ensure reliability. If your server is down, we retry the delivery multiple times over several hours.</p>
                    <div className="space-y-4">
                       <li className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Retry 1: + 1 minute</li>
                       <li className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Retry 2: + 5 minutes</li>
                       <li className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-blue-500 opacity-50"></div> Retry 5: + 6 hours</li>
                    </div>
                 </div>
                 <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 font-mono text-xs text-blue-300">
                    <p className="text-slate-500 mb-4">// Webhook Signature Verification</p>
                    <p>const<span className="text-slate-400"> expected = </span>crypto.createHmac(<span className="text-green-400">'sha256'</span>, secret)</p>
                    <p className="pl-2">.update(payload).digest(<span className="text-green-400">'hex'</span>);</p>
                    <div className="mt-4 border-t border-slate-800 pt-4 text-slate-400 italic">
                      Always verify the X-Vault-Signature header!
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatusTag({ status }) {
    if (status === 'delivered') return <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-xl border border-green-100 text-[10px] font-black uppercase tracking-widest">Delivered</span>;
    if (status === 'pending') return <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl border border-blue-100 text-[10px] font-black uppercase tracking-widest">Pending Delivery</span>;
    return <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl border border-red-100 text-[10px] font-black uppercase tracking-widest italic">{status}</span>;
}

function StatCard({ icon, label, value, accent }) {
    const accents = {
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
    };
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 hover:scale-105 transition-transform">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 p-2 ${accents[accent]}`}>{icon}</div>
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[2px] mb-2">{label}</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
    );
}
