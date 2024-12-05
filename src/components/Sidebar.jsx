import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

const Sidebar = ({ sidebar = null, isOpen, close, dependencies = {} }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const anchor = isSmallScreen ? "bottom" : "right";

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isOpen && searchParams.size === 0) {
      close();
    }
  }, [location.pathname]);
  return (
    <Box>
      <Drawer
        anchor={anchor}
        open={isOpen}
        sx={{
          zIndex: "1208",
          "& .MuiDrawer-paper": {
            width: { xs: "100%", md: "640px" },
            height: { xs: "80vh", md: "calc(100% - 72px)" },
            top: "auto",
            bottom: "0",
            borderRadius: { xs: "8px 8px 0 0", md: "8px 0 0 8px" },
            overflow: "hidden",
          },
        }}
        onClose={() => {
          close(anchor, false);
        }}
      >
        {sidebar ? sidebar(dependencies) : null}
        {/* sidebar.getContent(id) */}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  sidebar: PropTypes.oneOfType([
    PropTypes.func, // for function
    PropTypes.shape(), // for React component
  ]),
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  dependencies: PropTypes.shape(),
};

export default Sidebar;
