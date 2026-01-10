import { TrendingUp, Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';

const recentPayments = [
  { id: 'pay_8x9f2k', customer: 'Sarah Chen', amount: '$149.00', status: 'succeeded', time: '2m ago' },
  { id: 'pay_7h3g9m', customer: 'Marcus Webb', amount: '$89.50', status: 'succeeded', time: '5m ago' },
  { id: 'pay_5j2k1n', customer: 'Elena Rodriguez', amount: '$299.00', status: 'processing', time: '8m ago' },
  { id: 'pay_4n8h2p', customer: 'James Liu', amount: '$45.00', status: 'succeeded', time: '12m ago' },
  { id: 'pay_2m9k3r', customer: 'Olivia Brown', amount: '$175.00', status: 'failed', time: '15m ago' },
];

export function DashboardPreview() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl tracking-tight mb-4">Complete visibility</h2>
          <p className="text-lg text-gray-600">Real-time dashboard with transaction monitoring and analytics</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Payment Overview</h3>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
                <option>Last 7 days</option>
              </select>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-6 p-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Total Volume</span>
              </div>
              <div className="text-3xl font-semibold">$47,892</div>
              <div className="text-sm text-green-600 mt-1">+12.5% vs last week</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Activity className="w-4 h-4" />
                <span>Success Rate</span>
              </div>
              <div className="text-3xl font-semibold">97.8%</div>
              <div className="text-sm text-gray-500 mt-1">324 of 331 succeeded</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Clock className="w-4 h-4" />
                <span>Avg Processing</span>
              </div>
              <div className="text-3xl font-semibold">1.2s</div>
              <div className="text-sm text-gray-500 mt-1">Median: 890ms</div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Payment ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment, index) => (
                  <tr key={payment.id} className={index !== recentPayments.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="px-6 py-4">
                      <code className="text-sm text-gray-900 font-mono">{payment.id}</code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.customer}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.amount}</td>
                    <td className="px-6 py-4">
                      {payment.status === 'succeeded' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Succeeded
                        </span>
                      )}
                      {payment.status === 'processing' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Processing
                        </span>
                      )}
                      {payment.status === 'failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                      )}
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
