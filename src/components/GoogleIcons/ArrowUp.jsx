import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowUp = props => {
  const { fontSize = "24px", color = "white" } = props;
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

export default ArrowUp;
