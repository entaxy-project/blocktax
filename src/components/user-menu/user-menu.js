import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import './user-menu.css';

const injector = stores => ({
  avatar: stores.blockstack.avatar,
  name: stores.blockstack.name,
  signOut: stores.blockstack.signOut
});

const UserMenu = ({avatar, name, signOut}) => (
  <div className="UserMenu">
    <div className="UserMenu__hover">
      <img className="UserMenu__avatar" src={avatar} alt=""/>
      <p className="UserMenu__name">{name}</p>
      <img className="UserMenu__caret" src={require('images/caret-down.svg')} alt=""/>
    </div>
    <div className="UserMenu__dropdown">
      <button className="UserMenu__item" type="button" onClick={signOut}>Log Out</button>
    </div>
  </div>
);

UserMenu.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired
};

export default inject(injector)(UserMenu);
