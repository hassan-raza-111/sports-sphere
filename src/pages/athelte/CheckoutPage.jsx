import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('jazzcash');
  const [selectedBank, setSelectedBank] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Hardcoded cart items for now (replace with real cart logic)
  const cartItems = [
    {
      productId: '1234567890abcdef12345678',
      name: 'Training Ball',
      quantity: 1,
      price: 24.99,
    },
    {
      productId: 'abcdef1234567890abcdef12',
      name: 'Premium Jump Rope',
      quantity: 1,
      price: 29.99,
    },
  ];
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // For demo, userId is hardcoded. Replace with real user auth.
      const userId = 'demo-user-id';
      const shippingInfo = { fullName, address, city, zip, email };
      const products = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));
      const payload = {
        userId,
        products,
        totalAmount,
        paymentMethod,
        shippingInfo,
      };
      const res = await axios.post('http://localhost:5000/api/orders', payload);
      setSuccess('Order placed successfully!');
    } catch (err) {
      setError('Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Hide bank selection if not 'bank' method
    const bankSelection = document.querySelector('.bank-selection');
    if (paymentMethod === 'bank') {
      bankSelection.style.display = 'block';
    } else {
      bankSelection.style.display = 'none';
    }
  }, [paymentMethod]);

  return (
    <div className='body'>
      {/* Header */}
      <header>
        <a href='index.html' className='logo'>
          <img
            src='assets/images/Logo.png'
            alt='Sport Sphere Logo'
            className='logo-img'
          />
          <div>
            <div className='logo-text'>Sports Sphere</div>
            <div className='logo-tagline'>Your All-in-One Sports Hub</div>
          </div>
        </a>
        <nav>
          <a href='index.html'>
            <i className='fas fa-home'></i> Home
          </a>
          <a href='marketplace.html'>
            <i className='fas fa-store'></i> Marketplace
          </a>
          <a href='cart.html'>
            <i className='fas fa-shopping-cart'></i> Cart{' '}
            <span className='notification-badge'>3</span>
          </a>
          <a href='profile.html' className='profile-btn'>
            <i className='fas fa-user'></i>
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className='checkout-container'>
        <h2 className='checkout-heading'>
          <i className='fas fa-shopping-cart'></i> Checkout
        </h2>

        <div className='checkout-form'>
          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className='form-section'>
              <h3>
                <i className='fas fa-user'></i> Contact Information
              </h3>
              <div className='form-group'>
                <label htmlFor='email'>Email Address</label>
                <input
                  type='email'
                  id='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className='form-section'>
              <h3>
                <i className='fas fa-truck'></i> Shipping Address
              </h3>
              <div className='form-group'>
                <label htmlFor='full-name'>Full Name</label>
                <input
                  type='text'
                  id='full-name'
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='address'>Address</label>
                <input
                  type='text'
                  id='address'
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='city'>City</label>
                  <input
                    type='text'
                    id='city'
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='zip'>ZIP Code</label>
                  <input
                    type='text'
                    id='zip'
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className='form-section'>
              <h3>
                <i className='fas fa-credit-card'></i> Payment Method
              </h3>
              <div className='payment-methods'>
                {/* JazzCash */}
                <div
                  className={`payment-method ${
                    paymentMethod === 'jazzcash' ? 'active' : ''
                  }`}
                  onClick={() => setPaymentMethod('jazzcash')}
                >
                  <i className='fas fa-mobile-alt'></i>
                  <div>JazzCash</div>
                </div>

                {/* EasyPaisa */}
                <div
                  className={`payment-method ${
                    paymentMethod === 'easypaisa' ? 'active' : ''
                  }`}
                  onClick={() => setPaymentMethod('easypaisa')}
                >
                  <i className='fas fa-wallet'></i>
                  <div>EasyPaisa</div>
                </div>

                {/* Bank Transfer */}
                <div
                  className={`payment-method ${
                    paymentMethod === 'bank' ? 'active' : ''
                  }`}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <i className='fas fa-university'></i>
                  <div>Bank Transfer</div>
                </div>
              </div>

              {/* Bank Selection - conditional rendering */}
              <div
                className='bank-selection'
                style={{ display: paymentMethod === 'bank' ? 'block' : 'none' }}
              >
                <h4>Select Your Bank</h4>
                <div className='bank-options'>
                  {['hbl', 'ubl', 'mcb', 'alfalah', 'meezan', 'askari'].map(
                    (bank) => (
                      <div
                        key={bank}
                        className={`bank-option ${
                          selectedBank === bank ? 'active' : ''
                        }`}
                        onClick={() => setSelectedBank(bank)}
                      >
                        <span>
                          {bank.charAt(0).toUpperCase() + bank.slice(1)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Card Details */}
              <div className='form-group'>
                <label htmlFor='card-number'>Card Number</label>
                <input
                  type='text'
                  id='card-number'
                  placeholder='1234 5678 9012 3456'
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='expiry'>Expiry Date</label>
                  <input
                    type='text'
                    id='expiry'
                    placeholder='MM/YY'
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='cvv'>CVV</label>
                  <input
                    type='text'
                    id='cvv'
                    placeholder='123'
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type='submit' className='btn' disabled={loading}>
              <i className='fas fa-lock'></i>{' '}
              {loading ? 'Placing Order...' : 'Complete Order'}
            </button>
            {success && (
              <div style={{ color: 'green', marginTop: 10 }}>{success}</div>
            )}
            {error && (
              <div style={{ color: 'red', marginTop: 10 }}>{error}</div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className='order-summary'>
          <h3>
            <i className='fas fa-receipt'></i> Order Summary
          </h3>
          <div className='order-items'>
            <div className='order-item'>
              <span>Training Ball x1</span>
              <span>PKR 24.99</span>
            </div>
            <div className='order-item'>
              <span>Premium Jump Rope x1</span>
              <span>PKR 29.99</span>
            </div>
            <div className='order-item'>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className='order-item'>
              <span>Tax</span>
              <span>PKR 3.30</span>
            </div>
          </div>
          <div className='order-total'>
            <span>Total</span>
            <span>PKR 58.28</span>
          </div>
          <div className='secure-checkout'>
            <i className='fas fa-lock'></i>
            <span>Secure Checkout</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <i className='fas fa-running'></i> Sport Sphere
          </div>
          <div className='copyright'>
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }
        .body {
          color: #333;
          line-height: 1.6;
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')
              no-repeat center center/cover;
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
        .logo-tagline {
          font-size: 0.8rem;
          color: #7f8c8d;
          margin-top: 3px;
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
        .checkout-container {
          padding: 140px 5% 60px;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }
        @media (max-width: 992px) {
          .checkout-container {
            grid-template-columns: 1fr;
          }
          .order-summary {
            margin-top: 2rem;
          }
        }
        /* Add remaining styles as per original CSS */
      `}</style>
    </div>
  );
}
