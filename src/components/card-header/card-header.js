import React from 'react';
import PropTypes from 'prop-types';
import './card-header.css';

const CardHeader = ({controls, title}) => (
  <div className="CardHeader">
    <h1 className="CardHeader__title">{title}</h1>
    <div className="CardHeader__controls">
      {controls}
    </div>
  </div>
);

CardHeader.propTypes = {
  controls: PropTypes.node,
  title: PropTypes.string
};

CardHeader.defaultProps = {
  controls: null,
  title: ' '
};

export default CardHeader;
