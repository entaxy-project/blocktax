import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import './user-menu.css';
import caretDown from 'images/caret-down.svg';

const injector = stores => ({
  avatar: stores.blockstack.avatar,
  name: stores.blockstack.name,
  signOutOfBlockstack: stores.blockstack.signOut,
  signOutOfCoinbase: stores.coinbase.signOut
});

const UserMenu = ({avatar, name, signOutOfBlockstack, signOutOfCoinbase}) => (
  <div className="UserMenu">
    <div className="UserMenu__hover">
      <img className="UserMenu__avatar" src={avatar} alt=""/>
      <p className="UserMenu__name">{name}</p>
      <img className="UserMenu__caret" src={caretDown} alt=""/>
    </div>
    <div className="UserMenu__dropdown">
      <a href="import" className="UserMenu__item">Import transactions</a>
      <button className="UserMenu__item" type="button" onClick={signOutOfBlockstack}>Log Out</button>
    </div>
  </div>
);

UserMenu.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  signOutOfBlockstack: PropTypes.func.isRequired,
  signOutOfCoinbase: PropTypes.func.isRequired
};

export default inject(injector)(UserMenu);
