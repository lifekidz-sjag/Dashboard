import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Add = props => {
  const { fontSize, color } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      Add
    </span>
  );
};

Add.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

Add.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default Add;
