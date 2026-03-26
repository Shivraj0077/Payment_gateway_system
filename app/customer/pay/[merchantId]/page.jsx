"use client";

import { useEffect, useState, use } from "react";
import { 
  ShieldCheck, 
  CreditCard, 
  User, 
  Zap, 
  CheckCircle2, 
  Layout, 
  ArrowRight, 
  ChevronLeft,
  RefreshCw,
  Lock,
  Wallet,
  Activity,
  ChevronRight,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const merchantId = params.merchantId;

  const [pk, setPk] = useState("");
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Input PK, 2: Tokenize, 3: Charge
  const [chargeId, setChargeId] = useState("");
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState(1500);

  async function resolveMerchant() {
    if (!pk) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/gateway/api/v1/merchants/${merchantId}/public-key?pk=${pk}`);
      const data = await res.json();
      if (data.merchant) {
        setMerchant(data.merchant);
        setStep(2);
      } else {
        setError("Invalid Public Key for this Merchant ID");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
    setLoading(false);
  }

  async function handlePayment() {
    if (!customerName || customerName.trim() === "") {
        setError("Customer Name is required for testing.");
        return;
    }
    setError("");
    setLoading(true);
    try {
      // 1. Tokenize (Simulation)
      const tokenRes = await fetch("/gateway/api/v1/tokens", {
        method: "POST",
        body: JSON.stringify({ card_number: "4242424242424242", public_key: pk }),
        headers: { "Content-Type": "application/json" }
      });
      const { token } = await tokenRes.json();

      // 2. Authorize Charge
      const chargeRes = await fetch("/gateway/api/v1/charges", {
        method: "POST",
        body: JSON.stringify({ 
          token, 
          amount, 
          customer_name: customerName || "Guest",
          payment_method: "card",
          order_id: crypto.randomUUID(),
          webhook_url: merchant.webhook_url || "https://webhook.site/placeholder",
          idempotenct_key: `order_${Math.random().toString(36).substr(2, 9)}` 
        }),
        headers: { 
            "Authorization": `Bearer ${merchant.private_key}`, 
            "Content-Type": "application/json",
            "x-idempotency-key": `idemp_${Math.random().toString(36).substr(2, 9)}`
        }
      });
      const { charge_id } = await chargeRes.json();
      setChargeId(charge_id);
      setStep(3);
    } catch (err) {
      setError("Payment failed. Please check your credentials.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans flex flex-col">
       {/* Small Navbar */}
       <nav className="h-16 border-b border-gray-100 flex items-center px-8 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
         <Link href="/" className="flex items-center gap-2 group">
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
            <div className="bg-blue-600 p-1 rounded-lg"><Shield className="w-4 h-4 text-white" /></div>
            <span className="font-black uppercase italic tracking-tighter text-gray-900">Vault <span className="text-blue-600">Secure</span></span>
         </Link>
         <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-green-500" />
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">AES-256 Encryption Active</div>
         </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto py-12 px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
         {/* Left Side: Order Summary */}
         <div className="space-y-8 sticky top-28">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 blur-[100px] rounded-full -mr-32 -mt-32"></div>
               <div className="relative z-10">
                  <h1 className="text-3xl font-black mb-12 tracking-tight leading-none uppercase italic">Checkout Experience</h1>
                  
                  <div className="space-y-6 mb-12">
                     <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <span>Invoice ID</span>
                        <span className="text-white font-mono">INV-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                     </div>
                     <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <span>Merchant Account</span>
                        <span className="text-white font-bold">{merchant?.name || 'Resolving...'}</span>
                     </div>
                     <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest pt-6 border-t border-white/10">
                        <span className="text-sm">Total Amount</span>
                        <span className="text-2xl font-black text-blue-400 italic">₹{amount}.00</span>
                     </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl group hover:bg-white/10 transition-all">
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Vault Security Protocol</p>
                     <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">Your sensitive financial metadata never touches the merchant's servers. All data is tokenized at the vault edge.</p>
                  </div>
               </div>
            </div>

            <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                   <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-[2px] text-blue-600 mb-1">Live Telemetry</p>
                   <p className="text-[11px] font-bold text-blue-800 leading-tight">Every state change in this checkout emits an immutable aggregate event in our system.</p>
                </div>
            </div>
         </div>

         {/* Right Side: Action Panel */}
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 transition-all duration-500">
             {step === 1 && (
               <div className="animate-in fade-in slide-in-from-right-5 duration-500">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4 leading-none">Enter Credentials</h2>
                  <p className="text-slate-500 font-medium mb-10">Paste the <span className="text-blue-600 font-black">Public Key</span> for <code className="text-[12px] bg-slate-100 px-2 py-1 rounded font-black">{decodeURIComponent(merchantId)}</code> to proceed.</p>
                  
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Public Key (pk_test_...)</label>
                        <input 
                           className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-2xl px-6 py-4 transition-all outline-none font-bold text-slate-800 font-mono text-xs"
                           value={pk}
                           onChange={e => setPk(e.target.value)}
                           placeholder="Paste your public key here..."
                        />
                     </div>
                     <button 
                        onClick={resolveMerchant}
                        disabled={loading}
                        className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                     >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Resolve Merchant <ChevronRight className="w-5 h-5" /></>}
                     </button>
                     {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{error}</p>}
                  </div>
               </div>
            )}

            {step === 2 && (
               <div className="animate-in fade-in slide-in-from-right-5 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                     <ShieldCheck className="w-6 h-6 text-green-500" />
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Verify Payment</h2>
                  </div>
                  <p className="text-slate-500 font-medium mb-10">Merchant <span className="font-black text-slate-900">{merchant?.name}</span> is verified. Confirm your details to complete authorization.</p>

                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Full Name</label>
                           <input 
                              className="w-full bg-slate-50 border-transparent focus:bg-white rounded-xl px-5 py-3 transition-all outline-none font-bold text-slate-800 text-sm"
                              value={customerName}
                              onChange={e => setCustomerName(e.target.value)}
                              placeholder="Shivraj Pawar"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Amount (INR)</label>
                           <input 
                              className="w-full bg-slate-50 border-transparent focus:bg-white rounded-xl px-5 py-3 transition-all outline-none font-black text-blue-600 text-sm"
                              value={amount}
                              onChange={e => setAmount(e.target.value)}
                              type="number"
                           />
                        </div>
                     </div>
                     
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <CreditCard className="w-8 h-8 text-slate-400" />
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulated Card</p>
                           <p className="text-sm font-black text-slate-900 leading-none">Visa **** 4242</p>
                        </div>
                     </div>

                     <button 
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                     >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Authorize ₹{amount} <ArrowRight className="w-5 h-5" /></>}
                     </button>
                  </div>
               </div>
            )}

            {step === 3 && (
               <div className="animate-in zoom-in-95 duration-500 text-center py-10">
                  <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20 relative">
                     <CheckCircle2 className="w-10 h-10" />
                     <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4 uppercase italic">Authorized!</h2>
                  <p className="text-slate-500 font-medium mb-12">Charge ID: <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded text-blue-600 font-black tracking-widest">{chargeId}</span></p>
                  
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left mb-12">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">What's next?</p>
                     <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">The merchant now needs to "Capture" this authorized amount from their dashboard. An immutable event has been emitted to the system ledger.</p>
                  </div>

                  <Link href={`/merchant/dashboard?sk=${merchant.private_key}`}>
                     <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-2xl">
                        Open Merchant Dashboard <ChevronRight className="w-5 h-5" />
                     </button>
                  </Link>
               </div>
            )}
         </div>
      </main>

      <footer className="footer py-10 text-center border-t border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[5px]">
         Secure Environment • PCI Standards • Vault Infrastructure
      </footer>
    </div>
  );
}
