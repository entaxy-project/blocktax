import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import blockstackIcon from 'images/blockstack-icon.svg';
import './blockstack-button.css';

const injector = stores => ({
  signIn: stores.blockstack.signIn
});

const BlockstackButton = ({signIn}) => (
  <button
    onClick={signIn}
    type="button"
    className='Button BlockstackButton'
  >
    <img src={blockstackIcon} />
    Log In with Blockstack
  </button>
);

BlockstackButton.propTypes = {
  signIn: PropTypes.func.isRequired
};

export default inject(injector)(BlockstackButton);
