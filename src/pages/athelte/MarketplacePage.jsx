import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/marketplace.css';

// Add this for notification
const Notification = ({ message, onClose }) => (
  <div className='cart-notification'>
    {message}
    <button onClick={onClose} className='close-btn'>
      &times;
    </button>
  </div>
);

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Get user ID from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?._id;

  const categories = [
    'All',
    'Training',
    'Apparel',
    'Running',
    'Equipment',
    'Nutrition',
    'Tech',
    'Recovery',
  ];

  // Fetch products and cart from API
  useEffect(() => {
    fetchProducts();
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await response.json();
      setCart(data);
      // Save cart data to localStorage for persistence
      localStorage.setItem('cartData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Try to get cart data from localStorage as fallback
      const savedCart = localStorage.getItem('cartData');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: 1,
          }),
        }
      );

      if (response.ok) {
        fetchCart(); // Refresh cart from server
        setNotification('Product added to cart!');
        setTimeout(() => setNotification(null), 2000);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/remove/${productId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        fetchCart(); // Refresh cart from server
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity: newQuantity,
          }),
        }
      );

      if (response.ok) {
        fetchCart(); // Refresh cart from server
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Pass cart data to checkout page
    navigate('/athlete/checkout', {
      state: {
        cartItems: cart,
        totalAmount: getCartTotal(),
      },
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/src/assets/images/Logo.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <AthleteLayout>
        <div className='marketplace-container'>
          <div className='loading'>Loading products...</div>
        </div>
      </AthleteLayout>
    );
  }

  return (
    <AthleteLayout>
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div className='marketplace-container'>
        <div className='marketplace-header'>
          <h2>
            <i className='fas fa-store'></i> Gear Up for Success
          </h2>
          <p>Premium sports equipment and training gear from trusted vendors</p>
        </div>

        <div className='search-filters'>
          <div className='search-container'>
            <i className='fas fa-search search-icon'></i>
            <input
              type='text'
              className='search-input'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='filter-buttons'>
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${
                  selectedCategory === category ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <i className={`fas fa-${getCategoryIcon(category)}`}></i>{' '}
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className='cart-header'>
          <button
            className='cart-toggle'
            onClick={() => setShowCart(!showCart)}
          >
            <i className='fas fa-shopping-cart'></i>
            Cart ({getCartCount()})
          </button>
        </div>

        {showCart && (
          <div className='cart-sidebar show'>
            <div className='cart-header'>
              <h3>Shopping Cart</h3>
              <button onClick={() => setShowCart(false)}>
                <i className='fas fa-times'></i>
              </button>
            </div>

            {cart.length === 0 ? (
              <div className='empty-cart'>
                <i className='fas fa-shopping-cart'></i>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className='cart-items'>
                  {cart.map((item) => (
                    <div key={item._id} className='cart-item'>
                      <img src={getImageUrl(item.image)} alt={item.name} />
                      <div className='cart-item-details'>
                        <h4>{item.name}</h4>
                        <p>PKR {item.price}</p>
                        <div className='quantity-controls'>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                          >
                            <i className='fas fa-minus'></i>
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            <i className='fas fa-plus'></i>
                          </button>
                        </div>
                      </div>
                      <button
                        className='remove-item'
                        onClick={() => removeFromCart(item._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div className='cart-footer'>
                  <div className='cart-total'>
                    <strong>Total: PKR {getCartTotal().toFixed(2)}</strong>
                  </div>
                  <button className='checkout-btn' onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className='products-grid'>
          {filteredProducts.length === 0 ? (
            <div className='no-products'>
              <i className='fas fa-search'></i>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className='product-card'>
                <div
                  className='product-image'
                  style={{
                    backgroundImage: `url('${getImageUrl(product.image)}')`,
                  }}
                ></div>
                <div className='product-info'>
                  <h3 className='product-title'>{product.name}</h3>
                  <div className='product-vendor'>
                    By {product.vendorName || 'Vendor'}
                  </div>
                  <div className='product-price'>PKR {product.price}</div>
                  <div className='product-stock'>
                    {product.stock > 0 ? (
                      <span className='in-stock'>
                        In Stock ({product.stock})
                      </span>
                    ) : (
                      <span className='out-of-stock'>Out of Stock</span>
                    )}
                  </div>
                  <div className='product-actions'>
                    <button
                      className='btn secondary'
                      onClick={() =>
                        navigate(`/athlete/product/${product._id}`)
                      }
                    >
                      View
                    </button>
                    <button
                      className='btn'
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <i className='fas fa-cart-plus'></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AthleteLayout>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    All: 'filter',
    Training: 'dumbbell',
    Apparel: 'tshirt',
    Running: 'running',
    Equipment: 'cog',
    Nutrition: 'apple-alt',
    Tech: 'mobile-alt',
    Recovery: 'heart',
  };
  return icons[category] || 'tag';
};

export default MarketplacePage;
