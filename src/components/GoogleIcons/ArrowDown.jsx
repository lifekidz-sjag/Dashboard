import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowDown = props => {
  const { fontSize = "24px", color = "white" } = props;
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

export default ArrowDown;
