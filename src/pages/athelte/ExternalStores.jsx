import React from 'react';
import '../../css/marketplace.css';

const externalStores = [
  {
    name: 'Elite Wear',
    url: 'https://elitewear.com',
    logo: require('../../assets/images/Elite Wear.jpeg'),
  },
  {
    name: 'Flex',
    url: 'https://flex.com',
    logo: require('../../assets/images/Flex.jpeg'),
  },
  {
    name: 'Peak Nutrition',
    url: 'https://peaknutrition.com',
    logo: require('../../assets/images/Peak Nutrition.jpeg'),
  },
  {
    name: 'Recover',
    url: 'https://recover.com',
    logo: require('../../assets/images/Recover.jpeg'),
  },
  {
    name: 'Titan Tech',
    url: 'https://titantech.com',
    logo: require('../../assets/images/Titan Tech.jpeg'),
  },
  {
    name: 'Gear2',
    url: 'https://gear2.com',
    logo: require('../../assets/images/Gear2.jpeg'),
  },
];

const ExternalStores = () => {
  return (
    <main className='marketplace-page'>
      <h2 style={{ textAlign: 'center', margin: '2rem 0 1rem' }}>
        External Stores
      </h2>
      <div className='external-stores-list'>
        {externalStores.map((store) => (
          <div className='external-store-card' key={store.name}>
            <img
              src={store.logo}
              alt={store.name}
              className='external-store-logo'
            />
            <div className='external-store-info'>
              <h3>{store.name}</h3>
              <a
                href={store.url}
                target='_blank'
                rel='noopener noreferrer'
                className='visit-store-btn'
              >
                Visit Store
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ExternalStores;
