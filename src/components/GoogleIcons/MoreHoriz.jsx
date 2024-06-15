import PropTypes from "prop-types";

import "./GoogleIcons.css";

const MoreHoriz = props => {
  const { fontSize = "24px", color = "inherit" } = props;
  return (
    <span
      className="material-symbols-outlined material-symbols-bold"
      style={{ fontSize, color }}
    >
      more_horiz
    </span>
  );
};

MoreHoriz.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default MoreHoriz;
