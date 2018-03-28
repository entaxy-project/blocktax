import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Button from 'components/button';
import Modal from 'react-responsive-modal';
import { withFormik } from 'formik';
import './coinbase-modal-content.css';

const injector = stores => ({
  importTransactionsFrom: stores.transactions.importTransactionsFrom
});

const CoinbaseModalContent = ({
  importTransactionsFrom,
  onCloseModal,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <div className="CoinbaseModalContent">
    <h2>Import transactions from Coinbase</h2>
    <p>
      Your browser will be connecting directly to
      coinbase using the API key you enter bellow. So you're really importing your own data.
    </p>
    <p>Please enter your Coinbase API key bellow:</p>
    <form onSubmit={handleSubmit} className="CoinbaseModalContent__form">
      <div className="CoinbaseModalContent__form-control">
        <label>API Key</label>
        <input
          type="text"
          name="apiKey"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.apiKey}
        />
        {touched.apiKey && errors.apiKey && <div className="CoinbaseModalContent__field-error">{errors.apiKey}</div>}
      </div>
      <div className="CoinbaseModalContent__form-control">
        <label>API Secret</label>
        <input
          type="text"
          name="apiSecret"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.apiSecret}
        />
        {touched.apiSecret && errors.apiSecret && <div className="CoinbaseModalContent__field-error">{errors.apiSecret}</div>}
      </div>

      <p>
        <a href="/coinbase-help">How do I get a Coinbase API key?</a> (opens a new tab)
      </p>
      {isSubmitting && (
        <div className="Spinner">
          <div className="lds-dual-ring"></div>
          Importing transactions ...
        </div>
      )}
      {errors.global && <div className="GlobalError">{errors.global}</div>}
      <div className="CoinbaseModalContent__actions">
        <button type="submit" className="Button Button--small">Import</button>
        <a href="#" onClick={onCloseModal}>Not right now</a>
      </div>
    </form>
  </div>
);

CoinbaseModalContent.propTypes = {
  importTransactionsFrom: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired
};

export default inject(injector)(withFormik({
  mapPropsToValues: props => ({ apiKey: '', apiSecret: '' }),
  validate: (values, props) => {
    const errors = {};
    if (!values.apiKey) {
      errors.apiKey = 'Required';
    }
    if (!values.apiSecret) {
      errors.apiSecret = 'Required';
    }
    return errors;
  },
  handleSubmit: (
    values,
    {
      props,
      setSubmitting,
      setErrors
    }
  ) => {
    setSubmitting(true)
    props.importTransactionsFrom('coinbase', values.apiKey, values.apiSecret)
    .then(() => {
      setSubmitting(false)
      props.history.push('/transactions');
    }).catch((e) => {
      setSubmitting(false)
      setErrors({global: 'Sorry, something went wrong.'})
    })
  },
})(CoinbaseModalContent));