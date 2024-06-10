import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Report = props => {
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
      leaderboard
    </span>
  );
};

Report.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  currentpage: PropTypes.string,
};

Report.defaultProps = {
  fontSize: "24px",
  color: "inherit",
  currentpage: "false",
};

export default Report;
