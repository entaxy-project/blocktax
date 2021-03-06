import React from 'react';
import {NavLink} from 'react-router-dom';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import './top-nav.css';

const injector = stores => ({
  transactionsExist: stores.transactions.exist
});

const TopNav = ({transactionsExist}) => (
  <div className="TopNav">
    {transactionsExist && <NavLink to="/transactions" className="TopNav__item" activeClassName="active">Transaction History</NavLink>}
    {transactionsExist && <NavLink to="/capital-gains" className="TopNav__item" activeClassName="active">Capital Gains</NavLink>}
  </div>
);

TopNav.propTypes = {
  transactionsExist: PropTypes.bool.isRequired
};

export default inject(injector)(TopNav);
