import PropTypes from "prop-types";

import "./GoogleIcons.css";

const LogoutIcon = props => {
  const { fontSize = "24px", color = "inherit", currentpage = "false" } = props;
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

export default LogoutIcon;
