
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Loader = ({ isLoading, containerClass }) => {
  useEffect(() => {
    const container = document.querySelector(containerClass);
    if (isLoading) {
      container.classList.add('bg-white');
    } else {
      container.classList.remove('bg-white');
    }
    return () => {
      container.classList.remove('bg-white');
    };
  }, [isLoading, containerClass]);

  return isLoading ? <div className="loader-container">
      <div className="loader"></div>
    </div> : null;
};

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  containerClass: PropTypes.string.isRequired,
};

export default Loader;
