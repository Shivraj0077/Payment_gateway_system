'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
  CreditCard,
  User,
  IndianRupee,
  ShieldCheck,
  History,
  AlertCircle
} from 'lucide-react';

export default function PaymentDetails({ params: paramsPromise }) {
  const { id } = use(paramsPromise);

  const [payment, setPayment] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function fetchData() {
    const base = window.location.origin;
    const headers = { Authorization: 'Bearer merchant_test_key' };

    try {
      const [p, l] = await Promise.all([
        fetch(`${base}/gateway/api/v1/payments/${id}`, { headers }).then(r => r.json()),
        fetch(`${base}/gateway/api/v1/ledger/${id}`, { headers }).then(r => r.json())
      ]);

      setPayment(p.payment ?? p);
      setLedger(l.ledger ?? []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  async function handleRefund() {
    if (!confirm('Issue refund?')) return;

    setRefundLoading(true);
    setMessage('');

    const res = await fetch('/gateway/api/v1/refunds/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer merchant_test_key'
      },
      body: JSON.stringify({
        charge_id: payment.id,
        customer_name: payment.customer_name
      })
    });

    const data = await res.json();
    setRefundLoading(false);

    if (!res.ok) {
      setMessage(data.error || 'Refund failed');
    } else {
      setMessage('Refund processed successfully');
      fetchData();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-background px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment not found</h2>
        <Link href="/gateway/payments" className="mt-4 text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Payments
        </Link>
      </div>
    );
  }

  const summary = ledger.reduce(
    (acc, e) => {
      acc[e.account_type].debit += e.debit;
      acc[e.account_type].credit += e.credit;
      return acc;
    },
    {
      customer: { debit: 0, credit: 0 },
      merchant: { debit: 0, credit: 0 },
      platform: { debit: 0, credit: 0 }
    }
  );

  const isRefunded = payment.status === 'refunded';
  const merchantNet = summary.merchant.credit - summary.merchant.debit;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8">
          <Link
            href="/gateway/payments"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Payments
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Payment Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                <Hash className="w-3.5 h-3.5" /> {payment.id}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={payment.status} />
              {!isRefunded && payment.status === 'captured' && (
                <button
                  onClick={handleRefund}
                  disabled={refundLoading}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  {refundLoading ? 'Processing...' : 'Issue Refund'}
                </button>
              )}
            </div>
          </div>
        </header>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {message.includes('success') ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DetailCard
            icon={<IndianRupee className="w-4 h-4 text-blue-500" />}
            label="Net Amount"
            value={`₹${payment.amount.toLocaleString()}`}
            sub="Gross Transaction Value"
          />
          <DetailCard
            icon={<User className="w-4 h-4 text-purple-500" />}
            label="Customer"
            value={payment.customer_name}
            sub="Billing Name"
          />
          <DetailCard
            icon={<History className="w-4 h-4 text-orange-500" />}
            label="Created At"
            value={new Date(payment.created_at).toLocaleDateString()}
            sub={new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
        </div>

        <div className="space-y-6">
          {/* Information Section */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Payment Breakdown
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <BreakdownRow label="Customer Paid" value={`₹${payment.amount.toLocaleString()}`} isTotal />
              <BreakdownRow label="Platform Fee" value={`- ₹${payment.platform_fee.toLocaleString()}`} muted />
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <BreakdownRow label="Merchant Received" value={`₹${payment.net_amount.toLocaleString()}`} isSuccess />
              </div>
            </div>
          </section>

          {/* Refund Section if applicable */}
          {isRefunded && (
            <section className="bg-red-50/30 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30">
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-400 flex items-center gap-2">
                  <History className="w-4 h-4" /> Refund Information
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <BreakdownRow label="Customer Refunded" value={`₹${payment.amount.toLocaleString()}`} />
                <BreakdownRow label="Platform Fee (Non-refundable)" value={`₹${summary.platform.credit.toLocaleString()}`} muted />
                <BreakdownRow
                  label="Merchant Adjustment"
                  value={merchantNet < 0 ? `- ₹${Math.abs(merchantNet).toLocaleString()}` : `₹${merchantNet.toLocaleString()}`}
                  isDanger
                />
              </div>
            </section>
          )}

          {/* Ledger Table */}
          {ledger.length > 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Accounting Ledger</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-slate-800/20 text-gray-500 dark:text-gray-400">
                      <Th className="pl-6">Account</Th>
                      <Th className="text-right">Debit</Th>
                      <Th className="text-right">Credit</Th>
                      <Th className="text-right pr-6">Net Balance</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {['customer', 'merchant', 'platform'].map((account, idx) => {
                      const debit = summary[account].debit;
                      const credit = summary[account].credit;
                      const net = credit - debit;

                      return (
                        <tr key={account} className={`border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors`}>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white capitalize">{account}</td>
                          <td className="px-6 py-4 text-right text-red-600 dark:text-red-400">
                            {debit > 0 ? `₹${debit.toLocaleString()}` : '—'}
                          </td>
                          <td className="px-6 py-4 text-right text-green-600 dark:text-green-400">
                            {credit > 0 ? `₹${credit.toLocaleString()}` : '—'}
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white pr-6">
                            {net >= 0 ? `₹${net.toLocaleString()}` : `-₹${Math.abs(net).toLocaleString()}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">{sub}</div>
    </div>
  );
}

function BreakdownRow({ label, value, isTotal, isSuccess, isDanger, muted }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className={`text-sm ${muted ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'} ${isTotal ? 'font-semibold' : ''}`}>{label}</span>
      <span className={`text-sm font-bold ${isSuccess ? 'text-green-600 dark:text-green-400' : isDanger ? 'text-red-600 dark:text-red-400' : muted ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </span>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  )
}

function StatusBadge({ status }) {
  const success = status === 'captured' || status === 'succeeded' || status === 'paid';
  const processing = status === 'processing' || status === 'payment_pending' || status === 'created' || status === 'authorized';

  if (success) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold border border-green-100 dark:border-green-800 shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Captured
      </span>
    );
  }

  if (processing) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800 shadow-sm">
        <Clock className="w-3.5 h-3.5" />
        {status.replace('_', ' ')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-800 shadow-sm">
      <XCircle className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
