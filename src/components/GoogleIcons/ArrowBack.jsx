import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowBack = props => {
  const { fontSize = "24px", color = "white" } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      arrow_back
    </span>
  );
};

ArrowBack.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default ArrowBack;
