import PropTypes from "prop-types";

import "./GoogleIcons.css";

const AccountIcon = props => {
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
      account_circle
    </span>
  );
};

AccountIcon.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  currentpage: PropTypes.string,
};

export default AccountIcon;
