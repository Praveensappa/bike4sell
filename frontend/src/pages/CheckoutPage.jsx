import { useState } from 'react';
import api from '../api/client';

export default function CheckoutPage() {
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');

  const checkout = async () => {
    try {
      const { data } = await api.post('/orders/checkout', { address, payment_mode: 'UPI' });
      setMsg(`Booking confirmed. Order #${data.orderId}`);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Payment simulation failed');
    }
  };

  return (
    <main className="container">
      <h2>Checkout & Payment</h2>
      <input placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={checkout}>Pay & Confirm</button>
      <p>{msg}</p>
    </main>
  );
}
