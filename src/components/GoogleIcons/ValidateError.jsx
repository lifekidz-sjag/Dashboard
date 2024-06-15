import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ValidateError = props => {
  const { fontSize = "24px", color = "white" } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      error
    </span>
  );
};

ValidateError.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default ValidateError;
