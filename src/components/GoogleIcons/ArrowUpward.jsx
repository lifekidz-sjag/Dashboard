import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowUpward = props => {
  const { fontSize = "24px", color = "white", className, sx = {} } = props;
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize, color, ...sx }}
    >
      arrow_upward
    </span>
  );
};

ArrowUpward.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.shape(),
};

export default ArrowUpward;
