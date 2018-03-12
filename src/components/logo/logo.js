import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import './logo.css';

const Logo = ({white}) => (
  <p
    className={cls('Logo', {
      'Logo--white': white
    })}
  >
    BlockTax
  </p>
);

Logo.propTypes = {
  white: PropTypes.bool
};

Logo.defaultProps = {
  white: false
};

export default Logo;
