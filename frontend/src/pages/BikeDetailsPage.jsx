import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import StateView from '../components/StateView';

export default function BikeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/bikes/${id}`);
      setBike(data);
    } catch (e) { setError('Unable to load bike'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const addToCart = async (saved_for_later = 0) => {
    try {
      await api.post('/cart', { bike_id: Number(id), saved_for_later });
      setMsg(saved_for_later ? 'Added to wishlist' : 'Added to cart');
    } catch (e) { setMsg(e.response?.data?.message || 'Add failed'); }
  };

  const addReview = async () => {
    try {
      await api.post('/reviews', { bike_id: Number(id), ...review });
      setMsg('Review submitted');
      load();
    } catch (e) { setMsg(e.response?.data?.message || 'Review failed'); }
  };

  return (
    <main className="container">
      <button onClick={() => navigate(-1)}>Back</button>
      <StateView loading={loading} error={error} isEmpty={!loading && !bike} emptyText="Bike not found">
        {bike && (
          <>
            <h2>{bike.title}</h2>
            <p>{bike.brand} - {bike.year}</p>
            <p>Price: INR {bike.price}</p>
            <p>Seller: {bike.seller_name} ({bike.seller_mobile})</p>
            <p>Specifications: {bike.specs || 'N/A'}</p>
            <p>{msg}</p>
            <button onClick={() => addToCart(0)}>Add to Cart</button>
            <button onClick={() => addToCart(1)}>Add to Wishlist</button>
            <section className="panel">
              <h3>Reviews</h3>
              {(bike.reviews || []).length === 0 && <p>No reviews yet</p>}
              {(bike.reviews || []).map((r) => (
                <p key={r.id}>{r.reviewer}: {r.rating}/5 - {r.comment}</p>
              ))}
              <input type="number" min="1" max="5" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })} />
              <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
              <button onClick={addReview}>Add Review</button>
            </section>
          </>
        )}
      </StateView>
    </main>
  );
}
