import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import times from 'lodash/times';
import './pagination.css';

const Pagination = ({currentPage, onChange, pageCount}) => (
  <div className="Pagination">
    <button
      className={cls('Pagination__button', {
        'Pagination__button--disabled': currentPage === 0
      })}
      onClick={() => onChange(currentPage - 1)}
      type="button"
    >
      Previous
    </button>
    {times(pageCount, index => (
      <button
        key={index}
        className={cls('Pagination__button', {
          'Pagination__button--disabled': index === currentPage
        })}
        onClick={() => onChange(index)}
        type="button"
      >
        {index + 1}
      </button>
    ))}
    <button
      className={cls('Pagination__button', {
        'Pagination__button--disabled': currentPage === pageCount - 1
      })}
      onClick={() => onChange(currentPage + 1)}
      type="button"
    >
      Next {currentPage}-{pageCount}
    </button>
  </div>
);

Pagination.propTypes = {
  currentPage: PropTypes.number,
  onChange: PropTypes.func,
  pageCount: PropTypes.number
};

Pagination.defaultProps = {
  currentPage: 0,
  onChange: () => {},
  pageCount: 0
};

export default Pagination;
