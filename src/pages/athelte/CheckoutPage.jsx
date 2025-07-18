import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const { cartItems: stateCartItems, totalAmount: stateTotalAmount } =
    location.state || {
      cartItems: [],
      totalAmount: 0,
    };

  // Get cart data from state or localStorage
  const [cartItems, setCartItems] = useState(stateCartItems);
  const [totalAmount, setTotalAmount] = useState(stateTotalAmount);

  // If no cart items from state, try to get from localStorage
  useEffect(() => {
    if (!stateCartItems || stateCartItems.length === 0) {
      const savedCart = localStorage.getItem('cartData');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        const calculatedTotal = parsedCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalAmount(calculatedTotal);
      }
    }
  }, [stateCartItems]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      alert('No items in cart. Please add items to cart first.');
      navigate('/athlete/marketplace');
    }
  }, [cartItems, navigate]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?._id;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'http://localhost:5000/api/payments/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            cartItems,
            shippingInfo,
          }),
        }
      );

      const result = await response.json();

      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <AthleteLayout>
      <div className='checkout-container'>
        <div className='checkout-content'>
          <h1>Checkout</h1>

          <div className='order-summary'>
            <h3>Order Summary</h3>
            {cartItems.map((item, index) => (
              <div key={index} className='cart-item'>
                <img src={item.image} alt={item.name} />
                <div className='item-details'>
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p className='price'>Rs. {item.price}</p>
                </div>
              </div>
            ))}
            <div className='total'>
              <h3>Total: Rs. {totalAmount}</h3>
            </div>
          </div>

          <form onSubmit={handleCheckout} className='checkout-form'>
            <div className='shipping-info'>
              <h3>Shipping Information</h3>
              <div className='form-row'>
                <input
                  type='text'
                  placeholder='Full Name'
                  value={shippingInfo.name}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, name: e.target.value })
                  }
                  required
                />
                <input
                  type='email'
                  placeholder='Email'
                  value={shippingInfo.email}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-row'>
                <input
                  type='tel'
                  placeholder='Phone'
                  value={shippingInfo.phone}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-row'>
                <input
                  type='text'
                  placeholder='Address'
                  value={shippingInfo.address}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      address: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='form-row'>
                <input
                  type='text'
                  placeholder='City'
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                  required
                />
                <input
                  type='text'
                  placeholder='Postal Code'
                  value={shippingInfo.postalCode}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      postalCode: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className='payment-section'>
              <h3>Payment Information</h3>
              <div className='stripe-info'>
                <p>You will be redirected to Stripe's secure payment page</p>
                <div className='payment-icons'>
                  <i className='fab fa-cc-visa'></i>
                  <i className='fab fa-cc-mastercard'></i>
                  <i className='fab fa-cc-amex'></i>
                </div>
              </div>
            </div>

            {totalAmount < 150 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#fff6e5',
                  border: '1.5px solid #ffb347',
                  color: '#b26a00',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 16,
                  fontWeight: 500,
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(255,179,71,0.08)',
                }}
              >
                <span style={{ fontSize: 22, color: '#ff9800' }}>⚠️</span>
                <span>
                  Minimum order amount for Stripe is <b>Rs. 150</b>. Please add
                  more items to your cart.
                </span>
              </div>
            )}
            {error && <div className='error-message'>{error}</div>}

            <button
              type='submit'
              disabled={loading || totalAmount < 150}
              className='pay-button'
            >
              {loading
                ? 'Processing...'
                : `Proceed to Payment - Rs. ${totalAmount}`}
            </button>
          </form>
        </div>
      </div>
    </AthleteLayout>
  );
};

export default CheckoutPage;
