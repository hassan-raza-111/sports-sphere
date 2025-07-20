import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import '../../css/marketplace.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <Layout role='coach'>
        <div className='marketplace-container'>Loading...</div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout role='coach'>
        <div className='marketplace-container'>{error}</div>
      </Layout>
    );
  }
  if (!product) return null;

  return (
    <Layout role='coach'>
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
    </Layout>
  );
};

export default ProductDetail;
