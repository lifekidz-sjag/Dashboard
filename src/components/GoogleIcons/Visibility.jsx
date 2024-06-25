import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Visibility = props => {
  const { fontSize = "24px", color = "rgba(19, 39, 46, 0.8)" } = props;
  return (
    <span
      className="material-symbols-outlined material-symbols-bold"
      style={{ fontSize, color }}
    >
      visibility
    </span>
  );
};

Visibility.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default Visibility;
