import { TrendingUp, Activity, CheckCircle2, XCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getPayments() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/gateway/api/v1/payments`, { cache: 'no-store' });
  if (!res.ok) return { payments: [] };
  return res.json();
}

export default async function PaymentsPage() {
  const { payments = [] } = await getPayments();

  // Simple metrics calculation
  const totalVolume = payments.reduce((acc, p) => acc + (p.status === 'captured' || p.status === 'succeeded' ? p.amount : 0), 0);
  const successRate = payments.length > 0
    ? ((payments.filter(p => p.status === 'captured' || p.status === 'succeeded').length / payments.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Gateway Payments
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              View and manage all transactions across the gateway
            </p>
          </div>
          <Link
            href="/merchant/overview"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Merchant Overview
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                Transaction History
              </h3>
              <div className="flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md font-medium">
                  {payments.length} Total
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 border-b border-gray-200 dark:border-slate-800">
            <Metric icon={<TrendingUp className="w-4 h-4 text-green-500" />} label="Total Volume" value={`₹${totalVolume.toLocaleString()}`} sub="Total captured amount" green />
            <Metric icon={<Activity className="w-4 h-4 text-blue-500" />} label="Success Rate" value={`${successRate}%`} sub={`${payments.filter(p => p.status === 'captured' || p.status === 'succeeded').length} of ${payments.length} orders`} />
            <Metric icon={<Clock className="w-4 h-4 text-orange-500" />} label="Last Activity" value={payments.length > 0 ? new Date(payments[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} sub="Recent transaction time" />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-slate-800/50">
                  <Th>Payment ID</Th>
                  <Th>Customer</Th>
                  <Th>Method</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4">
                        <code className="text-xs text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                          {p.id}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {p.customer_name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize text-center">
                        {p.payment_method || "card"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{p.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/gateway/payments/${p.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  );
}

function Metric({ icon, label, value, sub, green }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className={`text-xs mt-1 font-medium ${green ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {sub}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const success = status === 'captured' || status === 'succeeded' || status === 'paid';
  const processing = status === 'processing' || status === 'payment_pending' || status === 'created' || status === 'authorized';

  if (success) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold border border-green-100 dark:border-green-800">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Captured
      </span>
    );
  }

  if (processing) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-800">
        <Clock className="w-3.5 h-3.5" />
        {status.replace('_', ' ')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-100 dark:border-red-800">
      <XCircle className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
