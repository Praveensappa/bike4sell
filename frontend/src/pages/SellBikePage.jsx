import { useState } from 'react';
import api from '../api/client';

export default function SellBikePage() {
  const [form, setForm] = useState({
    title: '', brand: '', year: '', price: '', category_id: 1, location_id: 1, fuel_type: '', specs: ''
  });
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');

  const submit = async () => {
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (image) payload.append('image', image);
      await api.post('/bikes', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Bike listed');
    } catch (e) { setMsg(e.response?.data?.message || 'Failed to list bike'); }
  };

  return (
    <main className="container">
      <h2>Sell Bike</h2>
      <p>{msg}</p>
      <section className="panel">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <input placeholder="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Fuel Type" value={form.fuel_type} onChange={(e) => setForm({ ...form, fuel_type: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <textarea placeholder="Specs" value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} />
        <button onClick={submit}>Add Bike</button>
      </section>
    </main>
  );
}
