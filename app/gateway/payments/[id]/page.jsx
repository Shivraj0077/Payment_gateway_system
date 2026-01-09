'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

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

    const [p, l] = await Promise.all([
      fetch(`${base}/gateway/api/v1/payments/${id}`, { headers }).then(r => r.json()),
      fetch(`${base}/gateway/api/v1/ledger/${id}`, { headers }).then(r => r.json())
    ]);

    setPayment(p.payment ?? p);
    setLedger(l.ledger ?? []);
    setLoading(false);
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
      setMessage('Refund processed');
      fetchData();
    }
  }

  if (loading) return <p>Loading…</p>;
  if (!payment) return <p>Payment not found</p>;

  // ---- ledger summary ----
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
    <div className="max-w-xl mx-auto p-6 space-y-6">

      <Link href="/gateway/payments">Go Back</Link>

      <h1 className="text-lg font-bold">Payment</h1>

      <div className="border rounded p-3 space-y-1">
        <p><b>Charge ID:</b> {payment.id}</p>
        <p><b>Customer:</b> {payment.customer_name}</p>
        <p><b>Status:</b> {payment.status}</p>
        <p><b>Amount:</b> ₹{payment.amount}</p>
      </div>

      <div className="border rounded p-3 space-y-1">
        <h2 className="font-semibold">Payment Breakdown</h2>
        <p>Customer paid: ₹{payment.amount}</p>
        <p>Platform fee: ₹{payment.platform_fee}</p>
        <p>Merchant received: ₹{payment.net_amount}</p>
      </div>

      {isRefunded && (
        <div className="border rounded p-3 space-y-1">
          <h2 className="font-semibold">Refund</h2>
          <p>Customer refunded: ₹{payment.amount}</p>
          <p>Platform fee: non-refundable (₹{summary.platform.credit})</p>
          <p>
            Merchant adjustment: {merchantNet < 0
              ? `-₹${Math.abs(merchantNet)}` : `₹${merchantNet}`}
          </p>
        </div>
      )}

      {!isRefunded && payment.status === 'captured' && (
        <button
          onClick={handleRefund}
          disabled={refundLoading}
          className="border px-3 py-1 rounded"
        >
          {refundLoading ? 'Processing…' : 'Issue Refund'}
        </button>
      )}

      {message && <p className="text-sm">{message}</p>}

      {ledger.length > 0 && (
        <div className="border rounded p-3 space-y-1">
          <h2 className="font-semibold">Ledger</h2>
          <table className="w-full text-sm border-collapse border">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">Account</th>
                <th className="border px-2 py-1 text-right">Debit</th>
                <th className="border px-2 py-1 text-right">Credit</th>
                <th className="border px-2 py-1 text-right">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {['customer', 'merchant', 'platform'].map(account => {
                const debit = summary[account].debit;
                const credit = summary[account].credit;
                const net = credit - debit;

                return (
                  <tr key={account}>
                    <td className="border px-2 py-1 capitalize">{account}</td>

                    <td className="border px-2 py-1 text-right">
                      {debit > 0 ? `₹${debit}` : '—'}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {credit > 0 ? `₹${credit}` : '—'}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {net >= 0 ? `₹${net}` : `-₹${Math.abs(net)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>


          </table>
        </div>
      )}

    </div>
  );
}
