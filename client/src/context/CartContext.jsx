import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/cart/all', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setCart(data.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/cart/add', { product: productId, quantity }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchCart();
      toast.success(data.message || "Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  };

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/cart/remove/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateCart = async (cartItemId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/cart/update?action=${action}`, { id: cartItemId }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating cart");
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
