import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import StateView from '../components/StateView';

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data);
    } catch (e) { setError('Unable to load cart'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    load();
  };
  const toggleSave = async (id, current) => {
    await api.put(`/cart/${id}/save`, { saved_for_later: current ? 0 : 1 });
    load();
  };

  return (
    <main className="container">
      <h2>Cart & Wishlist</h2>
      <StateView loading={loading} error={error} isEmpty={!loading && items.length === 0} emptyText="Cart is empty">
        {items.map((i) => (
          <section className="panel" key={i.id}>
            <p>Bike #{i.bike_id}</p>
            <p>{i.saved_for_later ? 'Wishlist' : 'Cart'}</p>
            <button onClick={() => toggleSave(i.id, i.saved_for_later)}>{i.saved_for_later ? 'Move to cart' : 'Save for later'}</button>
            <button onClick={() => removeItem(i.id)}>Remove</button>
          </section>
        ))}
      </StateView>
      <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
    </main>
  );
}
