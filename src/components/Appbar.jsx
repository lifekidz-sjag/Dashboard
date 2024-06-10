import { Link, useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import PropTypes from "prop-types";

import SJAGlogo from "../assets/sjag-logo.svg";

import AvatarDropdown from "./AvatarDropdown";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 10,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Appbar = ({ loader }) => {
  const theme = useTheme();
  const location = useLocation();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 80,
  });
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // function indexOfEnd(str, searchValue) {
  //   const index = str.indexOf(searchValue);
  //   if (index === -1) {
  //     return -1; // Substring not found
  //   }
  //   const endPos = index + searchValue.length;
  //   const isLastChar = endPos === str.length;
  //   return isLastChar ? endPos : -1; // Returns endPos if it's the last char, otherwise -1
  // }

  return (
    <Box>
      <CssBaseline />
      <AppBar
        sx={{
          position: "fixed",
          top: "0",
          background: { xs: trigger ? "white" : "transparent", md: "white" },
          borderBottom: { md: "1px solid rgba(0, 0, 0, 0.08)" },
          transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          boxShadow: {
            xs: trigger
              ? "rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px"
              : "none",
            md: "none",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingY: "0px",
            height: "72px",
            // paddingX: "36px",
          }}
        >
          <Link
            label="Home"
            to="/"
            sx={{ display: { xs: "none", lg: "initial" } }}
          >
            <img src={SJAGlogo} alt="SJAG logo" />
          </Link>

          <Box
            sx={{
              display: "flex",
              color: "text.secondary",
              alignItems: "center",
            }}
          >
            <AvatarDropdown loader={loader} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
Appbar.propTypes = {
  loader: PropTypes.shape().isRequired,
};

export default Appbar;
