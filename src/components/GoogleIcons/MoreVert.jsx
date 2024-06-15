import PropTypes from "prop-types";

import "./GoogleIcons.css";

const MoreVert = props => {
  const { fontSize = "24px", color = "inherit" } = props;
  return (
    <span
      className="material-symbols-outlined material-symbols-bold"
      style={{ fontSize, color }}
    >
      more_vert
    </span>
  );
};

MoreVert.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default MoreVert;
