import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Header from 'components/header';
import Body from 'components/body';
import Card from 'components/card';
import ImportButton from 'components/import-button';
import Modal from 'react-responsive-modal';
import CoinbaseModalContent from 'components/coinbase-modal-content';
import './import.css';

const injector = stores => ({
  clearTransactions: stores.transactions.clearTransactions,
  transactionsExist: stores.transactions.exist
});

class Import extends React.Component {
  constructor ({clearTransactions, transactionsExist}) {
    super();
    this.state = {
      showCoinbaseModal: false,
    };
    this.clearTransactions = clearTransactions;
  }

  onOpenModal = () => {
    this.setState({ showCoinbaseModal: true });
  };

  onCloseModal = () => {
    this.setState({ showCoinbaseModal: false });
  };

  onResetTransactions =() => {
    if(confirm("This will delete all the transactions you imported so far. Are you sure?")){
      this.clearTransactions();
      alert('Done!')
    }
  }
  render() {
    const { showCoinbaseModal } = this.state;
    const { transactionsExist } = this.props;
    return (
      <div>
        <Header/>
        <Body>
          <Card>
            <div className="Import">
              <h1 className="Import__title">Import transactions</h1>
              <p className="Import__body">
                To generate your tax report, you'll need to import some transactions first.
                {transactionsExist && (
                  <p><a href="#" onClick={this.onResetTransactions}>Clear transactions</a></p>
                )}
              </p>
              <div className="Import__buttons">
                <ImportButton
                  title="Import"
                  image={require('images/coinbase-logo.svg')}
                  onClick={this.onOpenModal}
                />
                <ImportButton
                  title="Coming Soon"
                  image={require('images/csv-logo.svg')}
                  isDisabled={true}
                />
              </div>
              <Modal
                open={showCoinbaseModal}
                onClose={this.onCloseModal}
                closeOnEsc={true}
                little
                classNames={{ overlay: 'Import__modal-overlay', modal: 'Import__modal-content' }}
              >
                <CoinbaseModalContent onCloseModal={this.onCloseModal} {...this.props}/>
              </Modal>
            </div>
          </Card>
        </Body>
      </div>
    )
  }
}

Import.propTypes = {
  clearTransactions: PropTypes.func.isRequired,
  transactionsExist: PropTypes.bool.isRequired
};

export default inject(injector)(Import);
