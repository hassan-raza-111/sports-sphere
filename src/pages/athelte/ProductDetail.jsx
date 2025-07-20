import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/marketplace.css';
import { FaStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?._id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/products/${productId}`
        );
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch feedbacks for this product
  useEffect(() => {
    setFeedbackLoading(true);
    setFeedbackError(null);
    fetch(`http://localhost:5000/api/feedback/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data);
        setFeedbackLoading(false);
      })
      .catch(() => {
        setFeedbackError('Failed to load feedback');
        setFeedbackLoading(false);
      });
  }, [productId, submitMsg]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setSubmitMsg('You must be logged in to submit feedback.');
      return;
    }
    if (!rating || !comment.trim()) {
      setSubmitMsg('Please provide a rating and comment.');
      return;
    }
    setSubmitting(true);
    setSubmitMsg('');
    try {
      const res = await fetch(
        `http://localhost:5000/api/feedback/product/${productId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, feedbackText: comment, userId }),
        }
      );
      if (!res.ok) throw new Error('Failed to submit feedback');
      setRating(0);
      setComment('');
      setSubmitMsg('Feedback submitted!');
    } catch (err) {
      setSubmitMsg('Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AthleteLayout>
        <div className='marketplace-container'>Loading...</div>
      </AthleteLayout>
    );
  }
  if (error) {
    return (
      <AthleteLayout>
        <div className='marketplace-container'>{error}</div>
      </AthleteLayout>
    );
  }
  if (!product) return null;

  return (
    <AthleteLayout>
      <div className='marketplace-container'>
        <div className='product-detail-modern-card'>
          <div className='product-detail-image-section'>
            <img
              src={
                product.image?.startsWith('http')
                  ? product.image
                  : `http://localhost:5000${product.image}`
              }
              alt={product.name}
              className='product-detail-main-image'
            />
          </div>
          <div className='product-detail-content-section'>
            <h1 className='product-detail-title'>{product.name}</h1>
            <div className='product-detail-meta'>
              <span className='product-detail-category'>
                <i className='fas fa-tag'></i> {product.category}
              </span>
              <span className='product-detail-vendor'>
                <i className='fas fa-store'></i>{' '}
                {product.vendorName || 'Vendor'}
              </span>
            </div>
            <div className='product-detail-price'>PKR {product.price}</div>
            <div
              className={`product-detail-stock ${
                product.stock > 0 ? 'in-stock' : 'out-of-stock'
              }`}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
            <div className='product-detail-description'>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
        <div className='product-feedback-section'>
          <h2>Product Feedback</h2>
          <form className='feedback-form' onSubmit={handleFeedbackSubmit}>
            <div className='rating-input'>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={28}
                  style={{ cursor: 'pointer', marginRight: 4 }}
                  color={star <= rating ? '#e74c3c' : '#ccc'}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <textarea
              className='feedback-textarea'
              placeholder='Write your feedback...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={300}
              required
            />
            <button
              className='btn'
              type='submit'
              disabled={submitting}
              style={{ marginTop: 10 }}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            {submitMsg && (
              <div
                style={{
                  marginTop: 8,
                  color: submitMsg.includes('success') ? 'green' : 'red',
                }}
              >
                {submitMsg}
              </div>
            )}
          </form>
          <div className='feedback-list'>
            {feedbackLoading ? (
              <div>Loading feedback...</div>
            ) : feedbackError ? (
              <div style={{ color: 'red' }}>{feedbackError}</div>
            ) : feedbacks.length === 0 ? (
              <div>No feedback yet.</div>
            ) : (
              feedbacks.map((fb) => (
                <div className='feedback-item' key={fb._id}>
                  <div className='feedback-header'>
                    <span className='feedback-user'>
                      {fb.userId?.name || 'User'}
                    </span>
                    <span className='feedback-rating'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={18}
                          color={star <= fb.rating ? '#e74c3c' : '#ccc'}
                        />
                      ))}
                    </span>
                    <span className='feedback-date'>
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='feedback-text'>{fb.feedbackText}</div>
                </div>
              ))
            )}
          </div>
          <style>{`
            .product-feedback-section {
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 2px 12px rgba(44,62,80,0.08);
              margin: 2rem auto 0 auto;
              max-width: 900px;
              padding: 2rem 2.5rem;
            }
            .product-feedback-section h2 {
              color: #2c3e50;
              margin-bottom: 1.2rem;
              font-size: 1.5rem;
            }
            .feedback-form {
              display: flex;
              flex-direction: column;
              gap: 0.7rem;
              margin-bottom: 2rem;
            }
            .rating-input {
              display: flex;
              align-items: center;
              margin-bottom: 0.5rem;
            }
            .feedback-textarea {
              border: 1.5px solid #e1e5eb;
              border-radius: 6px;
              padding: 0.8rem 1rem;
              font-size: 1rem;
              resize: vertical;
              min-height: 60px;
              max-height: 180px;
            }
            .feedback-list {
              margin-top: 1.5rem;
            }
            .feedback-item {
              background: #f8f9fa;
              border-radius: 8px;
              padding: 1rem 1.2rem;
              margin-bottom: 1.2rem;
              box-shadow: 0 1px 4px rgba(44,62,80,0.04);
            }
            .feedback-header {
              display: flex;
              align-items: center;
              gap: 1.2rem;
              margin-bottom: 0.5rem;
              font-size: 1rem;
              color: #7f8c8d;
            }
            .feedback-user {
              font-weight: 600;
              color: #2c3e50;
            }
            .feedback-rating {
              display: flex;
              align-items: center;
              gap: 2px;
            }
            .feedback-date {
              font-size: 0.95rem;
              color: #aaa;
            }
            .feedback-text {
              color: #2c3e50;
              font-size: 1.08rem;
              margin-left: 2px;
            }
            @media (max-width: 900px) {
              .product-feedback-section {
                padding: 1.2rem 0.5rem;
              }
            }
          `}</style>
        </div>
        <style>{`
          .product-detail-modern-card {
            display: flex;
            flex-wrap: wrap;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 24px rgba(44,62,80,0.10);
            overflow: hidden;
            margin: 2rem auto;
            max-width: 900px;
            min-height: 400px;
          }
          .product-detail-image-section {
            flex: 1 1 350px;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 320px;
            min-height: 350px;
            padding: 2rem;
          }
          .product-detail-main-image {
            max-width: 100%;
            max-height: 340px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(44,62,80,0.08);
            background: #fff;
            object-fit: contain;
          }
          .product-detail-content-section {
            flex: 2 1 400px;
            padding: 2.5rem 2rem 2rem 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .product-detail-title {
            font-size: 2.2rem;
            color: #2c3e50;
            margin-bottom: 0.5rem;
            font-weight: bold;
          }
          .product-detail-meta {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 1.2rem;
            color: #7f8c8d;
            font-size: 1.1rem;
          }
          .product-detail-meta i {
            margin-right: 6px;
            color: #e74c3c;
          }
          .product-detail-price {
            font-size: 2rem;
            color: #e74c3c;
            font-weight: 700;
            margin-bottom: 0.7rem;
          }
          .product-detail-stock {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }
          .product-detail-stock.in-stock {
            color: #27ae60;
          }
          .product-detail-stock.out-of-stock {
            color: #e74c3c;
          }
          .product-detail-description {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.2rem 1.5rem;
            margin-top: 1.5rem;
          }
          .product-detail-description h3 {
            margin-top: 0;
            color: #2c3e50;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }
          @media (max-width: 900px) {
            .product-detail-modern-card {
              flex-direction: column;
              min-height: unset;
            }
            .product-detail-image-section {
              min-width: 100%;
              min-height: 220px;
              padding: 1.5rem;
            }
            .product-detail-content-section {
              padding: 1.5rem;
            }
          }
        `}</style>
      </div>
    </AthleteLayout>
  );
};

export default ProductDetail;
