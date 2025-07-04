import React from "react";

const vendorProfileStyles = `
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    background: #fff; 
    padding: 10px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  header img {
    height: 40px;
  }

  header nav a {
    margin-left: 20px;
    text-decoration: none;
    color: #333;
    font-weight: 500;
    border: 1px solid white;
    border-radius: 20px;
    padding: 6px 14px;
    transition: all 0.3s ease;
  }

  header nav a:hover {
    color: #e63946;
    background-color: #f8f8f8;
  }

  .container {
    max-width: 800px;
    margin: 40px auto;
    background: rgba(255, 255, 255, 0.95);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .profile-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .profile-header img {
    width: 130px;
    height: 130px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    margin-bottom: 15px;
  }

  h1 {
    margin: 0;
    font-size: 28px;
    color: #e63946;
  }

  .info-section {
    margin-bottom: 20px;
  }

  .info-title {
    font-weight: bold;
    color: #555;
    margin-bottom: 6px;
    display: block;
  }

  .info-value {
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  .social-icons {
    display: flex;
    gap: 20px;
    margin-top: 15px;
  }

  .social-icons a {
    text-decoration: none;
    color: #fff;
    background-color: #333;
    padding: 10px 14px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    transition: background 0.3s ease;
  }

  .social-icons a:hover {
    background-color: #e63946;
  }

  .social-icons svg {
    width: 18px;
    height: 18px;
    fill: #fff;
  }

  @media (max-width: 600px) {
    .social-icons {
      flex-direction: column;
      gap: 10px;
    }

    header nav {
      flex-direction: column;
      align-items: flex-start;
    }

    header nav a {
      margin: 10px 0 0 0;
    }
  }
`;

const VendorProfile = () => {
  return (
    <div>
      {/* Inject CSS dynamically */}
      <style dangerouslySetInnerHTML={{ __html: vendorProfileStyles }} />

      <header>
        <div>
          <img src="/assets/images/Logo.png" alt="Sports Sphere Logo" />
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/marketplace">Marketplace</a>
          <a href="/update-profile">Update Profile</a>
        </nav>
      </header>

      <div className="container">
        <div className="profile-header">
          <img
            src="https://via.placeholder.com/130"
            alt="Vendor Profile Picture"
            id="vendorImage"
          />
          <h1 id="vendorName">Alex Johnson</h1>
          <p id="storeName">Alex's Athletics</p>
        </div>

        <div className="info-section">
          <div className="info-title">Email</div>
          <div className="info-value" id="vendorEmail">
            alex@example.com
          </div>
        </div>

        <div className="info-section">
          <div className="info-title">Phone</div>
          <div className="info-value" id="vendorPhone">
            +1 555-123-4567
          </div>
        </div>

        <div className="info-section">
          <div className="info-title">Bio</div>
          <div className="info-value" id="vendorBio">
            Passionate about quality athletic gear, serving the sports community
            since 2010.
          </div>
        </div>

        <div className="info-section">
          <div className="info-title">Social Links</div>
          <div className="social-icons">
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.5.5.2.9.5 1.3.9.4.4.7.8.9 1.3.2.4.4 1 .5 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.5 2.2-.2.5-.5.9-.9 1.3-.4.4-.8.7-1.3.9-.4.2-1 .4-2.2.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.5-.5-.2-.9-.5-1.3-.9-.4-.4-.7-.8-.9-1.3-.2-.4-.4-1-.5-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.5-2.2.2-.5.5-.9.9-1.3.4-.4.8-.7 1.3-.9.4-.2 1-.4 2.2-.5 1.3-.1 1.7-.1 4.9-.1zm0-2.2C8.7 0 8.3 0 7 .1 5.8.2 4.7.4 3.8.8 2.9 1.1 2.1 1.7 1.4 2.4.7 3.1.1 3.9.1 4.8 0 5.7 0 6.7 0 12s0 6.3.1 7.2c.1.9.6 1.7 1.3 2.4.7.7 1.5 1.3 2.4 1.6.9.3 2 .5 3.2.6 1.3.1 1.7.1 4.9.1s3.6 0 4.9-.1c1.2-.1 2.3-.3 3.2-.6.9-.3 1.7-.9 2.4-1.6.7-.7 1.2-1.5 1.3-2.4.1-.9.1-1.3.1-7.2s0-6.3-.1-7.2c-.1-.9-.6-1.7-1.3-2.4-.7-.7-1.5-1.3-2.4-1.6-.9-.3-2-.5-3.2-.6C15.7 0 15.3 0 12 0z" />
              </svg>
              Instagram
            </a>

            <a
              href="https://facebook.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.6 9.8v-6.9h-2.3V12h2.3V9.4c0-2.3 1.3-3.5 3.4-3.5 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v6.9A10 10 0 0 0 22 12z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
