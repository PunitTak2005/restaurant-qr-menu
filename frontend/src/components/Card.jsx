import React from 'react';
import './Card.css';

const Card = ({ image, title, description, price, category }) => {
  return (
    <div className="card">
      <div className="card-image-container">
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="card-image" 
          />
        )}
        {category && (
          <span className="card-category">{category}</span>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && (
          <p className="card-description">{description}</p>
        )}
        {price && (
          <div className="card-footer">
            <span className="card-price">${price}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
