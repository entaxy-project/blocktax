import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BlockstackButton from 'components/blockstack-button';
import Logo from 'components/logo';
import landingImage from 'images/landing.png';
import './landing.css';

const Landing = () => (
  <div className="Landing">
    <div className="Landing__content">
      <div className="Landing__logo">
        <Logo/>
      </div>
      <div className="Landing__text">
        <h1 className="Landing__title">Your Crypto Taxes Simple & Private</h1>
        <p className="Landing__body">Generate a tax report for Coinbase transactions with the push of a button, decentralized so your data stays yours.</p>
        <BlockstackButton/>
      </div>
    </div>
    <div
      className="Landing__illustration"
      style={{backgroundImage: `url(${landingImage}), linear-gradient(to bottom, var(--color-blue), var(--color-cyan))`}}
    />
  </div>
)

export default Landing;
