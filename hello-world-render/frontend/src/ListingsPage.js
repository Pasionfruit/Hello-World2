import React, { useEffect, useState } from 'react';
import Card from './components/Card';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('/api/listings') // Calls backend
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error('Error fetching listings:', err));
  }, []);

  return (
    <div>
      <h2>Listings</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {listings.map((listing) => (
          <Card key={listing.id} {...listing} />
        ))}
      </div>
    </div>
  );
};

export default ListingsPage;
