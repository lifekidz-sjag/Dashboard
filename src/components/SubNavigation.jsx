import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import PropTypes from "prop-types";

import ArrowDown from "./GoogleIcons/ArrowDown";
import ArrowUp from "./GoogleIcons/ArrowUp";

const subNavigationWidth = 220;

const SubNavigation = ({
  CustomizedListItemButton,
  CustomizedListItemText,
  subNav = [],
  currentSubpage = {},
  currentChild = {},
  mobileSubNav,
  setMobileSubNav,
  mobileSubNavList,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const [expandChild, setExpandChild] = useState({});
  useEffect(() => {
    const obj = {};
    const extra = {};
    if (subNav) {
      subNav.forEach(item => {
        if (item.children && !(item.name in expandChild)) {
          obj[item.name] = false;
        }
      });
      if (currentChild && currentSubpage) {
        extra[currentSubpage.name] = true;
      }
      setExpandChild(prevState => {
        return {
          ...obj,
          ...prevState,
          ...extra,
        };
      });
    }
  }, [subNav]);
  const mobileSubNavigationLayout = () => {
    return (
      <Drawer
        anchor="bottom"
        open={!!(mobileSubNavList && mobileSubNavList.length && mobileSubNav)}
        sx={{
          zIndex: "1299",
          "& .MuiDrawer-paper": {
            padding: "16px",
            height: "50vh",
            borderRadius: "16px 16px 0px 0px",
            background: "#E9F2FF",
          },
        }}
        onClose={() => {
          setMobileSubNav(false);
        }}
      >
        {mobileSubNavList &&
          mobileSubNavList.length > 0 &&
          mobileSubNavList.map(item => {
            return (
              <Box key={item.name}>
                <CustomizedListItemButton
                  projectsubnav="true"
                  selected={
                    currentSubpage &&
                    currentSubpage.id === item.id &&
                    !currentChild
                  }
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      if (item.path) {
                        navigate(item.path);
                        setMobileSubNav(false);
                      }
                      if (item.target === "popup") {
                        navigate(item.path);
                        setMobileSubNav(false);
                      }
                      setExpandChild(prevState => {
                        return {
                          ...prevState,
                          [item.name]: !expandChild[item.name],
                        };
                      });
                    }
                  }}
                >
                  <CustomizedListItemText
                    selected={
                      currentSubpage &&
                      currentSubpage.id === item.id &&
                      !currentChild
                    }
                    disableTypography
                  >
                    <Typography variant="subtitle1">{item.name}</Typography>
                  </CustomizedListItemText>
                  <IconButton disableRipple sx={{ padding: 0 }}>
                    {(() => {
                      if (item.children) {
                        return expandChild[item.name] ? (
                          <ArrowUp />
                        ) : (
                          <ArrowDown />
                        );
                      }
                      return null;
                    })()}
                  </IconButton>
                </CustomizedListItemButton>
                {item.children && (
                  <Collapse
                    in={expandChild[item.name]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List>
                      {item.children.map(fl => {
                        const {
                          name: fName,
                          path: fPath,
                          target: fTarget,
                        } = fl;
                        return (
                          <Box key={fName}>
                            <CustomizedListItemButton
                              projectsubnav="true"
                              selected={
                                currentChild && currentChild.name === fName
                              }
                              onClick={() => {
                                if (fTarget === "new") {
                                  window.open(fPath, "_blank", "noreferrer");
                                } else {
                                  navigate(fPath);
                                  setMobileSubNav(false);
                                }
                              }}
                            >
                              <CustomizedListItemText
                                disableTypography
                                selected={
                                  currentChild && currentChild.name === fName
                                }
                              >
                                <Typography variant="body2">{fName}</Typography>
                              </CustomizedListItemText>
                            </CustomizedListItemButton>
                          </Box>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
      </Drawer>
    );
  };
  const desktopSubNavigationLayout = () => {
    if (subNav && subNav.length > 0) {
      return (
        <Drawer
          // open={subNavi}
          open
          variant="persistent"
          sx={{
            width: subNavigationWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              marginLeft: `${theme.spacing(9)}`,
              width: subNavigationWidth,
              boxSizing: "border-box",
              background: "transparent",
              border: "none",
            },
          }}
        >
          <Toolbar sx={{ height: "72px" }} />
          <List sx={{ padding: "16px 0px 0px 24px", marginBottom: "16px" }}>
            {subNav.map(item => {
              return (
                <Box key={item.name}>
                  <CustomizedListItemButton
                    projectsubnav="true"
                    selected={
                      currentSubpage &&
                      currentSubpage.id === item.id &&
                      !currentChild
                    }
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        if (item.path) {
                          navigate(item.path);
                        }
                        if (item.target === "popup") {
                          navigate(item.path);
                        }
                        setExpandChild(prevState => {
                          return {
                            ...prevState,
                            [item.name]: !expandChild[item.name],
                          };
                        });
                      }
                    }}
                  >
                    <CustomizedListItemText
                      selected={
                        currentSubpage &&
                        currentSubpage.id === item.id &&
                        !currentChild
                      }
                      disableTypography
                    >
                      <Typography variant="subtitle1">{item.name}</Typography>
                    </CustomizedListItemText>
                    <IconButton disableRipple sx={{ padding: 0 }}>
                      {(() => {
                        if (item.children) {
                          return expandChild[item.name] ? (
                            <ArrowUp />
                          ) : (
                            <ArrowDown />
                          );
                        }
                        return null;
                      })()}
                    </IconButton>
                  </CustomizedListItemButton>
                  {item.children && (
                    <Collapse
                      in={expandChild[item.name]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List>
                        {item.children.map(fl => {
                          const {
                            name: fName,
                            path: fPath,
                            target: fTarget,
                          } = fl;
                          return (
                            <Box key={fName}>
                              <CustomizedListItemButton
                                sx={{ paddingTop: "4px", paddingBottom: "4px" }}
                                projectsubnav="true"
                                selected={
                                  currentChild && currentChild.name === fName
                                }
                                onClick={() => {
                                  if (fTarget === "new") {
                                    window.open(fPath, "_blank", "noreferrer");
                                  } else {
                                    navigate(fPath);
                                  }
                                }}
                              >
                                <CustomizedListItemText
                                  disableTypography
                                  selected={
                                    currentChild && currentChild.name === fName
                                  }
                                >
                                  <Typography variant="body2">
                                    {fName}
                                  </Typography>
                                </CustomizedListItemText>
                              </CustomizedListItemButton>
                            </Box>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            })}
          </List>
        </Drawer>
      );
    }
    return null;
  };

  return isSmallScreen
    ? mobileSubNavigationLayout()
    : desktopSubNavigationLayout();
  /* <IconButton
            disableRipple
            onClick={handleDrawer}
            sx={{
              position: "absolute",
              left: subNavi ? "200px" : "60px",
              bottom: "24px",
              zIndex: "1207",
              border: "unset",
              borderRadius: "50% 0 0 50%",
              backgroundColor: subNavi ? "transparent" : "#f1f3f4",
              boxShadow: subNavi ? "unset" : "1px 1px 1px 1px #e8eaed",
              transition: theme =>
                theme.transitions.create(["transform", "left"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              transform: subNavi ? "rotate(0deg)" : "rotate(180deg)",
              fontSize: 100,
            }}
          >
            <ChevronLeft />
          </IconButton> */
};
SubNavigation.propTypes = {
  CustomizedListItemButton: PropTypes.shape().isRequired,
  CustomizedListItemText: PropTypes.shape().isRequired,
  subNav: PropTypes.arrayOf(PropTypes.shape()),
  currentSubpage: PropTypes.shape(),
  currentChild: PropTypes.shape(),
  mobileSubNav: PropTypes.bool.isRequired,
  setMobileSubNav: PropTypes.func.isRequired,
  mobileSubNavList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default SubNavigation;
