import React from 'react';
import PropTypes from 'prop-types';
import './card.css';

const Card = ({children}) => (
  <div className="Card">
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node
};

Card.defaultProps = {
  children: null
};

export default Card;
