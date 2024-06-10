import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction as MuiBottomNavigationAction,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import PropTypes from "prop-types";

import Admin from "./GoogleIcons/Admin";
import Dashboard from "./GoogleIcons/Dashboard";
import Register from "./GoogleIcons/Register";
import Report from "./GoogleIcons/Report";
import SubNavigation from "./SubNavigation";

// Main Navigation component is a combination of mini variant and permanent menu, with hover on expand feature

const mainNavigationWidth = 260;

const openedMixin = (theme, issmallscreen) => {
  return {
    background: `${theme.palette.primary.main}`,
    zIndex:
      issmallscreen === "true"
        ? theme.zIndex.drawer + 100
        : theme.zIndex.drawer + 8,
    width: mainNavigationWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    border: "none",
    boxShadow:
      "0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)",
  };
};

const closedMixin = (theme, issmallscreen, ispageloaded) => {
  return {
    background: `${theme.palette.primary.main}`,
    zIndex:
      issmallscreen === "true"
        ? theme.zIndex.drawer + 100
        : theme.zIndex.drawer + 8,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: "0px",
    border: "none",
    [theme.breakpoints.up("sm")]: {
      width:
        ispageloaded === "true" ? `calc(${theme.spacing(9)} + 1px)` : `0px`,
    },
  };
};

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open, issmallscreen, ispageloaded }) => ({
  width: mainNavigationWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  background: `${theme.palette.primary.main}`,
  ...(open && {
    ...openedMixin(theme, issmallscreen),
    boxShadow: "none",
    "& .MuiDrawer-paper": openedMixin(theme, issmallscreen),
  }),
  ...(!open && {
    ...closedMixin(theme, issmallscreen, ispageloaded),
    "& .MuiDrawer-paper": closedMixin(theme, issmallscreen, ispageloaded),
  }),
}));

const CustomizedListItemButton = styled(ListItemButton)(props => ({
  paddingLeft: "16px",
  borderRadius:
    props.projectmainnav === "true" || props.projectsubnav === "true"
      ? "50px"
      : "50px 0px 0px 50px",
  "&.main-navi": {
    paddingTop: "7px",
    paddingBottom: "7px",
    color: "#fff",
  },
  "&.main-navi:hover": {
    backgroundColor: "#0098EA",
  },
  "&.Mui-selected": {
    backgroundColor:
      props.projectsubnav === "true" ? "rgba(33, 150, 243, 0.08)" : "#FF2D2D",
  },
  "&.Mui-selected:hover": {
    backgroundColor:
      props.projectsubnav === "true" ? "rgba(33, 150, 243, 0.08)" : "#FF2D2D",
  },
  "& .MuiListItemIcon-root": {
    color: "#fff",
  },
}));

const CustomizedListItemText = styled(
  ListItemText,
  {},
)(({ theme, selected }) => {
  return {
    "&.main-navi .MuiTypography-root": {
      color: "#fff",
    },
    "& .MuiTypography-root": {
      color: selected
        ? `${theme.palette.primary.main}`
        : `${theme.palette.text.primary}`,
    },
  };
});

const CustomizedListItemIcon = styled(ListItemIcon)(({ selected, open }) => ({
  padding: "5px",
  borderRadius: "100%",
  backgroundColor: selected && !open ? "transparent" : "transparent",
}));

const matchNestedPath = (items, url) => {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.path === url) {
      return [item];
    }

    if (item.subNav) {
      const subNavresult = matchNestedPath(item.subNav, url);
      if (subNavresult.length > 0) {
        return [item, ...subNavresult];
      }
    }

    if (item.children) {
      const childrenResult = matchNestedPath(item.children, url);
      if (childrenResult.length > 0) {
        return [item, ...childrenResult];
      }
    }
  }
  return [];
};

const navigationProps = (navigationItems, pathname) => {
  const path = matchNestedPath(navigationItems, pathname);

  const currentPage = path[0] ? path[0].id : "";
  const currentSubpage = path[1] ? path[1] : null;
  const currentChild = path[2] ? path[2] : null;
  const subNav = path[0] && path[0].subNav ? path[0].subNav : null;
  let subChild = null;

  if (currentChild) {
    subChild = navigationItems.filter(item => {
      return (
        item.subNav &&
        item.subNav.filter(i => {
          return i.children && i.children.id === currentChild;
        })
      );
    });
  }

  console.log("currentPage", currentPage);
  // console.log("currentSubpage", currentSubpage);
  // console.log("currentChild", currentChild);

  // console.log("subNav", subNav);
  // console.log("subChild", subChild);

  return {
    currentPage,
    currentSubpage,
    currentChild,
    subNav,
    subChild,
  };
};

const mobileNavigationProps = (navigationItems, pathname) => {
  const path = matchNestedPath(navigationItems, pathname);

  const currentPage = path[0] ? path[0].id : "";
  const currentSubpage = path[1] ? path[1] : null;
  const currentChild = path[2] ? path[2] : null;
  const subNav = path[0] && path[0].subNav ? path[0].subNav : null;
  let subChild = null;

  if (currentChild) {
    subChild = navigationItems.filter(item => {
      return (
        item.subNav &&
        item.subNav.filter(i => {
          return i.children && i.children.id === currentChild;
        })
      );
    });
  }

  // console.log("mobileClickedPage", currentPage);
  // console.log("mobileClickedSubpage", currentSubpage);
  // console.log("mobileClickedChild", currentChild);

  // console.log("mobileSubNav", subNav);
  // console.log("mobileSubChild", subChild);

  return {
    mobileClickedPage: currentPage,
    mobileClickedSubpage: currentSubpage,
    mobileClickedChild: currentChild,
    mobileSubNav: subNav,
    mobileSubChild: subChild,
  };
};

const navigationItems = () => {
  return [
    {
      id: "ce7f9d92-8c48-49e4-b3af-6305c427e893",
      name: "Dashboard",
      path: `/dashboard`,
      icon: currentPage => {
        return <Dashboard currentpage={currentPage.toString()} />;
      },
      mobile: "first",
    },
    {
      id: "3e234c2f-4320-4941-8c7b-4b43d4f79266",
      name: "Clock In / Out",
      path: `/manage`,
      icon: currentPage => {
        return <Register currentpage={currentPage.toString()} />;
      },
      mobile: "first",
    },
    {
      id: "98e292f8-ee5b-4437-ab96-4b24a990a8d4",
      name: "Admin",
      path: `/admin`,
      icon: currentPage => {
        return <Admin currentpage={currentPage.toString()} />;
      },
      mobile: "first",
      subNav: [
        {
          id: "f511c60f-04e5-48f0-a865-a7ec7d55838e",
          name: "Teachers",
          path: `/admin/teachers`,
        },
        {
          id: "f511c60f-04e5-48f0-a865-a7ec7d55838f",
          name: "Classes",
          path: `/admin/classes`,
        },
        {
          id: "f511c60f-04e5-48f0-a865-a7ec7d55838g",
          name: "Students",
          path: `/admin/students`,
        },
      ],
    },
    {
      id: "59993f82-a00f-430c-be43-13e51c7e8ef3",
      name: "Reports",
      path: `/reports`,
      mobile: "first",
      icon: currentPage => {
        return <Report currentpage={currentPage.toString()} />;
      },
      subNav: [
        {
          id: "8af7d595-c305-4aa8-a7d9-d2fae2538968",
          name: "Classes",
          path: `/reports/classes`,
        },
        {
          id: "5031b6df-985f-4cf6-8909-c8c4b546f3ab",
          name: "Students",
          path: `/reports/students`,
        },
        // {
        //   id: "85565589-5501-4aaa-8754-10ca0c9b4964",
        //   name: "Tokens Usage",
        //   path: `/reports/${projectId}/reports/ai-assistant/tokens-usage`,
        // },
      ],
    },
  ];
};

const BottomNavigationAction = styled(MuiBottomNavigationAction)(props => ({
  "&.MuiButtonBase-root": {
    color:
      props.highlightlabel === "true"
        ? "#0098EA"
        : props.theme.palette.text.primary,
  },
  "& .material-symbols-outlined": {
    /* eslint-disable */
    color: props.highlightlabel === "true" ? "#0098EA" : props.theme.palette.text.primary,
    /* eslint-enable */
  },
  ".MuiBottomNavigationAction-label": {
    fontSize: "10px",
    /* eslint-disable */
    color: props.highlightlabel === "true" ? "#0098EA" : props.theme.palette.text.primary,
    /* eslint-enable */
  },
}));
const MainNavigation = ({
  projectMainNav,
  handleProjectMainNav,
  projectMobileSubNav,
  handleProjectMobileSubNav,
  setProjectMobileSubNav,
}) => {
  const location = useLocation();

  const { currentPage, currentSubpage, currentChild, subNav } = navigationProps(
    navigationItems(),
    location.pathname,
  );
  let mobileClickedSubpage;
  let mobileClickedChild;

  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [pageLoaded, setPageLoaded] = useState(false);
  useState(false);
  const [mobileSubNav, setMobileSubNav] = useState([]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <>
      {isSmallScreen ? (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            display: { xs: "block", lg: "none" },
            zIndex: 1299,
            boxShadow:
              "0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 1px 8px rgba(0, 0, 0, 0.12)",
            height: "75px",
            transition: "height 0.6s",
          }}
          elevation={3}
        >
          {/* First Row */}
          <BottomNavigation
            showLabels
            sx={{
              background: "#fff",
              height: "75px",

              bottom: "0px",
              zIndex: 1,
            }}
          >
            {navigationItems()
              .filter(item => {
                return item.mobile === "first";
              })
              .map(item => (
                <BottomNavigationAction
                  key={item.name}
                  label={item.name}
                  onClick={() => {
                    const obj = mobileNavigationProps(
                      navigationItems(),
                      item.path,
                    );
                    mobileClickedSubpage = obj.mobileClickedSubpage;
                    mobileClickedChild = obj.mobileClickedChild;

                    if (obj.mobileSubNav) {
                      setMobileSubNav(obj.mobileSubNav);
                      handleProjectMobileSubNav(true);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  highlightlabel={(currentPage === item.id).toString()}
                  icon={item.icon(currentPage === item.id)}
                />
              ))}
          </BottomNavigation>
        </Paper>
      ) : (
        <Drawer
          variant="permanent"
          anchor="left"
          open={projectMainNav}
          issmallscreen={isSmallScreen.toString()}
          ispageloaded={pageLoaded.toString()}
          onMouseEnter={() => {
            handleProjectMainNav(true);
          }}
          onMouseLeave={() => {
            handleProjectMainNav(false);
          }}
          sx={{ zIndex: 3000 }}
        >
          <Toolbar sx={{ height: "72px" }} />
          <List
            sx={{
              padding: projectMainNav ? "16px 8px 0px 8px" : "16px 0px 0px 8px",
            }}
          >
            {navigationItems().map(item => (
              <ListItem key={item.name} disablePadding>
                <CustomizedListItemButton
                  className="main-navi"
                  projectmainnav={projectMainNav.toString()}
                  selected={currentPage === item.id}
                  onClick={() => {
                    if (item.target === "new") {
                      window.open(item.path, "_blank", "noreferrer");
                    } else if (item.path) {
                      navigate(item.path);
                      handleProjectMainNav(false);
                    } else if (item.action) {
                      item.action();
                    }
                  }}
                >
                  <CustomizedListItemIcon
                    selected={currentPage === item.id}
                    open={projectMainNav}
                    sx={{
                      minWidth: 0,
                      mr: "24px",
                    }}
                  >
                    {item.icon(currentPage === item.id)}
                    {/* {currentPage === item.id ? item.iconColor : item.icon} */}
                  </CustomizedListItemIcon>
                  <CustomizedListItemText
                    className="main-navi"
                    selected={currentPage === item.id}
                    disableTypography
                  >
                    <Typography variant="subtitle1">{item.name}</Typography>
                  </CustomizedListItemText>
                </CustomizedListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
      {/* eslint-disable */}
       
        <SubNavigation
          CustomizedListItemButton={CustomizedListItemButton}
          CustomizedListItemText={CustomizedListItemText}
          currentSubpage={currentSubpage}
          currentChild={currentChild}
          subNav={subNav}
          projectMobileSubNav={projectMobileSubNav}
          setProjectMobileSubNav={setProjectMobileSubNav}
          mobileClickedSubpage={mobileClickedSubpage}
          mobileClickedChild={mobileClickedChild}
          mobileSubNav={mobileSubNav}
        />
      
      {/* eslint-enable */}
    </>
  );
};
MainNavigation.propTypes = {
  projectMainNav: PropTypes.bool.isRequired,
  handleProjectMainNav: PropTypes.func.isRequired,
  projectMobileSubNav: PropTypes.bool.isRequired,
  handleProjectMobileSubNav: PropTypes.func.isRequired,
  setProjectMobileSubNav: PropTypes.func.isRequired,
};
export default MainNavigation;
