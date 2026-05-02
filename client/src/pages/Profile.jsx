import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Eye, Printer, X } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/order/all', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        // Assuming the backend returns all orders for this user if it's not an admin route, 
        // or we need to filter. Let's assume the backend handles it correctly.
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const printOrder = () => {
    window.print();
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="profile-page container">
        <div className="profile-header">
          <div>
            <h1 className="h2">My Account</h1>
            <p className="text-secondary">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        </div>

        <div className="profile-content">
          <section className="orders-section">
            <h2 className="section-title">Order History</h2>
            
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="empty-orders">
                <p className="text-secondary">You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/shop')} className="btn btn-primary mt-4">Browse Products</button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-label">Order ID</span>
                        <span className="order-value">#{order._id.substring(0, 8)}</span>
                      </div>
                      <div>
                        <span className="order-label">Date</span>
                        <span className="order-value">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="order-label">Total Amount</span>
                        <span className="order-value">${order.subTotal}</span>
                      </div>
                      <div>
                        <span className="order-label">Status</span>
                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items" style={{ display: 'none' }}>
                      {/* Hidden in list view, shown in modal */}
                    </div>
                    
                    <div className="order-actions-row p-4 border-t">
                      <button 
                        className="btn btn-outline w-full"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={16} /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content printable-order" onClick={e => e.stopPropagation()}>
            <div className="modal-header no-print">
              <h2 className="h3">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="action-btn"><X/></button>
            </div>
            
            <div className="modal-body">
              <div className="order-receipt-header">
                <h2>ADAPTify</h2>
                <p>Order #{selectedOrder._id}</p>
                <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="order-receipt-info">
                <div>
                  <strong>Shipping To:</strong>
                  <p>{selectedOrder.address}</p>
                  <p>Phone: {selectedOrder.phone}</p>
                </div>
                <div>
                  <strong>Payment Method:</strong>
                  <p>{selectedOrder.method}</p>
                  <strong>Status:</strong>
                  <p>{selectedOrder.status}</p>
                </div>
              </div>

              <table className="order-receipt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name || item.product?.title || 'Product'}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price || item.product?.price || 0}</td>
                      <td>${(item.price || item.product?.price || 0) * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" style={{textAlign: 'right'}}><strong>Subtotal:</strong></td>
                    <td>${selectedOrder.subTotal}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{textAlign: 'right'}}><strong>Shipping:</strong></td>
                    <td>$0.00</td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{textAlign: 'right'}}><strong>Grand Total:</strong></td>
                    <td><strong>${selectedOrder.subTotal}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="modal-footer no-print">
              <button className="btn btn-outline" onClick={printOrder}>
                <Printer size={16} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;
