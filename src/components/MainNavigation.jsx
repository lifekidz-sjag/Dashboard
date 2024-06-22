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

import ChildCare from "./GoogleIcons/ChildCare";
import Dashboard from "./GoogleIcons/Dashboard";
import Groups from "./GoogleIcons/Groups";
import MoreHoriz from "./GoogleIcons/MoreHoriz";
import Notifications from "./GoogleIcons/NotificationsIcon";
import Report from "./GoogleIcons/Report";
import School from "./GoogleIcons/School";
import ShieldPerson from "./GoogleIcons/ShieldPerson";
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
    props.mainnav === "true" || props.projectsubnav === "true"
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

  // console.log("currentPage", currentPage);
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
    mobileSubNavList: subNav,
    mobileSubChild: subChild,
  };
};

const navigationItems = user => {
  const list = [];

  list.push(
    {
      id: "ce7f9d92-8c48-49e4-b3af-6305c427e893",
      name: "Dashboard",
      path: `/`,
      icon: currentPage => {
        return <Dashboard currentpage={currentPage.toString()} />;
      },
      mobile: "first",
    },
    {
      id: "9ee19422-c1cb-4998-81af-b7b837d72106",
      name: "Students",
      path: `/students`,
      icon: currentPage => {
        return <ChildCare currentpage={currentPage.toString()} />;
      },
      mobile: "first",
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
      ],
    },
    {
      id: "344d925d-7397-4cd9-bd97-689d07a37dc7",
      name: "Teachers",
      path: `/teachers`,
      icon: currentPage => {
        return <School currentpage={currentPage.toString()} />;
      },
      mobile: "second",
    },
  );
  if (user.role.indexOf("admin") >= 0) {
    list.push(
      {
        id: "3e234c2f-4320-4941-8c7b-4b43d4f79266",
        name: "Classes",
        path: `/classes`,
        icon: currentPage => {
          return <Groups currentpage={currentPage.toString()} />;
        },
        mobile: "second",
      },
      {
        id: "31a62c4b-13ff-4f86-af3f-b316fb8c9b8d",
        name: "Admins",
        path: `/admins`,
        icon: currentPage => {
          return <ShieldPerson currentpage={currentPage.toString()} />;
        },
        mobile: "second",
      },
      {
        id: "31a62c4b-13ff-4f86-af3f-b316fb8c9b8f",
        name: "Announcements",
        path: `/notifications`,
        icon: currentPage => {
          return <Notifications currentpage={currentPage.toString()} />;
        },
        mobile: "second",
      },
    );
  }
  return list;
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
  mainNav,
  handleMainNav,
  mobileSubNav,
  handleMobileSubNav,
  setMobileSubNav,
  user,
}) => {
  const location = useLocation();

  const { currentPage, currentSubpage, currentChild, subNav } = navigationProps(
    navigationItems(user),
    location.pathname,
  );
  let mobileClickedSubpage;
  let mobileClickedChild;

  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false);
  const [isDelayedMobileMenuExpanded, setIsDelayedMobileMenuExpanded] =
    useState(false);
  const [mobileSubNavList, setMobileSubNavList] = useState([]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    if (!isMobileMenuExpanded) {
      setTimeout(() => {
        setIsDelayedMobileMenuExpanded(false);
      }, 100);
    }
  }, [isMobileMenuExpanded]);

  useEffect(() => {
    if (isMobileMenuExpanded) {
      setIsMobileMenuExpanded(false);
    }
  }, [location.pathname]);

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
            height: isMobileMenuExpanded ? "150px" : "75px",
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
            {navigationItems(user)
              .filter(item => {
                return item.mobile === "first";
              })
              .map(item => (
                <BottomNavigationAction
                  key={item.name}
                  label={item.name}
                  onClick={() => {
                    const obj = mobileNavigationProps(
                      navigationItems(user),
                      item.path,
                    );
                    mobileClickedSubpage = obj.mobileClickedSubpage;
                    mobileClickedChild = obj.mobileClickedChild;

                    if (obj.mobileSubNavList) {
                      setMobileSubNavList(obj.mobileSubNavList);
                      handleMobileSubNav(true);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  highlightlabel={(currentPage === item.id).toString()}
                  icon={item.icon(currentPage === item.id)}
                />
              ))}
            <BottomNavigationAction
              label="Show more"
              onClick={() => {
                setIsMobileMenuExpanded(true);
                setIsDelayedMobileMenuExpanded(true);
              }}
              sx={{
                opacity: isMobileMenuExpanded ? "0" : "100",
                cursor: isMobileMenuExpanded ? "none" : "pointer",
              }}
              icon={<MoreHoriz currentPage={false} />}
            />
          </BottomNavigation>
          {/* Second row */}
          <BottomNavigation
            showLabels
            sx={{
              height: "75px",
              background: "#fff",
              padding: "0px 0px 8px 0px",
              transition: "all ",
            }}
          >
            {navigationItems(user)
              .filter(item => {
                return item.mobile === "second";
              })
              .map(item => (
                <BottomNavigationAction
                  key={item.name}
                  label={item.name}
                  onClick={() => {
                    const obj = mobileNavigationProps(
                      navigationItems(user),
                      item.path,
                    );
                    mobileClickedSubpage = obj.mobileClickedSubpage;
                    mobileClickedChild = obj.mobileClickedChild;

                    if (obj.mobileSubNav) {
                      setMobileSubNav(obj.mobileSubNav);
                      handleMobileSubNav(true);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  highlightlabel={(currentPage === item.id).toString()}
                  icon={item.icon(currentPage === item.id)}
                />
              ))}

            <BottomNavigationAction
              label="Show less"
              onClick={() => {
                setIsMobileMenuExpanded(false);
              }}
              sx={{
                opacity: !isDelayedMobileMenuExpanded ? "0" : "100",
                cursor: !isDelayedMobileMenuExpanded ? "none" : "pointer",
              }}
              icon={<MoreHoriz currentPage={false} />}
            />
          </BottomNavigation>
        </Paper>
      ) : (
        <Drawer
          variant="permanent"
          anchor="left"
          open={mainNav}
          issmallscreen={isSmallScreen.toString()}
          ispageloaded={pageLoaded.toString()}
          onMouseEnter={() => {
            handleMainNav(true);
          }}
          onMouseLeave={() => {
            handleMainNav(false);
          }}
          sx={{ zIndex: 3000 }}
        >
          <Toolbar sx={{ height: "72px" }} />
          <List
            sx={{
              padding: mainNav ? "16px 8px 0px 8px" : "16px 0px 0px 8px",
            }}
          >
            {navigationItems(user).map(item => (
              <ListItem key={item.name} disablePadding>
                <CustomizedListItemButton
                  className="main-navi"
                  mainnav={mainNav.toString()}
                  selected={currentPage === item.id}
                  onClick={() => {
                    if (item.target === "new") {
                      window.open(item.path, "_blank", "noreferrer");
                    } else if (item.path) {
                      navigate(item.path);
                      handleMainNav(false);
                    } else if (item.action) {
                      item.action();
                    }
                  }}
                >
                  <CustomizedListItemIcon
                    selected={currentPage === item.id}
                    open={mainNav}
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
          mobileSubNav={mobileSubNav}
          setMobileSubNav={setMobileSubNav}
          mobileClickedSubpage={mobileClickedSubpage}
          mobileClickedChild={mobileClickedChild}
          mobileSubNavList={mobileSubNavList}
        />
      
      {/* eslint-enable */}
    </>
  );
};
MainNavigation.propTypes = {
  mainNav: PropTypes.bool.isRequired,
  handleMainNav: PropTypes.func.isRequired,
  mobileSubNav: PropTypes.bool.isRequired,
  handleMobileSubNav: PropTypes.func.isRequired,
  setMobileSubNav: PropTypes.func.isRequired,
  user: PropTypes.shape().isRequired,
};
export default MainNavigation;
