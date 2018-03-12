import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Container from 'components/container';
import UserMenu from 'components/user-menu';
import './header.css';

const injector = stores => ({
  name: stores.blockstack.name,
  title: stores.ui.dashboardText
});

const Header = ({name, title}) => (
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
        <p className="Header__body">{title}</p>
      </div>
    </Container>
  </div>
);

Header.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default inject(injector)(Header);
