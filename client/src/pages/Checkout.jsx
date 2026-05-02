import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import '../styles/Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, [user, cart.length, navigate]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/address/all', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setAddresses(data || []);
      if (data && data.length > 0) {
        setSelectedAddress(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/address/new', newAddress, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setShowNewAddressForm(false);
      setNewAddress({ address: '', phone: '' });
      fetchAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }
    setPlacingOrder(true);
    try {
      const token = localStorage.getItem('token');
      const addressObj = addresses.find(a => a._id === selectedAddress);
      
      await axios.post('/api/order/new/cod', {
        method: 'Cash on Delivery',
        phone: addressObj.phone,
        address: addressObj.address
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Order placed successfully!");
      fetchCart(); // This should clear the cart on backend or we manually handle it if backend doesn't clear.
      navigate('/profile');
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!user || cart.length === 0) return null;

  return (
    <>
      <Navbar />
      <div className="checkout-page container">
        <h1 className="h2 mb-8">Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-main">
            <section className="checkout-section">
              <h2 className="section-title">Shipping Address</h2>
              
              {addresses.length > 0 ? (
                <div className="address-list">
                  {addresses.map(addr => (
                    <label key={addr._id} className={`address-card ${selectedAddress === addr._id ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr._id} 
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className="address-radio"
                      />
                      <div className="address-info">
                        <p className="address-text">{addr.address}</p>
                        <p className="address-phone">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-outline mt-4" 
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  >
                    + Add New Address
                  </button>
                </div>
              ) : (
                <p className="text-secondary mb-4">You have no saved addresses.</p>
              )}

              {(showNewAddressForm || addresses.length === 0) && (
                <form onSubmit={handleAddAddress} className="new-address-form mt-4">
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea 
                      className="form-input" 
                      rows="3"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Address"}
                  </button>
                </form>
              )}
            </section>

            <section className="checkout-section">
              <h2 className="section-title">Payment Method</h2>
              <div className="payment-method-card selected">
                <input type="radio" checked readOnly className="address-radio" />
                <div className="payment-info">
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-secondary text-sm">Pay when you receive your order.</p>
                </div>
              </div>
            </section>
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <h2 className="summary-title">Order Summary ({cart.length} items)</h2>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item._id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-title">{item.product.title}</span>
                      <span className="text-secondary">x {item.quantity}</span>
                    </div>
                    <span>${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${subtotal}</span>
              </div>

              <button 
                onClick={handlePlaceOrder} 
                className="btn btn-primary w-full mt-6"
                disabled={placingOrder || !selectedAddress}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
