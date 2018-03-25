import React from 'react';
import PropTypes from 'prop-types';
import './import-button.css';

const ImportButton = ({title, image, onClick, isDisabled, confirmMsg}) => {
  const applyClick = () => {
    console.log(confirmMsg)
    if(confirmMsg === undefined) {
      onClick();
    } else if(confirm(confirmMsg)) {
      onClick();
    }
  }

  return(
    <button
      className={`ImportButton ${isDisabled ? 'ImportButton--disabled' : ''}`}
      type="button"
      onClick={applyClick}>
      <div className="ImportButton__image" style={{backgroundImage: `url(${image})`}}/>
      <div className="ImportButton__title">
        {title}
      </div>
    </button>
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
