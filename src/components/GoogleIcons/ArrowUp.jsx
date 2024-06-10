import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowUp = props => {
  const { fontSize, color } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      keyboard_arrow_up
    </span>
  );
};

ArrowUp.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

ArrowUp.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default ArrowUp;
