import React from "react";

const vendorsStyles = `
  /* Reset and base styles */
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

  /* Header styles - matching dashboard */
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

  nav a:hover,
  nav a.active {
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

  /* Vendors page specific styles */
  .vendors-container {
    padding: 140px 5% 60px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .vendors-heading {
    font-size: 2.2rem;
    color: white;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 15px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  .vendor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .vendor-card {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    border-left: 4px solid #e74c3c;
  }

  .vendor-card:hover {
    transform: translateY(-5px);
  }

  .vendor-card img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 1rem;
    border: 3px solid #e74c3c;
  }

  .vendor-card h3 {
    font-size: 1.3rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .vendor-card p {
    color: #7f8c8d;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .btn {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background-color: #e74c3c;
    color: white;
    border-radius: 5px;
    font-weight: 600;
    transition: background-color 0.3s, transform 0.2s;
    text-decoration: none;
  }

  .btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }

  /* Footer styles */
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

  .copyright {
    font-size: 0.9rem;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    header {
      padding: 1rem 5%;
      flex-direction: column;
      gap: 1rem;
    }

    nav {
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .vendors-container {
      padding-top: 160px;
    }

    .vendors-heading {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 576px) {
    .vendor-grid {
      grid-template-columns: 1fr;
    }

    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
`;

const Vendors = () => {
  return (
    <div>
      {/* Inject styles */}
      <style dangerouslySetInnerHTML={{ __html: vendorsStyles }} />

      <header>
        <a href="/index.html" className="logo">
          <img
            src="/assets/images/Logo.png"
            alt="Sport Sphere Logo"
            className="logo-img"
          />
          <div>
            <div className="logo-text">Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href="/index.html">
            <i className="fas fa-home"></i> <span>Home</span>
          </a>
          <a href="/marketplace.html" className="active">
            <i className="fas fa-store"></i> <span>Marketplace</span>
          </a>
          <a href="/messages.html">
            <i className="fas fa-envelope"></i> <span>Messages</span>
          </a>
          <a href="/profile.html" className="profile-btn">
            <i className="fas fa-user"></i>
          </a>
        </nav>
      </header>

      <main className="vendors-container">
        <h2 className="vendors-heading">
          <i className="fas fa-handshake"></i> Featured Vendors
        </h2>
        <div className="vendor-grid">
          <div className="vendor-card">
            <img src="/assets/images/Gear2.jpeg" alt="ProGear Sports" />
            <h3>ProGear Sports</h3>
            <p>
              High-quality gear for athletes of all levels with 20+ years of
              industry experience.
            </p>
            <a
              href="http://www.progearvision.com/"
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Store
            </a>
          </div>

          <div className="vendor-card">
            <img src="/assets/images/Elite Wear.jpeg" alt="Elite Wear" />
            <h3>Elite Wear</h3>
            <p>
              Performance apparel trusted by top-tier trainers and professional
              athletes.
            </p>
            <a
              href="https://elitewear.pk/?srsltid=AfmBOopMfkJw8DnOWfajhxcsouVABaxj2R52qQXZHwg3ocH5sSA_BSN9"
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Store
            </a>
          </div>

          <div className="vendor-card">
            <img src="/assets/images/Flex.jpeg" alt="Flex Equip" />
            <h3>Flex Equip</h3>
            <p>
              Innovative fitness tools and training equipment for optimal
              performance.
            </p>
            <a
              href="https://www.flex.sport/en/productos/equipment/"
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Store
            </a>
          </div>

          <div className="vendor-card">
            <img
              src="/assets/images/Peak Nutrition.jpeg"
              alt="Peak Nutrition"
            />
            <h3>Peak Nutrition</h3>
            <p>
              Science-backed supplements and nutrition plans for serious
              athletes.
            </p>
            <a
              href="https://peaknutrition.com/"
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Store
            </a>
          </div>

          <div className="vendor-card">
            <img src="/assets/images/Titan Tech.jpeg" alt="Titan Tech" />
            <h3>Titan Tech</h3>
            <p>
              Wearable tech and analytics tools to track and improve
              performance.
            </p>
            <a
              href="https://www.recovery-plus.es/?lang=en"
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Store
            </a>
          </div>

          <div className="vendor-card">
            <img src="/assets/images/Recover.jpeg" alt="Recovery Plus" />
            <h3>Recovery Plus</h3>
            <p>
              Specialized recovery equipment and therapies for faster results.
            </p>
            <a
              href="https://www.recovery-plus.es/?lang=en"
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Store
            </a>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-running"></i> Sport Sphere
          </div>
          <div className="copyright">
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Vendors;
