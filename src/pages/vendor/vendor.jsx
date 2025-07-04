import React from "react";
import { Link } from "react-router-dom";
import '../../css/vendor.css';
import gear2 from '../../assets/images/Gear2.jpeg';
import eliteWear from '../../assets/images/Elite Wear.jpeg';
import flexEquip from '../../assets/images/Flex.jpeg';
import peakNutrition from '../../assets/images/Peak Nutrition.jpeg';
import titanTech from '../../assets/images/Titan Tech.jpeg';
import recoveryPlus from '../../assets/images/Recover.jpeg';
import logoImg from '../../assets/images/Logo.png';
import {
  FaHome,
  FaStore,
  FaEnvelope,
  FaUser,
  FaHandshake,
  FaRunning
} from "react-icons/fa";

const vendors = [
  {
    name: "ProGear Sports",
    description: "High-quality gear for athletes of all levels with 20+ years of industry experience.",
    image: gear2,
    link: "http://www.progearvision.com/"
  },
  {
    name: "Elite Wear",
    description: "Performance apparel trusted by top-tier trainers and professional athletes.",
    image: eliteWear,
    link: "https://elitewear.pk/?srsltid=AfmBOopMfkJw8DnOWfajhxcsouVABaxj2R52qQXZHwg3ocH5sSA_BSN9"
  },
  {
    name: "Flex Equip",
    description: "Innovative fitness tools and training equipment for optimal performance.",
    image: flexEquip,
    link: "https://www.flex.sport/en/productos/equipment/"
  },
  {
    name: "Peak Nutrition",
    description: "Science-backed supplements and nutrition plans for serious athletes.",
    image: peakNutrition,
    link: "https://peaknutrition.com/"
  },
  {
    name: "Titan Tech",
    description: "Wearable tech and analytics tools to track and improve performance.",
    image: titanTech,
    link: "https://www.recovery-plus.es/?lang=en"
  },
  {
    name: "Recovery Plus",
    description: "Specialized recovery equipment and therapies for faster results.",
    image: recoveryPlus,
    link: "https://www.recovery-plus.es/?lang=en"
  }
];

export default function Vendor() {
  return (
    <>
      <header>
        <Link to="/" className="logo">
          <img src={logoImg} alt="Sport Sphere Logo" className="logo-img" />
          <div>
            <div className="logo-text">Sports Sphere</div>
          </div>
        </Link>
        <nav>
          <Link to="/"><FaHome /> <span>Home</span></Link>
          <Link to="/marketplace" className="active"><FaStore /> <span>Marketplace</span></Link>
          <Link to="/message"><FaEnvelope /> <span>Messages</span></Link>
          <Link to="/vendor-profile" className="profile-btn"><FaUser /></Link>
        </nav>
      </header>

      <main className="vendors-container">
        <h2 className="vendors-heading"><FaHandshake /> Featured Vendors</h2>
        <div className="vendor-grid">
          {vendors.map((vendor, index) => (
            <div className="vendor-card" key={index}>
              <img src={vendor.image} alt={vendor.name} />
              <h3>{vendor.name}</h3>
              <p>{vendor.description}</p>
              <a href={vendor.link} className="btn" target="_blank" rel="noopener noreferrer">Visit Store</a>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <FaRunning /> Sport Sphere
          </div>
          <div className="copyright">
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
