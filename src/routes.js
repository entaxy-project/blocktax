import React from 'react';
import PropTypes from 'prop-types';
import {Router, Switch, Route, Redirect} from 'react-router-dom';
import {inject} from 'mobx-react';
import {isUserSignedIn} from 'blockstack';
import Landing from './components/landing';
import Import from './components/import';
import TransactionList from './components/transaction-list';
import TaxEventList from './components/tax-event-list';
import CoinbaseHelp from './components/coinbase-help';
import LoadingOverlay from './components/loading-overlay';
import Reset from './components/reset';

const signedOutOnly = props => (
  isUserSignedIn() ? <Redirect to="/transactions"/> : <Landing {...props}/>
);

const loginRequired = Screen => props => {
  if (isUserSignedIn()) {
    return <Screen {...props}/>;
  }
  return <Redirect to="/"/>;
};

const transactionsRequired = (Screen, transactionsExist) => props => {
  if (transactionsExist) {
    return <Screen {...props}/>;
  }
  return <Redirect to="/import"/>;
};

const injector = stores => ({
  transactionsExist: stores.transactions.exist,
  dataIsLoading: stores.ui.dataIsLoading
});

class Routes extends React.Component {
  constructor({history, transactionsExist, dataIsLoading}) {
    super();
  }

  render() {
    const {history, transactionsExist, dataIsLoading} = this.props;
    if (dataIsLoading) {
      return(
        <div>
          <Landing/>
          <LoadingOverlay/>
        </div>
      );
    }
    return(
      <Router history={history} basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/" render={signedOutOnly}/>
          <Route exact path="/transactions" render={loginRequired(transactionsRequired(TransactionList, transactionsExist))}/>
          <Route exact path="/capital-gains" render={loginRequired(transactionsRequired(TaxEventList, transactionsExist))}/>
          <Route exact path="/import" render={loginRequired(Import)}/>
          <Route exact path="/coinbase-help" render={CoinbaseHelp}/>
          <Route exact path="/reset" render={loginRequired(Reset)}/>
        </Switch>
      </Router>
    );
  }
}

Routes.propTypes = {
  history: PropTypes.object.isRequired,
  transactionsExist: PropTypes.bool.isRequired,
  dataIsLoading: PropTypes.bool.isRequired
};

export default inject(injector)(Routes);
