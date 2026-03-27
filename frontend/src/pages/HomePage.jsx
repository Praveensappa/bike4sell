import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StateView from '../components/StateView';

export default function HomePage() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ brand: '', minPrice: '', maxPrice: '', fuel_type: '', year: '' });
  const [page, setPage] = useState(1);

  const fetchBikes = async (reset = false) => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, page, limit: 10 };
      const { data } = await api.get('/bikes', { params });
      setBikes((prev) => (reset ? data : [...prev, ...data]));
    } catch (e) {
      setError('Failed to load bikes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBikes(true); }, [filters]);
  useEffect(() => { if (page > 1) fetchBikes(); }, [page]);

  return (
    <main className="container">
      <h2>Browse Bikes</h2>
      <div className="filters">
        <input placeholder="Brand" value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} />
        <input placeholder="Min Price" type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input placeholder="Max Price" type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        <input placeholder="Fuel Type" value={filters.fuel_type} onChange={(e) => setFilters({ ...filters, fuel_type: e.target.value })} />
        <input placeholder="Year" type="number" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
      </div>
      <StateView loading={loading} error={error} isEmpty={!loading && bikes.length === 0} emptyText="No bikes found">
        <div className="grid">
          {bikes.map((b) => (
            <Link key={b.id} to={`/bikes/${b.id}`} className="card">
              <h3>{b.title}</h3>
              <p>{b.brand} - {b.year}</p>
              <p>INR {b.price}</p>
            </Link>
          ))}
        </div>
      </StateView>
      <button onClick={() => setPage((p) => p + 1)} className="load-more">Load More</button>
    </main>
  );
}
