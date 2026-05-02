import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';


const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section" style={{ backgroundImage: "url('/hero_banner_tech_no_text.jpg')" }}>
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <h1 className="hero-title">Upgrade Your<br/>Lifestyle.</h1>
            <p className="hero-subtitle">Discover our new ADAPTify collection designed for the modern individual.</p>
            <Link to="/shop" className="btn btn-primary btn-large">
              Shop Now <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* Explore Section */}
        <section className="explore-section container">
          <div className="explore-container">
            <div className="explore-content">
              <h2 className="explore-title">Next-Gen Tech, <br/>Curated For You.</h2>
              <p className="explore-desc text-secondary">
                From premium audio to smart home essentials, experience technology that perfectly balances form and function.
              </p>
              <Link to="/shop" className="btn btn-outline explore-btn">
                Explore The Collection <ArrowRight size={20} />
              </Link>
            </div>
            <div className="explore-image-wrapper">
              <img src="/category_electronics_1777584569916.png" alt="Electronics Collection" className="explore-image" />
            </div>
          </div>
        </section>

        {/* Brand Promise */}
        <section className="brand-section container text-center">
          <h2 className="h2 mb-4">The ADAPTify Standard</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            We believe in technology that speaks without shouting. Uncompromising performance, 
            sleek aesthetics, and smart features that define the contemporary era.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
