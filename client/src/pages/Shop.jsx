import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import '../styles/Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortByPrice, setSortByPrice] = useState('');
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { addToCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (sortByPrice) queryParams.append('sortByPrice', sortByPrice);
      queryParams.append('page', page);

      const { data } = await axios.get(`/api/product/all?${queryParams.toString()}`);
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setTotalPage(data.totalPage || 1);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, sortByPrice, page]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSortByPrice('');
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <>
      <Navbar />
      <div className="shop-page container">
        <header className="shop-header">
          <h1 className="h1">The Collection</h1>
          <p className="text-secondary">Discover the latest tech and modern essentials.</p>
        </header>

        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-container">
          <button 
            className="btn btn-outline mobile-filter-btn mb-4" 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="shop-layout">
          {/* Sidebar Filters */}
          <aside className={`shop-sidebar ${showMobileFilters ? 'show' : ''}`}>
            <div className="sidebar-header mobile-only">
              <h3>Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="action-btn"><X size={20}/></button>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Search</h3>
              <form onSubmit={handleSearchSubmit} className="search-form input-with-icon">
                <Search className="input-icon" size={16} />
                <input 
                  type="text" 
                  className="form-input pl-10" 
                  placeholder="Search products..." 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </form>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Categories</h3>
              <div className="filter-options">
                <label className="radio-label">
                  <input type="radio" name="category" checked={category === ''} onChange={() => { setCategory(''); setPage(1); }} />
                  <span>All Categories</span>
                </label>
                {categories.map((cat, idx) => (
                  <label key={idx} className="radio-label">
                    <input type="radio" name="category" checked={category === cat} onChange={() => { setCategory(cat); setPage(1); }} />
                    <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Sort By Price</h3>
              <div className="filter-options">
                <label className="radio-label">
                  <input type="radio" name="sort" checked={sortByPrice === ''} onChange={() => setSortByPrice('')} />
                  <span>Default</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="sort" checked={sortByPrice === 'lowToHigh'} onChange={() => setSortByPrice('lowToHigh')} />
                  <span>Low to High</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="sort" checked={sortByPrice === 'highToLow'} onChange={() => setSortByPrice('highToLow')} />
                  <span>High to Low</span>
                </label>
              </div>
            </div>

            {(search || category || sortByPrice) && (
              <button onClick={clearFilters} className="btn btn-outline w-full mt-4">
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main Content */}
          <div className="shop-main">
            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map(product => (
                    <div key={product._id} className="product-card">
                      <Link to={`/product/${product._id}`} className="product-image-container">
                        <img 
                          src={product.images && product.images[0] ? product.images[0].url : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                          alt={product.title} 
                          className="product-image"
                        />
                        {product.stock === 0 && (
                          <div className="out-of-stock-badge">Sold Out</div>
                        )}
                        <div className="product-overlay">
                          <span className="view-details">View Details</span>
                        </div>
                      </Link>
                      <div className="product-details">
                        <div className="product-info">
                          <h3 className="product-title">{product.title}</h3>
                          <p className="product-category text-secondary">{product.category}</p>
                        </div>
                        <div className="product-price-action">
                          <span className="product-price">${product.price}</span>
                          <button 
                            className="add-to-cart-btn"
                            onClick={() => addToCart(product._id)}
                            aria-label="Add to cart"
                            disabled={product.stock === 0}
                          >
                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="empty-state w-full" style={{ gridColumn: '1 / -1' }}>
                      <p className="mb-4">No products found matching your criteria.</p>
                      <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPage > 1 && (
                  <div className="pagination">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      disabled={page === 1}
                      className="page-btn"
                    >
                      Prev
                    </button>
                    <span className="page-info">Page {page} of {totalPage}</span>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPage, p + 1))} 
                      disabled={page === totalPage}
                      className="page-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
