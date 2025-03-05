import React, { useEffect, useState } from 'react';
import Card from './components/Card';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/internet-listings')  // Calls backend
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch listings');
        }
        return res.json();
      })
      .then(data => {
        setListings(data);  // Store the listings in state
        setLoading(false);   // Set loading to false once the data is fetched
      })
      .catch(err => {
        setError(err.message);  // Capture any error and store it
        setLoading(false);      // Stop loading on error
        console.error('Error fetching listings:', err);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Display loading message
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display error message
  }

  return (
    <div>
      <h2>Listings</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {listings.map(listing => (
          <Card key={listing.id} {...listing} />  // Passing each listing to the Card component
        ))}
      </div>
    </div>
  );
};

export default ListingsPage;
