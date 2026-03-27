import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SellBikePage from './pages/SellBikePage';
import BikeDetailsPage from './pages/BikeDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  return (
    <div>
      <header className="header">
        <h1>Bike4Sell</h1>
        <nav>
          <Link to="/">Browse</Link>
          <Link to="/auth">Auth</Link>
          <Link to="/sell">Sell Bike</Link>
          <Link to="/cart">Cart/Wishlist</Link>
          <Link to="/orders">Orders</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/sell" element={<SellBikePage />} />
        <Route path="/bikes/:id" element={<BikeDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </div>
  );
}
