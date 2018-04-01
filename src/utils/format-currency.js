import PropTypes from 'prop-types';
import browserLanguage from 'utils/browser-language';
import cryptoCurrencies from 'constants/crypto-currencies';
import Big from 'big.js';

/**
* Formats a number into a currency
*/
const formatCurrency = (amount, currency) => {
  if (cryptoCurrencies.includes(currency)) {
    return `${parseFloat(amount).toFixed(4)} ${currency}`;
  }
  return parseFloat(amount).toLocaleString(browserLanguage(), {
    style: 'currency',
    currency
  });
}

formatCurrency.propTypes = {
  amount: PropTypes.instanceOf(Big).isRequired,
  currency: PropTypes.string.isRequired
};

export default formatCurrency;
