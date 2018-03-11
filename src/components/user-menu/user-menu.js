// @TODO SVG is invisible

import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import './user-menu.css';

const injector = stores => ({
  avatar: stores.blockstack.avatar,
  name: stores.blockstack.name
});

const UserMenu = ({avatar, name}) => (
  <div className="UserMenu">
    <img className="UserMenu__avatar" src={avatar} alt=""/>
    <p className="UserMenu__name">{name}</p>
    <img className="UserMenu__caret" src={require('images/caret-down.svg')} alt=""/>
  </div>
);

UserMenu.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default inject(injector)(UserMenu);
