import React from 'react';
import './Page.css';

const Page = ({ children, className = '' }) => {
  return (
    <div className={`page-container ${className}`}>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default Page;
