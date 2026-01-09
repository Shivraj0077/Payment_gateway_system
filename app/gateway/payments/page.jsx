async function getPayments() {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/gateway/api/v1/payments`, { cache: 'no-store' });
    return res.json();
  }
  
  export default async function PaymentsPage() {
    const { payments } = await getPayments();
  
    return (
      <div style={{ padding: 24 }}>
        <h1>Payments</h1>
  
        {payments && payments.length > 0 ? (
          <table border="1" cellPadding="8" cellSpacing="0" style={{ borderCollapse: "collapse", marginTop: 16 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.customer_name || "Unknown"}</td>
                  <td>{p.payment_method || "card"}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.status}</td>
                  <td>{new Date(p.created_at).toLocaleString()}</td>
                  <td>
                    <a href={`/gateway/payments/${p.id}`}>View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payments found.</p>
        )}
      </div>
    );
  }
  