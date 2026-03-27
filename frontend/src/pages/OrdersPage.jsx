import { useEffect, useState } from 'react';
import api from '../api/client';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/orders');
      setOrders(data);
      const statusMap = {};
      for (const o of data) {
        const s = await api.get(`/orders/${o.id}/status`);
        statusMap[o.id] = s.data;
      }
      setStatuses(statusMap);
    };
    load();
  }, []);

  return (
    <main className="container">
      <h2>Orders & Tracking</h2>
      {orders.length === 0 && <p>No orders yet</p>}
      {orders.map((o) => (
        <section className="panel" key={o.id}>
          <p>Order #{o.id} - INR {o.total_amount}</p>
          <p>Payment: {o.payment_status}</p>
          <p>Address: {o.address}</p>
          <p>Status Trail: {(statuses[o.id] || []).map((s) => s.status).join(' -> ') || 'N/A'}</p>
        </section>
      ))}
    </main>
  );
}
