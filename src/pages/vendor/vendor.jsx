import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config.js';
import { Link } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import '../../css/vendor.css';
import logoImg from '../../assets/images/Logo.png';
import {
  FaHome,
  FaStore,
  FaEnvelope,
  FaUser,
  FaHandshake,
  FaRunning,
  FaExternalLinkAlt,
  FaGlobe,
} from 'react-icons/fa';

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch('${API_BASE_URL}/vendor-profile');
        if (!res.ok) throw new Error('Failed to fetch vendors');
        const data = await res.json();
        setVendors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <VendorLayout>
      <div className='vendors-container'>
        <div className='vendors-header'>
          <h2 className='vendors-heading'>
            <FaHandshake /> Featured Vendors
          </h2>
          <p className='vendors-description'>
            Discover premium sports equipment and services from our trusted
            vendor partners
          </p>
        </div>

        {loading ? (
          <div className='loading-container'>
            <div className='loading-spinner'>
              <FaRunning className='spinning-icon' />
            </div>
            <p>Loading vendors...</p>
          </div>
        ) : error ? (
          <div className='error-container'>
            <FaExternalLinkAlt className='error-icon' />
            <p>Unable to load vendors. Showing featured vendors instead.</p>
          </div>
        ) : null}

        <div className='vendor-grid'>
          {vendors
            .filter((vendor) => vendor.website && vendor.website.trim() !== '')
            .map((vendor, index) => (
              <div className='vendor-card' key={vendor._id || index}>
                <div className='vendor-image-container'>
                  <img
                    src={
                      vendor.image?.startsWith('http')
                        ? vendor.image
                        : vendor.image?.replace('/assets', '/src/assets')
                    }
                    alt={vendor.storeName}
                    // onError={(e) => {
                    //   e.target.src = '/src/assets/images/Logo.png';
                    // }}
                  />
                  <div className='vendor-badge'>
                    <FaStore />
                  </div>
                </div>
                <div className='vendor-info'>
                  <h3>{vendor.storeName}</h3>
                  <p>{vendor.description}</p>
                  <div className='vendor-actions'>
                    <a
                      href={vendor.website}
                      className='btn btn-primary'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <FaGlobe /> Visit Store
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {vendors.length === 0 && !loading && (
          <div className='empty-state'>
            <FaStore className='empty-icon' />
            <h3>No Vendors Available</h3>
            <p>Check back later for new vendor partners</p>
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
