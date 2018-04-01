import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import {Redirect} from 'react-router-dom';
import Button from 'components/button';
import Modal from 'react-responsive-modal';
import {withFormik} from 'formik';
import './disclaimer.css';
import icon from 'images/disclaimet-icon.png';

const injector = stores => ({
  disclaimerIsVisible: stores.ui.disclaimerIsVisible,
  hideDisclaimer: stores.ui.hideDisclaimer
});

class Disclaimer extends React.Component {
  constructor({
    values,
    disclaimerIsVisible,
    hideDisclaimer,
    handleChange
  }) {
    super();
    this.hideDisclaimer = hideDisclaimer;
  };

  handleChange = () => {
    this.values.disclaimerAccepted = !this.values.disclaimerAccepted;
  };

  onAcceptDisclaimer = () => {
    this.hideDisclaimer();
  };

  onRejectDisclaimer = () => {
    window.location = `${window.location.origin}/import`;
  };

  render() {
    const { values, handleChange, disclaimerIsVisible } = this.props;
    return (
      <Modal
        open={disclaimerIsVisible}
        onClose={this.onRejectDisclaimer}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        little
        classNames={{overlay: 'Disclaimer__modal-overlay', modal: 'Disclaimer__modal-content'}}
      >
        <img src={icon} className="Disclaimer__icon"/>
        <h2>This report may not be accurate</h2>
        <p>This report is only for people who have bought and sold digital assets on Coinbase. Do not use this report if you have:</p>
        <ul>
          <li>Bought or sold digital asset on another exchange</li>
          <li>Sent or received digital assets from a non-Coinbase wallet</li>
          <li>Sent or received digital assets from another exchange</li>
          <li>Stored digital assets on an exchange storage device</li>
          <li>Participated in an ICO</li>
          <li>Previously used a method other than FIFO to calculate gains/losses for digital assets</li>
        </ul>

        <form className="Disclaimer__form">
          <div className="Disclaimer__form-control Disclaimer__checkbox">
            <label>
              <input
                type="checkbox"
                name="disclaimerAccepted"
                value={values.disclaimerAccepted}
                onChange={handleChange}
              />
              I understand that this report may not be accurate
            </label>
          </div>
          <Button small disabled={!values.disclaimerAccepted} onClick={this.onAcceptDisclaimer}>Show me the report</Button>
        </form>
      </Modal>
    );
  };
};

Disclaimer.propTypes = {
  disclaimerIsVisible: PropTypes.bool.isRequired,
  hideDisclaimer: PropTypes.func.isRequired
};

export default inject(injector)(withFormik({
  mapPropsToValues: () => ({disclaimerAccepted: false}),
})(Disclaimer));
