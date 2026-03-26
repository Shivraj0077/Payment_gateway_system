"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  Activity, 
  Clock, 
  Database, 
  Layers, 
  RefreshCw,
  Layout,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Monitor,
  Webhook,
  Code2,
  Lock,
  Zap,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Users,
  ArrowLeftRight,
  Book
} from "lucide-react";
import Link from "next/link";

export default function MerchantDashboard() {
  const searchParams = useSearchParams();
  const sk = searchParams.get("sk");
  
  const [charges, setCharges] = useState([]);
  const [summary, setSummary] = useState({ total: 0, success: 0, net: 0, fees: 0, customers: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  async function fetchDashboard() {
    if (!sk) return;
    setLoading(true);
    try {
      const res = await fetch("/gateway/api/v1/merchants/dashboard", {
        headers: { "Authorization": `Bearer ${sk}` }
      });
      const data = await res.json();
      setCharges(data.charges || []);
      setSummary({
        total: data.metrics?.total_volume || 0,
        success: data.metrics?.success_count || 0,
        net: data.metrics?.net_volume || 0,
        fees: data.metrics?.platform_fees || 0,
        customers: data.metrics?.total_customers || 0
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const handleCapture = async (id) => {
     if (!confirm("Finalize this authorized charge?")) return;
     try {
       const res = await fetch(`/gateway/api/v1/charges/${id}/capture`, {
         method: "POST",
         headers: { "Authorization": `Bearer ${sk}` }
       });
       if (res.ok) fetchDashboard();
     } catch (err) {
       console.error(err);
     }
  }

  useEffect(() => {
    fetchDashboard();
  }, [sk]);

  if (!sk) return (
     <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-red-100 text-center max-w-lg">
           <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
           </div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">No Key Provided</h1>
           <p className="text-slate-500 font-medium mb-8 leading-relaxed">Please access the dashboard using a valid private key (`sk_test_...`) in the URL or go back to login.</p>
           <Link href="/merchant/login" className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all inline-block shadow-2xl">
              Go to Login
           </Link>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans transition-colors overflow-hidden">
      {/* Dynamic Header */}
      <nav className="h-16 border-b border-slate-100 flex items-center px-8 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
         <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
               <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
                  <ShieldCheck className="w-4 h-4 text-white" />
               </div>
               <span className="font-black uppercase italic tracking-tighter text-slate-900">Vault <span className="text-blue-600">Portal</span></span>
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="hidden lg:flex items-center gap-6">
               <NavTab active={activeTab === 'all'} label="Payments" onClick={() => setActiveTab('all')} icon={<Wallet className="w-3.5 h-3.5" />} />
               <NavTab active={activeTab === 'refunds'} label="Refunds" onClick={() => setActiveTab('refunds')} link={`/merchant/refunds?sk=${sk}`} icon={<ArrowLeftRight className="w-3.5 h-3.5" />} />
               <NavTab active={activeTab === 'ledger'} label="Ledger" onClick={() => setActiveTab('ledger')} link={`/merchant/ledger?sk=${sk}`} icon={<Book className="w-3.5 h-3.5" />} />
               <NavTab active={activeTab === 'webhooks'} label="Webhooks" onClick={() => setActiveTab('webhooks')} link={`/merchant/webhooks?sk=${sk}`} icon={<Webhook className="w-3.5 h-3.5" />} />
               <NavTab active={activeTab === 'developers'} label="Developers" onClick={() => setActiveTab('developers')} link="/developers" icon={<Code2 className="w-3.5 h-3.5" />} />
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-slate-100 px-4 py-2 rounded-xl items-center gap-3 border border-slate-200 group hover:bg-white transition-all">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <p className="text-[10px] font-mono text-slate-500 truncate max-w-[120px] font-bold uppercase tracking-widest">{sk}</p>
            </div>
            <button onClick={fetchDashboard} className="p-2.5 bg-blue-600 text-white rounded-xl hover:rotate-180 transition-all duration-500 shadow-xl shadow-blue-500/20 active:scale-95">
               <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Complete <span className="text-blue-600 italic">visibility</span></h1>
              <p className="text-slate-500 font-medium">Real-time monitoring of your business infrastructure.</p>
           </div>
           
           <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-[1.2rem] shadow-sm">
              <button onClick={() => setActiveTab('all')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Transactions</button>
              <button onClick={() => setActiveTab('analytics')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Analytics</button>
           </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
           <DashCard label="Gross Volume" value={`₹${summary.total.toLocaleString()}`} icon={<Wallet />} accent="blue" stat="+12.5%" />
           <DashCard label="Success Rate" value={`${charges.length > 0 ? ((summary.success / charges.length) * 100).toFixed(1) : 0}%`} icon={<Zap />} accent="green" stat="Optimal" />
           <DashCard label="Total Customers" value={summary.customers} icon={<Users />} accent="orange" stat="Unique" />
           <DashCard label="Platform Fees" value={`₹${summary.fees.toLocaleString()}`} icon={<Layers />} accent="purple" stat="Fixed 2%" />
           <DashCard label="Net Balance" value={`₹${summary.net.toLocaleString()}`} icon={<TrendingUp />} accent="blue" stat="Available" />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden mb-20 transition-all duration-500">
           <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 w-full max-w-md bg-slate-50 px-6 py-4 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-blue-600 transition-all">
                 <Search className="w-5 h-5 text-slate-400" />
                 <input className="bg-transparent border-none focus:ring-0 text-sm font-bold placeholder-slate-400 text-slate-900 w-full" placeholder="Search by Charge ID or Customer..." />
              </div>
              
              <div className="flex items-center gap-3">
                 <button className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 flex items-center gap-3 transition-all">
                    <FileText className="w-4 h-4" /> Export CSV
                 </button>
                 <button className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20">
                    <ExternalLink className="w-4 h-4" /> Reports
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400 border-b border-slate-100">
                       <th className="px-10 py-5">Charge ID</th>
                       <th className="px-10 py-5">Customer</th>
                       <th className="px-10 py-5">Amount</th>
                       <th className="px-10 py-5 text-center">Net</th>
                       <th className="px-10 py-5 text-center">Status</th>
                       <th className="px-10 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm font-bold text-slate-700">
                    {loading && charges.length === 0 ? (
                       <tr><td colSpan="6" className="py-20 text-center italic text-slate-400 font-medium">Synchronizing with ledger...</td></tr>
                    ) : charges.map(charge => (
                       <tr key={charge.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-6">
                             <div className="flex flex-col">
                                <span className="font-mono text-xs text-blue-600 truncate max-w-[100px]">{charge.id}</span>
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{new Date(charge.created_at).toLocaleDateString()}</span>
                             </div>
                          </td>
                          <td className="px-10 py-6"><span className="text-slate-900">{charge.customer_name}</span></td>
                          <td className="px-10 py-6">₹{charge.amount}</td>
                          <td className="px-10 py-6 text-center text-slate-400">₹{charge.net_amount || (charge.amount * 0.98).toFixed(1)}</td>
                          <td className="px-10 py-6">
                             <div className="flex justify-center">
                                <StatusBadge status={charge.status} />
                             </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                             {charge.status === 'authorized' ? (
                                <button 
                                   onClick={() => handleCapture(charge.id)}
                                   className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                                >
                                   Capture
                                </button>
                             ) : (
                                <Link href={`/developers`} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors inline-block border border-slate-100">
                                   <ChevronRight className="w-5 h-5" />
                                </Link>
                             )}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Footer info section */}
        <section className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative shadow-2xl">
           <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 blur-[100px] rounded-full -mr-32 -mt-32"></div>
           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="text-3xl font-black mb-4 tracking-tight leading-none uppercase italic">The double-entry ledger is active.</h2>
                 <p className="text-slate-400 font-medium leading-relaxed">Every state change in your dashboard is an immutable event recorded in the Vault core system.</p>
              </div>
              <div className="flex justify-end">
                 <Link href="/developers" className="group flex items-center gap-4 bg-white/5 backdrop-blur-xl px-10 py-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all">
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Architecture</p>
                       <p className="text-xs font-black uppercase tracking-widest text-white leading-tight">Flow Monitoring Active</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                       <Code2 className="w-6 h-6" />
                    </div>
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <footer className="footer py-10 text-center border-t border-slate-100">
         <p className="text-slate-400 text-[10px] font-black uppercase tracking-[5px]">Vault Infrastructure • Secure Portal Access</p>
      </footer>
    </div>
  );
}

function StatusBadge({ status }) {
    if (status === 'authorized') return (
        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full border border-blue-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Authorized
        </span>
    );
    if (status === 'captured') return (
        <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Captured
        </span>
    );
    return (
        <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5" />
            {status}
        </span>
    );
}

function NavTab({ active, label, onClick, link, icon }) {
    const Component = link ? Link : 'button';
    return (
        <Component 
          href={link}
          onClick={onClick} 
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-100 text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-900 border border-transparent'}`}
        >
           {icon}
           {label}
        </Component>
    );
}

function DashCard({ label, value, icon, accent, stat }) {
    const accents = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        purple: "bg-purple-100 text-purple-600"
    };
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-100/50 hover:scale-[1.03] transition-all cursor-default group">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-all ${accents[accent]}`}>
              {icon}
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 leading-none">{value}</h3>
           <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${accents[accent]}`}>{stat}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Status</span>
           </div>
        </div>
    );
}
