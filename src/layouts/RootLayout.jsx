import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { Box, Fab, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

import Appbar from "../components/Appbar";
import Add from "../components/GoogleIcons/Add";
import Download from "../components/GoogleIcons/Download";
import MainNavigation from "../components/MainNavigation";
// import ProjectMainNavigation from "../components/ProjectMainNavigation";
import { useAuth } from "../contexts/auth";

const RootLayout = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const location = useLocation();
  const { isAuthenticated, checkAuthenticated, user, getUserExecute } =
    useAuth();
  const navigate = useNavigate();

  const [accountMainNav, setAccountMainNav] = useState(false);

  const [projectMainNav, setProjectMainNav] = useState(false);
  const handleProjectMainNav = bool => {
    setProjectMainNav(bool);
  };

  const [projectMobileSubNav, setProjectMobileSubNav] = useState(false);
  const handleProjectMobileSubNav = bool => {
    setProjectMobileSubNav(bool);
  };

  const props = useOutletContext();
  const { project, actionBar, setActionBar } = props;

  const ab = actionBar;
  const sab = setActionBar;
  useEffect(() => {
    if (!checkAuthenticated()) {
      navigate("/user");
    } else if (!user) {
      getUserExecute();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    props.loader.start();
  }, []);

  useEffect(() => {
    if (user && user.userId) {
      // do something
      props.loader.start();
    }

    return () => {};
  }, [user]);

  return (
    isAuthenticated &&
    user && (
      <Box
        sx={{
          opacity: props.loader.loading === -1 ? "0" : "1",
          transition: "var(--trans)",
          backgroundColor: "#E9F2FF",
        }}
      >
        <Appbar loader={props.loader} />
        <MainNavigation
          projectMainNav={projectMainNav}
          handleProjectMainNav={handleProjectMainNav}
          projectMobileSubNav={projectMobileSubNav}
          handleProjectMobileSubNav={handleProjectMobileSubNav}
          setProjectMobileSubNav={setProjectMobileSubNav}
        />

        <Box
          sx={{
            minHeight: "100vh",
            marginLeft: () => {
              return { xs: "0px", md: `calc(${theme.spacing(12)} + 200px)` };
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              margin: "auto",
              boxSizing: "border-box",
              maxWidth: "var(--maxWidth2)",
              padding: "104px 24px 120px",
            }}
          >
            {!ab.search.isOpen && ab.multiSelect.selected === 0 && (
              <>
                <Box sx={{ padding: { xs: "0", md: "0px" } }}>
                  {ab.title.enabled && (
                    <Box
                      sx={{
                        opacity:
                          ab.title.display && !ab.search.isOpen ? "100" : "0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        wordBreak: "break-word",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      <Typography
                        variant={isSmallScreen ? "h5" : "h4"}
                        sx={{
                          marginBottom: "8px",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {ab.title.name}
                      </Typography>
                    </Box>
                  )}
                  {ab.description.enabled && (
                    <Box
                      sx={{
                        opacity:
                          ab.description.display && !ab.search.isOpen
                            ? "100"
                            : "0",
                      }}
                    >
                      <Typography variant="body1">
                        {ab.description.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    padding: { xs: "0 24px", md: "0px" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "flex-end",
                      flex: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* {renderViewButton()}
                      {renderFileTypeButton()}
                      <Box sx={{ marginLeft: "8px" }}>
                        {renderSearchButton()}
                      </Box> */}
                    </Box>
                  </Box>

                  {ab.fab.enabled &&
                    (ab.fab.export ? (
                      <Fab
                        variant="contained"
                        isSmallScreen
                        onClick={e => {
                          ab.fab.action(e);
                        }}
                        sx={{
                          position: isSmallScreen ? "fixed" : "relative",
                          top: isSmallScreen ? "auto" : "auto",
                          right: isSmallScreen ? "24px" : "auto",
                          bottom: isSmallScreen ? "96px" : "auto",
                          marginLeft: "24px",
                        }}
                      >
                        <Download sx={{ width: "14px", height: "14px" }} />
                      </Fab>
                    ) : (
                      <Fab
                        variant="contained"
                        isSmallScreen
                        aria-label="add"
                        onClick={e => {
                          ab.fab.action(e);
                        }}
                        sx={{
                          position: isSmallScreen ? "fixed" : "relative",
                          top: isSmallScreen ? "auto" : "auto",
                          right: isSmallScreen ? "24px" : "auto",
                          bottom: isSmallScreen ? "96px" : "auto",
                          marginLeft: "8px",
                        }}
                      >
                        <Add sx={{ width: "16px", height: "16px" }} />
                      </Fab>
                    ))}
                </Box>
              </>
            )}
            <Box
              sx={{
                marginTop: "24px",
              }}
            >
              <Outlet
                context={{
                  ...props,
                  projectMainNav,
                  handleProjectMainNav,

                  contentPadding: {
                    padding: { xs: "0px 36px 164px 36px", md: "0px" },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    )
  );
};
RootLayout.propTypes = {
  loader: PropTypes.shape(),
};

RootLayout.defaultProps = {
  loader: {},
};
export default RootLayout;
