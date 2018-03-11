import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Container from './container';
import UserMenu from './user-menu';
import './header.css';

const injector = stores => ({
  name: stores.blockstack.name
});

const Header = ({name}) => (
  <div className="Header">
    <Container>
      <div className="Header__top-bar">
        <p className="Header__logo">BlockTax</p>
        <div>
          <UserMenu/>
        </div>
      </div>
      <div className="Header__main">
        <p className="Header__title">Hello, {name}</p>
        <p className="Header__body">Connect with your wallet to get started</p>
      </div>
    </Container>
  </div>
);

Header.propTypes = {
  name: PropTypes.string.isRequired
};

export default inject(injector)(Header);
