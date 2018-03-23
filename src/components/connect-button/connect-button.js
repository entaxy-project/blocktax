import React from 'react';
import PropTypes from 'prop-types';
import './connect-button.css';

const ConnectButton = ({title, image, onClick, isDisabled}) => (
  <button className={`ConnectButton ${isDisabled ? 'ConnectButton--disabled' : ''}`} type="button" onClick={onClick}>
    <div className="ConnectButton__image" style={{backgroundImage: `url(${image})`}}/>
    <div className="ConnectButton__title">
      {title}
    </div>
  </button>
);

ConnectButton.propTypes = {
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string,
  isDisabled: PropTypes.bool
};

ConnectButton.defaultProps = {
  onClick: () => {},
  title: ' '
};

export default ConnectButton;
