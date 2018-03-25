import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Container from 'components/container';
import TopNav from 'components/top-nav';
import UserMenu from 'components/user-menu';
import Logo from 'components/logo';
import './header.css';

const injector = stores => ({
  name: stores.blockstack.name,
  title: stores.ui.dashboardText
});

const Header = ({name, title}) => (
  <div className="Header">
    <Container>
      <div className="Header__top-bar">
        <Logo white/>
        <TopNav/>
        <UserMenu/>
      </div>
    </Container>
  </div>
);

Header.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default inject(injector)(Header);
