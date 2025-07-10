import React, { useState, useEffect, useRef } from 'react';
import VendorLayout from '../../components/VendorLayout';
import '../../css/vendor-panel.css';

const BACKEND_URL = 'http://localhost:5000';

const initialForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  stock: 1,
};

const categories = [
  'Training',
  'Apparel',
  'Running',
  'Equipment',
  'Nutrition',
  'Tech',
  'Recovery',
];

export default function VendorPanel() {
  const [tab, setTab] = useState('marketplace');
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef();

  // Get vendorId from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const vendorId = user?._id;

  // Fetch products for this vendor
  useEffect(() => {
    if (!vendorId) return;
    setLoading(true);
    fetch(`/api/products/vendor/${vendorId}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vendorId]);

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(form.image ? getImageUrl(form.image) : '');
    }
  };

  // Get image URL for display
  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('/uploads')) return BACKEND_URL + img;
    return img;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview('');
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit (add or edit) product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    let imagePath = form.image;
    try {
      // Upload image if new one selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('/api/products/upload-image', {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imagePath = uploadData.imagePath;
      }
      // Prepare product data
      let stockValue = Number(form.stock);
      if (isNaN(stockValue) || stockValue === '' || stockValue < 0)
        stockValue = 1;
      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: imagePath,
        category: form.category,
        stock: stockValue,
        vendorId,
      };
      console.log('Submitting productData:', productData);
      let res;
      if (editId) {
        // Edit
        res = await fetch(`/api/products/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        // Add
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }
      if (!res.ok) throw new Error('Product save failed');
      // Refresh product list
      const productsRes = await fetch(`/api/products/vendor/${vendorId}`);
      setProducts(await productsRes.json());
      resetForm();
      setTab('analytics');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
    setImagePreview(getImageUrl(product.image));
    setEditId(product._id);
    setTab('marketplace');
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    // Refresh product list
    const productsRes = await fetch(`/api/products/vendor/${vendorId}`);
    setProducts(await productsRes.json());
  };

  // Handle status update

  return (
    <VendorLayout>
      <div className='container'>
        <h1>Vendor Panel</h1>
        <div className='tabs'>
          <button
            className={`tab-button${tab === 'marketplace' ? ' active' : ''}`}
            onClick={() => {
              setTab('marketplace');
              resetForm();
            }}
          >
            Sell on Marketplace
          </button>
          <button
            className={`tab-button${tab === 'analytics' ? ' active' : ''}`}
            onClick={() => setTab('analytics')}
          >
            Product Overview
          </button>
        </div>

        {/* Add/Edit Product */}
        <div
          id='marketplace'
          className={`tab-content${tab === 'marketplace' ? ' active' : ''}`}
        >
          <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='productImage'>Product Image</label>
              <input
                type='file'
                id='productImage'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <div id='imagePreview' style={{ marginTop: 10 }}>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt='Product Preview'
                    style={{
                      maxWidth: 200,
                      borderRadius: 8,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  />
                )}
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='name'>Product Name</label>
              <input
                type='text'
                id='name'
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='price'>Price (PKR)</label>
              <input
                type='number'
                id='price'
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <textarea
                id='description'
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='category'>Category</label>
              <select
                id='category'
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value=''>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div
              className='form-group'
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <input
                type='number'
                id='stock'
                value={form.stock}
                min={0}
                onChange={handleChange}
                style={{ marginRight: 8, width: 100 }}
              />
              <label htmlFor='stock' style={{ margin: 0 }}>
                Stock
              </label>
            </div>
            {error && (
              <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>
            )}
            <button type='submit' disabled={saving}>
              {saving
                ? 'Saving...'
                : editId
                ? 'Update Product'
                : 'Submit Product'}
            </button>
            {editId && (
              <button
                type='button'
                style={{ marginLeft: 10 }}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Product List/Table */}
        <div
          id='analytics'
          className={`tab-content${tab === 'analytics' ? ' active' : ''}`}
        >
          <h2>Your Products</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className='table'>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>PKR {p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.category}</td>
                    <td>
                      {p.image && (
                        <img
                          src={getImageUrl(p.image)}
                          alt={p.name}
                          style={{ width: 60, borderRadius: 6 }}
                        />
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(p)}
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        style={{ background: '#c0392b' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {tab === 'orders' && (
          <div>
            <h2>Order Management</h2>
            {ordersLoading ? (
              <div>Loading orders...</div>
            ) : orderError ? (
              <div style={{ color: 'red' }}>{orderError}</div>
            ) : (
              <table className='table'>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Products</th>
                    <th>Buyer</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>
                        {order.products.map((p, i) => (
                          <div key={i}>
                            {p.productId?.name || 'Product'} x{p.quantity}
                          </div>
                        ))}
                      </td>
                      <td>{order.userId?.name || 'N/A'}</td>
                      <td>
                        <select
                          value={order.status}
                          disabled={statusUpdating === order._id}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                        >
                          <option value='pending'>Pending</option>
                          <option value='process'>Process</option>
                          <option value='shipped'>Shipped</option>
                          <option value='completed'>Completed</option>
                          <option value='cancelled'>Cancelled</option>
                        </select>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>
                        {order.totalAmount
                          ? `PKR ${order.totalAmount.toFixed(2)}`
                          : '-'}
                      </td>
                      <td>
                        <button onClick={() => handleViewOrder(order._id)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* Order Details Modal */}
            {orderDetail && orderDetail !== 'loading' && (
              <div
                className='modal'
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    background: '#fff',
                    padding: 30,
                    borderRadius: 10,
                    minWidth: 350,
                    maxWidth: 500,
                  }}
                >
                  <h3>Order Details</h3>
                  <div>
                    <b>Order ID:</b> {orderDetail._id}
                  </div>
                  <div>
                    <b>Buyer:</b> {orderDetail.userId?.name} (
                    {orderDetail.userId?.email})
                  </div>
                  <div>
                    <b>Status:</b> {orderDetail.status}
                  </div>
                  <div>
                    <b>Date:</b>{' '}
                    {new Date(orderDetail.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <b>Amount:</b> PKR {orderDetail.totalAmount?.toFixed(2)}
                  </div>
                  <div>
                    <b>Products:</b>
                    <ul>
                      {orderDetail.products.map((p, i) => (
                        <li key={i}>
                          {p.productId?.name || 'Product'} x{p.quantity} (PKR{' '}
                          {p.price})
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <b>Shipping:</b>{' '}
                    {orderDetail.shippingInfo
                      ? JSON.stringify(orderDetail.shippingInfo)
                      : 'N/A'}
                  </div>
                  <button
                    onClick={() => setOrderDetail(null)}
                    style={{ marginTop: 15 }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {orderDetail === 'loading' && <div>Loading order details...</div>}
          </div>
        )}

        {tab === 'earnings' && (
          <div>
            <h2>Earnings Overview</h2>
            {earningsLoading ? (
              <div>Loading earnings...</div>
            ) : earningsError ? (
              <div style={{ color: 'red' }}>{earningsError}</div>
            ) : earnings ? (
              <div style={{ display: 'flex', gap: 30, marginBottom: 30 }}>
                <div
                  style={{
                    background: '#f9fafb',
                    padding: 20,
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    minWidth: 150,
                  }}
                >
                  <b>Total Sales</b>
                  <div style={{ fontSize: 22, color: '#27ae60' }}>
                    PKR {earnings.totalSales?.toFixed(2)}
                  </div>
                </div>
                <div
                  style={{
                    background: '#f9fafb',
                    padding: 20,
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    minWidth: 150,
                  }}
                >
                  <b>Pending</b>
                  <div style={{ fontSize: 22, color: '#e67e22' }}>
                    PKR {earnings.pending?.toFixed(2)}
                  </div>
                </div>
                <div
                  style={{
                    background: '#f9fafb',
                    padding: 20,
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    minWidth: 150,
                  }}
                >
                  <b>Approved</b>
                  <div style={{ fontSize: 22, color: '#2980b9' }}>
                    PKR {earnings.approved?.toFixed(2)}
                  </div>
                </div>
                <div
                  style={{
                    background: '#f9fafb',
                    padding: 20,
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    minWidth: 150,
                  }}
                >
                  <b>Rejected</b>
                  <div style={{ fontSize: 22, color: '#c0392b' }}>
                    PKR {earnings.rejected?.toFixed(2)}
                  </div>
                </div>
              </div>
            ) : null}
            <h3>Payout Request</h3>
            <form onSubmit={handlePayoutRequest} style={{ marginBottom: 30 }}>
              <div className='form-group'>
                <label htmlFor='payoutAmount'>Amount (PKR)</label>
                <input
                  type='number'
                  id='payoutAmount'
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  required
                  min={1}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='payoutNotes'>Notes (optional)</label>
                <input
                  type='text'
                  id='payoutNotes'
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                />
              </div>
              <button type='submit' disabled={payoutLoading}>
                {payoutLoading ? 'Submitting...' : 'Request Payout'}
              </button>
              {payoutSuccess && (
                <div style={{ color: 'green', marginTop: 10 }}>
                  {payoutSuccess}
                </div>
              )}
              {payoutError && (
                <div style={{ color: 'red', marginTop: 10 }}>{payoutError}</div>
              )}
            </form>
            <h3>Payout History</h3>
            {payoutHistoryLoading ? (
              <div>Loading payout history...</div>
            ) : (
              <table className='table'>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Requested At</th>
                    <th>Processed At</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory.map((p, i) => (
                    <tr key={i}>
                      <td>PKR {p.amount?.toFixed(2)}</td>
                      <td>{p.status}</td>
                      <td>{new Date(p.requestedAt).toLocaleString()}</td>
                      <td>
                        {p.processedAt
                          ? new Date(p.processedAt).toLocaleString()
                          : '-'}
                      </td>
                      <td>{p.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'feedback' && (
          <div>
            <h2>Product Feedback</h2>
            {feedbackTabLoading ? (
              <div>Loading feedback...</div>
            ) : feedbackTabError ? (
              <div style={{ color: 'red' }}>{feedbackTabError}</div>
            ) : feedbackList.length === 0 ? (
              <div>No feedback found.</div>
            ) : (
              <table className='table'>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                    <th>Buyer</th>
                    <th>Date</th>
                    <th>Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((fb) => (
                    <tr key={fb._id}>
                      <td>{fb.productId?.name || '-'}</td>
                      <td>
                        {'★'.repeat(fb.rating)}
                        {'☆'.repeat(5 - fb.rating)}
                      </td>
                      <td>{fb.feedbackText}</td>
                      <td>{fb.userId?.name || fb.email || '-'}</td>
                      <td>{new Date(fb.createdAt).toLocaleString()}</td>
                      <td>
                        {fb.reply ? (
                          <div>
                            <div style={{ color: '#2980b9' }}>{fb.reply}</div>
                            <div style={{ fontSize: 12, color: '#888' }}>
                              {fb.repliedAt
                                ? 'Replied: ' +
                                  new Date(fb.repliedAt).toLocaleString()
                                : ''}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <input
                              type='text'
                              value={replyText[fb._id] || ''}
                              onChange={(e) =>
                                handleReplyChange(fb._id, e.target.value)
                              }
                              placeholder='Write a reply...'
                              style={{ width: 120 }}
                            />
                            <button
                              onClick={() => handleReplySubmit(fb._id)}
                              disabled={
                                replying[fb._id] ||
                                !(replyText[fb._id] && replyText[fb._id].trim())
                              }
                              style={{ marginLeft: 5 }}
                            >
                              {replying[fb._id] ? 'Replying...' : 'Reply'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
