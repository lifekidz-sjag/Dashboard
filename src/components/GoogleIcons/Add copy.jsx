import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Add = props => {
  const { fontSize = "24px", color = "white" } = props;
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

export default Add;
