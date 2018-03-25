import React from 'react';
import PropTypes from 'prop-types';
import './import-button.css';

const ImportButton = ({title, image, onClick, disconnectAction, isDisabled, confirmMsg}) => {

  const applyClick = () => {
    if(confirmMsg === undefined) {
      onClick();
    } else if(confirm(confirmMsg)) {
      onClick();
    }
  }

  return(
    <div
      className={`ImportButton ${isDisabled ? 'ImportButton--disabled' : ''}`}
    >
      <div className="ImportButton__image" style={{backgroundImage: `url(${image})`}}>
        {disconnectAction && <a href='#' onClick={disconnectAction} className="ImportButton__disconnect">Disconnect</a>}
      </div>
      <div className="ImportButton__title" onClick={applyClick}>
        {title}
      </div>
    </div>
  );
}

ImportButton.propTypes = {
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string,
  isDisabled: PropTypes.bool,
  confirmMsg: PropTypes.string
};

ImportButton.defaultProps = {
  onClick: () => {},
  title: ' ',
  isDisabled: false,
};

export default ImportButton;
