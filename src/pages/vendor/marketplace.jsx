import React from 'react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  return (
    <div className="marketplace-wrapper">
      <style jsx="true">{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }
        body {
          color: #333;
          line-height: 1.6;
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
          min-height: 100vh;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          background-color: rgba(255, 255, 255, 0.95);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-img {
          height: 40px;
          width: auto;
        }
        .logo-text {
          font-size: 1.8rem;
          font-weight: bold;
          color: #2c3e50;
          font-style: italic;
        }
        nav {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        nav a {
          font-weight: 600;
          color: #2c3e50;
          transition: color 0.3s;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        nav a:hover {
          color: #e74c3c;
        }
        .notification-badge {
          background-color: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 5px;
        }
        .profile-btn {
          background-color: #e74c3c;
          color: white !important;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        .profile-btn:hover {
          background-color: #c0392b;
        }
        .marketplace-container {
          padding: 140px 5% 60px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .marketplace-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .marketplace-header h2 {
          font-size: 2.2rem;
          color: white;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }
        .marketplace-header p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .search-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
        }
        .search-container {
          flex: 1;
          min-width: 250px;
          position: relative;
        }
        .search-input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 3rem;
          border: 2px solid #e1e5eb;
          border-radius: 5px;
          font-size: 1rem;
          background-color: rgba(255, 255, 255, 0.95);
          transition: all 0.3s;
        }
        .search-input:focus {
          border-color: #e74c3c;
          outline: none;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }
        .filter-btn {
          padding: 0.6rem 1.2rem;
          background-color: rgba(255, 255, 255, 0.95);
          border: 2px solid #e1e5eb;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        .filter-btn:hover,
        .filter-btn.active {
          background-color: #e74c3c;
          color: white;
          border-color: #e74c3c;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .product-card {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          border-left: 4px solid #e74c3c;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        .product-image {
          height: 200px;
          background-size: cover;
          background-position: center;
        }
        .product-info {
          padding: 1.5rem;
        }
        .product-title {
          font-size: 1.3rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        .product-vendor {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .product-price {
          font-size: 1.4rem;
          font-weight: 700;
          color: #e74c3c;
          margin-bottom: 1.5rem;
        }
        .product-actions {
          display: flex;
          gap: 1rem;
        }
        .btn {
          padding: 0.6rem 1.2rem;
          background-color: #e74c3c;
          color: white;
          border-radius: 5px;
          font-weight: 600;
          transition: background-color 0.3s, transform 0.2s;
          text-align: center;
        }
        .btn:hover {
          background-color: #c0392b;
          transform: translateY(-2px);
        }
        .btn.secondary {
          background-color: transparent;
          border: 2px solid #e74c3c;
          color: #e74c3c;
        }
        .btn.secondary:hover {
          background-color: #e74c3c;
          color: white;
        }
        footer {
          background-color: rgba(44, 62, 80, 0.9);
          color: white;
          padding: 2rem 5%;
          margin-top: 3rem;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-logo {
          font-size: 1.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        @media (max-width: 768px) {
          header {
            flex-direction: column;
            gap: 1rem;
          }
          .marketplace-container {
            padding-top: 160px;
          }
        }
      `}</style>

      <header>
        <Link to="/" className="logo">
          <img src="../../assests/images/Logo.png" alt="Sport Sphere Logo" className="logo-img" />
          <div className="logo-text">Sports Sphere</div>
        </Link>
        <nav>
          <Link to="/vendors"><i className="fas fa-home"></i> Vendors</Link>
          <Link to="/cart"><i className="fas fa-shopping-cart"></i> Cart <span className="notification-badge">2</span></Link>
          <Link to="/profile" className="profile-btn"><i className="fas fa-user"></i></Link>
        </nav>
      </header>

      <main className="marketplace-container">
        <div className="marketplace-header">
          <h2><i className="fas fa-store"></i> Gear Up for Success</h2>
          <p>Premium sports equipment and training gear from trusted vendors</p>
        </div>

        <div className="search-filters">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input type="text" className="search-input" placeholder="Search products..." />
          </div>
          <button className="filter-btn active"><i className="fas fa-filter"></i> All</button>
          <button className="filter-btn"><i className="fas fa-dumbbell"></i> Training</button>
          <button className="filter-btn"><i className="fas fa-tshirt"></i> Apparel</button>
          <button className="filter-btn"><i className="fas fa-running"></i> Running</button>
        </div>

        <div className="products-grid">
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://m.media-amazon.com/images/I/71C9UIJLGOL._AC_UF1000,1000_QL80_.jpg')" }}></div>
            <div className="product-info">
              <h3 className="product-title">Professional Resistance Bands Set</h3>
              <div className="product-vendor">By Fitness Pro</div>
              <div className="product-price">PKR 2,500</div>
              <div className="product-actions">
                <Link to="/report" className="btn"><i className="fas fa-eye"></i> View</Link>
                <button className="btn secondary"><i className="fas fa-cart-plus"></i> Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo"><i className="fas fa-running"></i> Sport Sphere</div>
          <div>© 2025 Sport Sphere. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
