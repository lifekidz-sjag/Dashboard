import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowForward = props => {
  const { fontSize, color } = props;
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

ArrowForward.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default ArrowForward;
