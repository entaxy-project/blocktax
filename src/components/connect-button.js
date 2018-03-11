import React from 'react';
import PropTypes from 'prop-types';

const ConnectButton = ({title, image, onClick}) => (
  <button className="ConnectButton" type="button" onClick={onClick}>
    <div className="ConnectButton__image">
      <img src={image} alt=""/>
    </div>
    <span className="ConnectButton__title">
      {title}
    </span>
  </button>
);

ConnectButton.propTypes = {
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string
};

ConnectButton.defaultProps = {
  onClick: () => {},
  title: ' '
};

export default ConnectButton;
