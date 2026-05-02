import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, User, LogOut, Moon, Sun } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          ADAPTify
        </Link>
        
        <nav className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
        </nav>

        <div className="navbar-actions">
          <button onClick={toggleTheme} className="action-btn text-secondary theme-toggle-btn" title="Toggle Theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/cart" className="action-btn cart-btn">
            <ShoppingBag size={22} />
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </Link>
          
          {user ? (
            <div className="user-menu">
              {user.role === 'admin' && (
                <Link to="/admin" className="action-btn text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Admin
                </Link>
              )}
              <Link to="/profile" className="action-btn">
                <User size={22} />
              </Link>
              <button onClick={logout} className="action-btn text-secondary" title="Logout">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline login-btn">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
