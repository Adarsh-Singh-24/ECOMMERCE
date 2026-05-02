import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2>ADAPTify</h2>
          <p>Premium tech and accessories for modern living.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h3>Shop</h3>
            <a href="/shop">All Products</a>
            <a href="#">New Arrivals</a>
          </div>
          <div className="footer-col">
            <h3>Support</h3>
            <a href="#">Contact Us</a>
            <a href="#">FAQ</a>
            <a href="#">Shipping & Returns</a>
          </div>
          <div className="footer-col">
            <h3>Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ADAPTify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
