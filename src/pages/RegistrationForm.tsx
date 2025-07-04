import React, { useState } from "react";

const RegistrationForm = () => {
  const [role, setRole] = useState("");

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="header-logo">
          <img src="assets/images/Logo.png" alt="Sport Sphere Logo" />
          <span>Sports Sphere</span>
        </div>
        <button className="header-login">Login</button>
      </div>

      {/* Title */}
      <div className="form-title">Create Your Account</div>

      {/* Form Wrapper */}
      <div className="form-wrapper">
        <div className="form-container">
          <form id="registrationForm">
            {/* Common Fields */}
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />

            {/* Role Selection */}
            <label htmlFor="role">Register As</label>
            <select
              id="role"
              name="role"
              required
              onChange={handleRoleChange}
              value={role}
            >
              <option value="">Select a Role</option>
              <option value="coach">Coach</option>
              <option value="athlete">Athlete</option>
              <option value="vendor">Vendor</option>
            </select>

            {/* Coach Specific Fields */}
            {role === "coach" && (
              <div className="role-specific" id="coachFields">
                <label htmlFor="sports">Sports You Coach</label>
                <input
                  type="text"
                  id="sports"
                  name="sports"
                  placeholder="e.g. Football, Tennis"
                />

                <label htmlFor="sessionType">Session Type</label>
                <select id="sessionType" name="sessionType">
                  <option value="digital">Digital</option>
                  <option value="physical">Physical</option>
                  <option value="both">Both</option>
                </select>

                <label htmlFor="location">
                  Preferred Location (for physical sessions)
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="City, Venue, etc."
                />

                <label htmlFor="certificates">
                  Upload Certificates/Documents
                </label>
                <input
                  type="file"
                  id="certificates"
                  name="certificates"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                />
              </div>
            )}

            {/* Athlete Specific Fields */}
            {role === "athlete" && (
              <div className="role-specific" id="athleteFields">
                <label htmlFor="preferredSport">Preferred Sport</label>
                <input type="text" id="preferredSport" name="preferredSport" />

                <label htmlFor="level">Skill Level</label>
                <select id="level" name="level">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            )}

            {/* Vendor Specific Fields */}
            {role === "vendor" && (
              <div className="role-specific" id="vendorFields">
                <label htmlFor="storeName">Store Name</label>
                <input type="text" id="storeName" name="storeName" />

                <label htmlFor="vendorType">Vendor Type</label>
                <select id="vendorType" name="vendorType">
                  <option value="marketplace">Sell Items on Marketplace</option>
                  <option value="integration">Connect Entire Store</option>
                </select>

                <label htmlFor="website">Store Website (for integration)</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  placeholder="https://example.com"
                />
              </div>
            )}

            <button type="submit">Register</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url("https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")
              no-repeat center center / cover;
          min-height: 100vh;
          margin: 0;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          background: rgba(255, 255, 255, 0.9);
        }

        .header-logo {
          display: flex;
          align-items: center;
        }

        .header-logo img {
          height: 30px;
          margin-right: 10px;
        }

        .header-logo span {
          font-size: 22px;
          font-weight: bold;
          color: #1f2937;
          font-style: italic;
        }

        .header-login {
          padding: 10px 20px;
          border: 2px solid white;
          border-radius: 30px;
          background: transparent;
          color: #333;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .header-login:hover {
          color: #f97316;
        }

        /* Section title */
        .form-title {
          text-align: center;
          margin-top: 40px;
          margin-bottom: 20px;
          color: white;
          font-size: 28px;
          font-weight: bold;
        }

        /* Form container */
        .form-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 0 20px 40px;
        }

        .form-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 30px;
          max-width: 520px;
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        label {
          margin-top: 10px;
          display: block;
          font-weight: bold;
        }

        input,
        select {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.3s ease;
          appearance: none;
          background: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='10'%3E%3Cpath fill='%23f97316' d='M7 10L0 0h14z'/%3E%3C/svg%3E")
            no-repeat right 10px center / 12px 8px;
        }

        input:hover,
        select:hover,
        input:focus,
        select:focus {
          border-color: #f97316;
          outline: none;
        }

        button[type="submit"] {
          width: 100%;
          background: #e74c3c;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        button[type="submit"]:hover {
          background: #c0392b;
        }

        @media (max-width: 768px) {
          .form-container {
            max-width: 90%;
          }

          .form-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationForm;
