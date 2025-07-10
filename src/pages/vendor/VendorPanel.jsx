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
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(false);
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
    setShowModal(true);
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h1>My Products</h1>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            Add Product
          </button>
        </div>

        {/* Product List */}
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

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div
            className='modal'
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: '30px',
                borderRadius: '10px',
                minWidth: '500px',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
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
                <div
                  style={{ display: 'flex', gap: '10px', marginTop: '20px' }}
                >
                  <button type='submit' disabled={saving}>
                    {saving
                      ? 'Saving...'
                      : editId
                      ? 'Update Product'
                      : 'Add Product'}
                  </button>
                  <button
                    type='button'
                    onClick={resetForm}
                    style={{ backgroundColor: '#6c757d' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
