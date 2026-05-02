import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import '../../styles/admin/Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/order/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (error) {
        toast.error("Failed to fetch admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (loading || !stats) return <><Navbar /><div className="container mt-8">Loading...</div></>;

  const pieData = [
    { name: 'COD', value: stats.cod },
    { name: 'Online', value: stats.online }
  ];

  return (
    <>
      <Navbar />
      <div className="admin-dashboard container">
        <div className="admin-header">
          <h1 className="h2">Admin Dashboard</h1>
          <div className="admin-nav">
            <Link to="/admin/products/new" className="btn btn-primary">Add Product</Link>
            <Link to="/admin/orders" className="btn btn-outline">Manage Orders</Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.cod + stats.online}</p>
          </div>
          <div className="stat-card">
            <h3>COD Orders</h3>
            <p className="stat-value">{stats.cod}</p>
          </div>
          <div className="stat-card">
            <h3>Online Orders</h3>
            <p className="stat-value">{stats.online}</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-wrapper">
            <h3 className="chart-title">Payment Methods</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper">
            <h3 className="chart-title">Product Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis tick={{fill: 'var(--text-secondary)'}} />
                <BarTooltip contentStyle={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)'}} />
                <Bar dataKey="sold" fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
