import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/images/Logo.png';
import { API_BASE_URL } from '../config.js';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    sports: '',
    sessionType: 'digital',
    location: '',
    certificates: [],
    preferredSport: '',
    level: 'beginner',
    storeName: '',
    vendorType: 'marketplace',
    website: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [id]: files });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'certificates' && value && value.length > 0) {
          for (let i = 0; i < value.length; i++) {
            data.append('certificates', value[i]);
          }
        } else {
          data.append(key, value);
        }
      });
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || 'Registration failed');
        setLoading(false);
        return;
      }
      setSuccess(
        'Registration successful! Please check your email for a verification link.'
      );
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  const SPORTS = [
    'Tennis',
    'Football',
    'Basketball',
    'Swimming',
    'Boxing',
    'Athletics',
    'Yoga',
    'Cricket',
    'Hockey',
    'Volleyball',
    'Table Tennis',
    'Badminton',
    'Rugby',
    'Other',
  ];

  return (
    <>
      <style>{`
        body { font-family: Arial, sans-serif; line-height: 1.6; background: linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover; min-height: 100vh; margin: 0; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background: rgba(255,255,255,0.9); }
        .header-logo { display: flex; align-items: center; }
        .header-logo img { height: 30px; margin-right: 10px; }
        .header-logo span { font-size: 22px; font-weight: bold; color: #1f2937; font-style: italic; }
        .header-login { padding: 10px 20px; border: 2px solid white; border-radius: 30px; background: transparent; color: #333; cursor: pointer; font-weight: bold; transition: all 0.3s ease; }
        .header-login:hover { color: #f97316; }
        .form-title { text-align: center; margin-top: 40px; margin-bottom: 20px; color: white; font-size: 28px; font-weight: bold; }
        .form-wrapper { display: flex; justify-content: center; align-items: flex-start; padding: 0 20px 40px; }
        .form-container { background: rgba(255,255,255,0.95); padding: 30px; max-width: 520px; width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        label { margin-top: 10px; display: block; font-weight: bold; }
        input, select { width: 100%; padding: 10px; margin-top: 5px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; transition: border-color 0.3s ease; }
        input:hover, select:hover, input:focus, select:focus { border-color: #f97316; outline: none; }
        button[type='submit'] { width: 100%; background: #e74c3c; color: white; padding: 12px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; }
        button[type='submit']:hover { background: #c0392b; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .role-specific { display: none; }
        .role-specific.active { display: block; }
        @media (max-width: 768px) { .form-container { max-width: 90%; } .form-title { font-size: 24px; } }
      `}</style>
      <div className='header'>
        <div className='header-logo'>
          <img src={logo} alt='Sport Sphere Logo' />
          <span>Sports Sphere</span>
        </div>
        <Link to='/login' className='header-login'>
          Login
        </Link>
      </div>
      <div className='form-title'>Create Your Account</div>
      <div className='form-wrapper'>
        <div className='form-container'>
          <form
            id='registrationForm'
            onSubmit={handleSubmit}
            encType='multipart/form-data'
          >
            {/* Common Fields */}
            <label htmlFor='fullName'>Full Name</label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              required
              value={formData.fullName}
              onChange={handleChange}
            />
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              required
              value={formData.password}
              onChange={handleChange}
            />
            {/* Role Selection */}
            <label htmlFor='role'>Register As</label>
            <select
              id='role'
              name='role'
              required
              value={formData.role}
              onChange={handleRoleChange}
            >
              <option value=''>Select a Role</option>
              <option value='coach'>Coach</option>
              <option value='athlete'>Athlete</option>
              <option value='vendor'>Vendor</option>
            </select>
            {/* Coach Specific */}
            <div
              className={`role-specific${
                formData.role === 'coach' ? ' active' : ''
              }`}
              id='coachFields'
            >
              <label htmlFor='sports'>Sports You Coach</label>
              <select
                id='sports'
                name='sports'
                value={formData.sports}
                onChange={handleChange}
                required={formData.role === 'coach'}
              >
                <option value=''>Select Sport</option>
                {SPORTS.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
              <label htmlFor='sessionType'>Session Type</label>
              <select
                id='sessionType'
                name='sessionType'
                value={formData.sessionType}
                onChange={handleChange}
              >
                <option value='digital'>Digital</option>
                <option value='physical'>Physical</option>
                <option value='both'>Both</option>
              </select>
              <label htmlFor='location'>
                Preferred Location (for physical sessions)
              </label>
              <input
                type='text'
                id='location'
                name='location'
                placeholder='City, Venue, etc.'
                value={formData.location}
                onChange={handleChange}
              />
              <label htmlFor='certificates'>
                Upload Certificates/Documents
              </label>
              <input
                type='file'
                id='certificates'
                name='certificates'
                accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                multiple
                onChange={handleChange}
              />
            </div>
            {/* Athlete Specific */}
            <div
              className={`role-specific${
                formData.role === 'athlete' ? ' active' : ''
              }`}
              id='athleteFields'
            >
              <label htmlFor='preferredSport'>Preferred Sport</label>
              <input
                type='text'
                id='preferredSport'
                name='preferredSport'
                value={formData.preferredSport}
                onChange={handleChange}
              />
              <label htmlFor='level'>Skill Level</label>
              <select
                id='level'
                name='level'
                value={formData.level}
                onChange={handleChange}
              >
                <option value='beginner'>Beginner</option>
                <option value='intermediate'>Intermediate</option>
                <option value='advanced'>Advanced</option>
              </select>
            </div>
            {/* Vendor Specific */}
            <div
              className={`role-specific${
                formData.role === 'vendor' ? ' active' : ''
              }`}
              id='vendorFields'
            >
              <label htmlFor='storeName'>Store Name</label>
              <input
                type='text'
                id='storeName'
                name='storeName'
                value={formData.storeName}
                onChange={handleChange}
              />
              <label htmlFor='vendorType'>Vendor Type</label>
              <select
                id='vendorType'
                name='vendorType'
                value={formData.vendorType}
                onChange={handleChange}
              >
                <option value='marketplace'>Sell Items on Marketplace</option>
                <option value='integration'>Connect Entire Store</option>
              </select>
              <label htmlFor='website'>Store Website (for integration)</label>
              <input
                type='url'
                id='website'
                name='website'
                placeholder='https://example.com'
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            {error && (
              <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
            )}
            {success && (
              <div style={{ color: 'green', marginBottom: '10px' }}>
                {success}
              </div>
            )}
            <button type='submit' disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
