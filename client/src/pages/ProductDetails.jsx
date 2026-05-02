import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Edit2, Save, X, Image as ImageIcon } from 'lucide-react';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Admin Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', stock: '', category: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/product/${id}`);
      setProduct(data.product);
      setRelated(data.relatedProduct || []);
      setEditForm({
        title: data.product.title,
        description: data.product.description,
        price: data.product.price,
        stock: data.product.stock,
        category: data.product.category
      });
      setCurrentImageIndex(0);
    } catch (error) {
      toast.error("Failed to load product details");
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleNextImage = () => {
    if (!product || !product.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    if (!product || !product.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/product/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product updated successfully");
      setIsEditing(false);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpdate = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/product/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Product images updated successfully");
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update images");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) return <><Navbar /><div className="container mt-8">Loading...</div></>;
  if (!product) return null;

  return (
    <>
      <Navbar />
      <div className="product-details-page container">
        <div className="pd-layout">
          {/* Image Gallery */}
          <div className="pd-gallery">
            <div className="main-image-container">
              {product.images && product.images.length > 0 ? (
                <>
                  <img src={product.images[currentImageIndex].url} alt={product.title} className="main-image" />
                  {product.images.length > 1 && (
                    <div className="slider-controls">
                      <button onClick={handlePrevImage} className="slider-btn"><ChevronLeft/></button>
                      <button onClick={handleNextImage} className="slider-btn"><ChevronRight/></button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-container">
                {product.images.map((img, idx) => (
                  <img 
                    key={img.id} 
                    src={img.url} 
                    alt="thumbnail" 
                    className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pd-info">
            {user?.role === 'admin' && (
              <div className="admin-controls mb-4">
                <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline">
                  {isEditing ? <><X size={16}/> Cancel Edit</> : <><Edit2 size={16}/> Edit Product</>}
                </button>
                <label className="btn btn-outline" style={{ marginLeft: '1rem', cursor: 'pointer' }}>
                  <ImageIcon size={16}/> Update Images
                  <input type="file" multiple hidden onChange={handleImageUpdate} disabled={uploadingImage} />
                </label>
                {uploadingImage && <span className="text-secondary ml-2">Uploading...</span>}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="edit-form">
                <div className="form-group">
                  <label>Title</label>
                  <input className="form-input" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input className="form-input" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" className="form-input" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" className="form-input" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-input" rows="5" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                  {saving ? "Saving..." : <><Save size={16}/> Save Changes</>}
                </button>
              </form>
            ) : (
              <>
                <p className="pd-category text-secondary">{product.category}</p>
                <h1 className="h1 pd-title">{product.title}</h1>
                <p className="pd-price">${product.price}</p>
                
                <div className="pd-description">
                  <p>{product.description}</p>
                </div>

                <div className="pd-meta">
                  <p className="text-secondary">Availability: 
                    {product.stock > 0 ? <span style={{color: 'green'}}> In Stock ({product.stock})</span> : <span style={{color: 'red'}}> Out of Stock</span>}
                  </p>
                </div>

                <button 
                  className="btn btn-primary w-full pd-add-btn" 
                  onClick={() => addToCart(product._id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
