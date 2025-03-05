import React from 'react';

const Card = ({ heading, description, speed, price, image_url, offer_url }) => (
  <div className="card">
    <h2 className="card-heading">{heading}</h2>
    <img src={image_url} alt={heading} />
    <p>Speeds up to {speed}</p>
    <p>{description}</p>
    <p>Pricing starting from {price}</p>
    <button onClick={() => window.open(offer_url, '_blank')}>View Plans</button>
  </div>
);

export default Card;