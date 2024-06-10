import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Dashboard = props => {
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
      space_dashboard
    </span>
  );
};

Dashboard.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  currentpage: PropTypes.string,
};

Dashboard.defaultProps = {
  fontSize: "24px",
  color: "inherit",
  currentpage: "false",
};

export default Dashboard;
