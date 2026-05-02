import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: ''
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category.toLowerCase());
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/product/new', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Product created successfully!");
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <div className="mb-8">
          <Link to="/admin" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
        
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h1 className="h2 mb-6">Add New Product</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <input type="text" name="category" className="form-input" value={formData.category} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-input" rows="4" value={formData.description} onChange={handleChange} required></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Product Images</label>
              <label className="form-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '2rem', borderStyle: 'dashed' }}>
                <Upload size={24} className="mr-2 text-secondary" style={{ marginRight: '0.5rem' }} />
                <span className="text-secondary">{files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload images'}</span>
                <input type="file" multiple hidden onChange={handleFileChange} accept="image/*" />
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;
