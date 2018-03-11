import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import cls from 'classnames';
import './button.css';

const Button = ({children, disabled, href, onClick, small, to}) => {
  const className = cls('Button', {
    'Button--disabled': disabled,
    'Button--small': small
  });

  if (href) {
    return <a href={href} className={className}>{children}</a>;
  }

  if (to) {
    return <Link to={to} className={className}>{children}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick} className={className} type="button">{children}</button>;
  }
};

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
  small: PropTypes.bool,
  to: PropTypes.string
};

export default Button;
