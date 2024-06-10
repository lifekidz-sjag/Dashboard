import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ValidateError = props => {
  const { fontSize, color } = props;
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

ValidateError.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default ValidateError;
