async function fetchJSON(url) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: "Bearer merchant_test_key"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  return res.json();
}

export default async function PaymentDetails({ params }) {
  // Await params as it's a Promise in Next.js
  const { id } = await params; // id is the charge_id
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  try {
    // Get the gateway charge by id
    const paymentRes = await fetchJSON(`${baseUrl}/gateway/api/v1/payments/${id}`);
    const payment = paymentRes.payment ?? paymentRes;

    const chargeId = payment.id;

    const [ledgerRes, eventsRes] = await Promise.all([
      chargeId ? fetchJSON(`${baseUrl}/gateway/api/v1/ledger/${chargeId}`).catch(() => ({ ledger: [] })) : Promise.resolve({ ledger: [] }),
      chargeId ? fetchJSON(`${baseUrl}/gateway/api/v1/events/${chargeId}`).catch(() => ({ events: [] })) : Promise.resolve({ events: [] })
    ]);

    const ledger = ledgerRes.ledger ?? [];
    const events = eventsRes.events ?? [];

    return (
      <div style={{ padding: 24 }}>
        <h1>Payment Details</h1>
        <a href="/gateway/payments">← Back to Payments</a>

        <div style={{ marginTop: 24 }}>
          <h2>Payment {payment.id}</h2>
          <p><strong>Amount:</strong> ₹{payment.amount}</p>
          <p><strong>Currency:</strong> {payment.currency}</p>
          <p><strong>Status:</strong> {payment.status}</p>
          {payment.order_id && (
            <p><strong>Order ID:</strong> {payment.order_id}</p>
          )}
          <p>
            <strong>Created:</strong>{" "}
            {new Date(payment.created_at).toLocaleString()}
          </p>
        </div>

        <div style={{ marginTop: 32 }}>
          <h3>Ledger Entries</h3>
          {ledger?.length ? (
            <table border="1" cellPadding="8" cellSpacing="0">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Debit</th>
                  <th>Credit</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((l, i) => (
                  <tr key={i}>
                    <td>{l.account}</td>
                    <td>{l.debit ? `₹${l.debit}` : "-"}</td>
                    <td>{l.credit ? `₹${l.credit}` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No ledger entries found.</p>
          )}
        </div>

        <div style={{ marginTop: 32 }}>
          <h3>Event Timeline</h3>
          {events?.length ? (
            <ul>
              {events.map((e) => (
                <li key={e.id}>
                  <strong>{e.event_type}</strong> —{" "}
                  {new Date(e.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Payment Details</h1>
        <p style={{ color: "red" }}>
          Error loading payment: {error.message}
        </p>
        <a href="/gateway/payments">← Back to Payments</a>
      </div>
    );
  }
}

