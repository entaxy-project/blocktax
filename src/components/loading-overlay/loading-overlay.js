import React from 'react';
import './loading-overlay.css';

const LoadingOverlay = () => (
  <div className="LoadingOverlay">
    <div className="lds-dual-ring"/>
    <div className="LoadingOverlay__label">Loading ...</div>
  </div>
);

export default LoadingOverlay;
