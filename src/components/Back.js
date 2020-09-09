import React from 'react';
import PropTypes from 'prop-types';

const Back = (props) => (
  <svg
    width={25}
    height={42}
    viewBox="0 0 25 42"
    style={{ display: 'block', width: '25px', height: '42px', ...props.style }}
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-35.000000, -29.000000)">
        <g>
          <g transform="translate(24.000000, 26.000000)">
            <polygon
              fill={props.color || '#fff'}
              fillRule="nonzero"
              points="35.2307692 6.72621016 31.5959397 3 14.6074163 20.4156194 14.5988496 20.4077156 11 24.0961631 11.0085666 24.1049451 11 24.1128489 14.6348295 27.8390591 14.6425395 27.8311552 31.3903401 45 34.9891897 41.3097961 18.2413891 24.1418296"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);
Back.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
};

export default Back;
