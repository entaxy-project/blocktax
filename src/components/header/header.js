import React from 'react';
import PropTypes from 'prop-types';
import Container from 'components/container';
import TopNav from 'components/top-nav';
import UserMenu from 'components/user-menu';
import Logo from 'components/logo';
import './header.css';

const Header = ({body}) => (
  <div className="Header">
    <Container>
      <div className="Header__background"/>
      <div className="Header__top-bar">
        <Logo white/>
        <TopNav/>
        <UserMenu/>
      </div>
      <div className="Header__main">
        {body && <div className="Header__body">{body}</div>}
      </div>
    </Container>
  </div>
);

Header.propTypes = {
  body: PropTypes.object
};

export default Header;
