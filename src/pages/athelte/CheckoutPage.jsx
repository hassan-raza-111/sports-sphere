import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/checkout.css';

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
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Get user ID from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?._id;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Fetch cart items on component mount
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const shippingInfo = { fullName, address, city, zip, email };
      const products = cartItems.map((item) => ({
        productId: item._id,
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

      if (res.status === 201) {
        setSuccess('Order placed successfully!');
        // Clear cart after successful order
        await fetch(`http://localhost:5000/api/cart/${userId}/clear`, {
          method: 'DELETE',
        });
        // Redirect to marketplace after 2 seconds
        setTimeout(() => {
          navigate('/athlete/marketplace');
        }, 2000);
      }
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
    <AthleteLayout>
      <div className='checkout-container'>
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
            {cartItems.map((item, index) => (
              <div key={index} className='order-item'>
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>PKR {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className='order-item'>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className='order-item'>
              <span>Tax</span>
              <span>PKR {(totalAmount * 0.15).toFixed(2)}</span>
            </div>
          </div>
          <div className='order-total'>
            <span>Total</span>
            <span>PKR {(totalAmount + totalAmount * 0.15).toFixed(2)}</span>
          </div>
          <div className='secure-checkout'>
            <i className='fas fa-lock'></i>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </AthleteLayout>
  );
}
