import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './button.css';

const Button = ({children, href, onClick, to}) => {
  if (href) {
    return <a href={href} className="Button">{children}</a>;
  }

  if (to) {
    return <Link to={to} className="Button">{children}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick} className="Button" type="button">{children}</button>;
  }
};

Button.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string
};

export default Button;
