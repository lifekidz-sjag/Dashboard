import PropTypes from "prop-types";

import "./GoogleIcons.css";

const LogoutIcon = props => {
  const { fontSize, color, currentpage } = props;
  return (
    <span
      className={
        currentpage === "true"
          ? "material-symbols-outlined material-symbols-fill"
          : "material-symbols-outlined"
      }
      style={{ fontSize, color }}
    >
      move_item
    </span>
  );
};

LogoutIcon.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

LogoutIcon.defaultProps = {
  fontSize: "24px",
  color: "inherit",
};

export default LogoutIcon;
