import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpdate = (cartItemId, action) => {
    updateCart(cartItemId, action);
  };

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <>
      <Navbar />
      <div className="cart-page container">
        <h1 className="h2 mb-8">Your Cart</h1>
        
        {!user ? (
          <div className="empty-cart">
            <p className="text-secondary mb-4">Please log in to view your cart.</p>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-cart">
            <p className="text-secondary mb-4">Your cart is currently empty.</p>
            <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <img 
                    src={item.product.images && item.product.images[0] ? item.product.images[0].url : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={item.product.title} 
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.product.title}</h3>
                    <p className="cart-item-price">${item.product.price}</p>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => handleUpdate(item._id, 'dec')} className="qty-btn" disabled={item.quantity <= 1}>
                          <Minus size={16} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button onClick={() => handleUpdate(item._id, 'inc')} className="qty-btn">
                          <Plus size={16} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="remove-btn text-secondary">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    ${item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${subtotal}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')} 
                className="btn btn-primary w-full mt-4"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
