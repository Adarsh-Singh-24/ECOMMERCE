import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/admin/Dashboard.css'; // Reuse some table styles if needed or inline

const ManageOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/order/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/order/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', minHeight: 'calc(100vh - 80px - 300px)' }}>
        <div className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/admin" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="input-with-icon" style={{ width: '300px', position: 'relative' }}>
            <Search className="input-icon" size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-input pl-10" 
              placeholder="Search by Order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
        </div>

        <h1 className="h2 mb-6">Manage Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Order ID</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Customer</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Total</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>{order._id.substring(0, 8)}...</td>
                    <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>{order.user?.email || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>${order.subTotal}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`order-status status-${order.status.toLowerCase()}`} style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={order.status} 
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="form-input"
                        style={{ padding: '0.25rem 0.5rem', width: 'auto' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ManageOrders;
