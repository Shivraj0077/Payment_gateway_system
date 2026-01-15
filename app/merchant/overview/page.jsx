import { TrendingUp, Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';

const recentPayments = [
  { id: 'pay_8x9f2k', customer: 'Sarah Chen', amount: '$149.00', status: 'succeeded', time: '2m ago' },
  { id: 'pay_7h3g9m', customer: 'Marcus Webb', amount: '$89.50', status: 'succeeded', time: '5m ago' },
  { id: 'pay_5j2k1n', customer: 'Elena Rodriguez', amount: '$299.00', status: 'processing', time: '8m ago' },
  { id: 'pay_4n8h2p', customer: 'James Liu', amount: '$45.00', status: 'succeeded', time: '12m ago' },
  { id: 'pay_2m9k3r', customer: 'Olivia Brown', amount: '$175.00', status: 'failed', time: '15m ago' },
];

export default function DashboardPreview() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-background transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl tracking-tight mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Complete visibility
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Real-time dashboard with transaction monitoring and analytics
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                Payment Overview
              </h3>
              <select className="text-xs sm:text-sm border rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 bg-white dark:bg-slate-800">
                <option>Last 7 days</option>
              </select>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 border-b border-gray-200 dark:border-slate-800">
            <Metric icon={<TrendingUp />} label="Total Volume" value="$47,892" sub="+12.5% vs last week" green />
            <Metric icon={<Activity />} label="Success Rate" value="97.8%" sub="324 of 331 succeeded" />
            <Metric icon={<Clock />} label="Avg Processing" value="1.2s" sub="Median: 890ms" />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-slate-800/50">
                  <Th>Payment ID</Th>
                  <Th>Customer</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Time</Th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment, i) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="px-6 py-4">
                      <code className="text-sm text-blue-600 font-mono">{payment.id}</code>
                    </td>
                    <td className="px-6 py-4 text-sm">{payment.customer}</td>
                    <td className="px-6 py-4 text-sm font-medium">{payment.amount}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </section>
  );
}

function Th({ children }) {
  return (
    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
      {children}
    </th>
  );
}

function Metric({ icon, label, value, sub, green }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-3xl font-semibold">{value}</div>
      <div className={`text-xs mt-1 ${green ? 'text-green-600' : 'text-gray-500'}`}>
        {sub}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'succeeded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-800">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Succeeded
      </span>
    );
  }

  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-800">
        <Clock className="w-3.5 h-3.5" />
        Processing
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-800">
      <XCircle className="w-3.5 h-3.5" />
      Failed
    </span>
  );
}


function Badge({ color, icon, text }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}>
      {icon}
      {text}
    </span>
  );
}
