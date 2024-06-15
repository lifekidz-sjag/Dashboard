import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowForward = props => {
  const { fontSize = "24px", color = "white" } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      arrow_forward
    </span>
  );
};

ArrowForward.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default ArrowForward;
