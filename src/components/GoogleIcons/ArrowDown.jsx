import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowDown = props => {
  const { fontSize, color } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      keyboard_arrow_down
    </span>
  );
};

ArrowDown.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

ArrowDown.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default ArrowDown;
