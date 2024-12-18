import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import Slider from "react-slick";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

import AnnouncementV1 from "../assets/announcement-v1.gif";
import AnnouncementV2 from "../assets/announcement-v2.gif";
import AnnouncementV3 from "../assets/announcement-v3.gif";
import ClockIn from "../assets/time.png";
import ClockOut from "../assets/time-out.png";
import Appbar from "../components/Appbar";
import Add from "../components/GoogleIcons/Add";
import ArrowBack from "../components/GoogleIcons/ArrowBack";
import Download from "../components/GoogleIcons/Download";
import Search from "../components/GoogleIcons/Search";
import MainNavigation from "../components/MainNavigation";
import { useAuth } from "../contexts/auth";
import useConfirm from "../hooks/useConfirm";
import useNotifications from "../services/notifications";

const RootLayout = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // Authetication stuffs
  const { isAuthenticated, checkAuthenticated, user, getUserExecute } =
    useAuth();

  // Local state
  const [mainNav, setMainNav] = useState(false);
  const handleMainNav = bool => {
    setMainNav(bool);
  };

  const [mobileSubNav, setMobileSubNav] = useState(false);
  const handleMobileSubNav = bool => {
    setMobileSubNav(bool);
  };

  const { fetch: fetchNotifications } = useNotifications();

  const [{ data: fetchNotificationsData }, fetchNotificationsExecute] =
    fetchNotifications;
  const [notifications, setNotifications] = useState(null);

  const confirm = useConfirm();

  const props = useOutletContext();
  const { loader, actionBar, setActionBar } = props;
  const ab = actionBar;
  const sab = setActionBar;

  // Search Panel
  const renderSearchButton = () => {
    if (ab.search.enabled) {
      return (
        !ab.search.isOpen &&
        ab.search.display && (
          <Fab
            variant="unboxed"
            onClick={() => {
              sab({
                search: {
                  ...ab.search,
                  isOpen: true,
                },
              });
            }}
          >
            <Search color="inherit" />
          </Fab>
        )
      );
    }
    return null;
  };

  const renderSearchPanel = () => {
    if (ab.search.enabled) {
      return (
        ab.search.isOpen && (
          <Box
            component="form"
            noValidate
            onSubmit={ab.search.submitFunc(ab.search.searchFunc)}
            sx={{
              position: "sticky",
              top: "72px",
              height: "auto",
              zIndex: 2,
              left: "24px",
              right: "24px",
            }}
          >
            <Paper
              elevation={6}
              sx={{
                background: "#FFFFFF",
                padding: { xs: "16px", md: "8px 16px" },
                borderRadius: "16px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <IconButton
                  sx={{ marginTop: "4px" }}
                  onClick={() => {
                    sab({
                      ...ab,
                      title: {
                        ...ab.title,
                        display: true,
                      },
                      description: {
                        ...ab.description,
                        display: true,
                      },

                      search: {
                        ...ab.search,
                        isOpen: false,
                      },
                    });
                    ab.search.backFunc();
                  }}
                >
                  <ArrowBack color="inherit" />
                </IconButton>
                {ab.search.renderContent()}
                <IconButton type="submit" sx={{ marginTop: "4px" }}>
                  <Search color="inherit" />
                </IconButton>
              </Box>
            </Paper>
          </Box>
        )
      );
    }
    return null;
  };

  const slickSettings2 = {
    dots: true,
    // infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const announcementImageList = [
    AnnouncementV1,
    AnnouncementV2,
    AnnouncementV3,
  ];

  const renderNotification = notification => {
    if (notification && notification.length !== 0) {
      if (notification.length > 1) {
        return (
          <Box
            sx={{
              marginY: "24px",
              textAlign: "center",
            }}
          >
            <Slider {...slickSettings2}>
              {notification &&
                notification.map((item, index) => {
                  return (
                    <Card
                      key={item.id}
                      sx={{
                        width: {
                          xs: "80% !important",
                          md: "80% !important",
                        },
                        borderRadius: "16px",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CardMedia
                          component="img"
                          sx={{ width: "100px" }}
                          image={announcementImageList[index]}
                          alt="birthday"
                        />
                      </Box>
                      <CardContent>
                        <Typography
                          variant="h5"
                          color="textPrimary"
                          fontWeight={500}
                          sx={{ marginBottom: "24px" }}
                        >
                          {item.title}
                        </Typography>
                        {item.description.split("\n\n").map(e => {
                          return (
                            <Typography
                              key={e}
                              variant="body1"
                              color="textPrimary"
                              fontWeight={500}
                            >
                              {e}
                            </Typography>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
            </Slider>
          </Box>
        );
      }
      return (
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            key={notification[0].id}
            sx={{
              width: {
                xs: "80% !important",
                sm: "80% !important",
              },
              borderRadius: "16px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CardMedia
                component="img"
                sx={{ width: "100px" }}
                image={announcementImageList[0]}
                alt="birthday"
              />
            </Box>
            <CardContent>
              <Typography
                variant="h5"
                color="textPrimary"
                fontWeight={500}
                sx={{ marginBottom: "24px" }}
              >
                {notification[0].title}
              </Typography>
              {notification[0].description.split("\n\n").map(e => {
                return (
                  <Typography
                    key={e}
                    variant="body1"
                    color="textPrimary"
                    fontWeight={500}
                  >
                    {e}
                  </Typography>
                );
              })}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return null;
  };

  useEffect(() => {
    if (!checkAuthenticated()) {
      navigate("/user");
    } else if (!user) {
      getUserExecute();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loader.start();
    fetchNotificationsExecute({
      params: {
        "filter[status]": "active",
        sort: "-updatedAt",
      },
    });
  }, []);

  useEffect(() => {
    if (user && user.userId) {
      // do something
      loader.start();
    }

    return () => {};
  }, [user]);

  useEffect(() => {
    if (fetchNotificationsData && fetchNotificationsData.data) {
      setNotifications(fetchNotificationsData.data);

      const readNotifications =
        JSON.parse(localStorage.getItem("sjag_notifications")) || [];
      const unread = fetchNotificationsData.data.some(
        notification => !readNotifications.includes(notification.id),
      );
      if (unread) {
        confirm.open();
        const notArray = fetchNotificationsData.data.map(el => {
          return el.id;
        });
        localStorage.setItem("sjag_notifications", JSON.stringify(notArray));
        loader.end();
      }
    }

    return () => {};
  }, [fetchNotificationsData]);

  return (
    isAuthenticated &&
    user && (
      <Box
        sx={{
          opacity: loader.loading === -1 ? "0" : "1",
          transition: "var(--trans)",
          backgroundColor: "#E9F2FF",
        }}
      >
        <Appbar loader={loader} />
        <MainNavigation
          mainNav={mainNav}
          handleMainNav={handleMainNav}
          mobileSubNav={mobileSubNav}
          handleMobileSubNav={handleMobileSubNav}
          setMobileSubNav={setMobileSubNav}
          user={user}
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
            {renderSearchPanel()}
            {!ab.search.isOpen && (
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
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "relative",
                    padding: "0px",
                  }}
                >
                  {ab.fabClock.enabled && (
                    <Box sx={{ marginRight: "8px" }}>
                      <Fab
                        variant="clockin"
                        aria-label="clock"
                        onClick={e => {
                          ab.fabClock.actionClockIn(e);
                        }}
                        sx={{
                          position: isSmallScreen ? "fixed" : "relative",
                          top: isSmallScreen ? "auto" : "auto",
                          right: isSmallScreen ? "120px" : "auto",
                          bottom: isSmallScreen ? "96px" : "auto",
                          marginLeft: "8px",
                        }}
                      >
                        <Box
                          component="img"
                          src={ClockIn}
                          sx={{ width: "16px", height: "16px" }}
                        />
                      </Fab>
                      <Fab
                        variant="clockout"
                        aria-label="clock"
                        onClick={e => {
                          ab.fabClock.actionClockOut(e);
                        }}
                        sx={{
                          position: isSmallScreen ? "fixed" : "relative",
                          top: isSmallScreen ? "auto" : "auto",
                          right: isSmallScreen ? "72px" : "auto",
                          bottom: isSmallScreen ? "96px" : "auto",
                          marginLeft: "8px",
                        }}
                      >
                        <Box
                          component="img"
                          src={ClockOut}
                          sx={{ width: "16px", height: "16px" }}
                        />
                      </Fab>
                    </Box>
                  )}
                  {renderSearchButton()}

                  {ab.fab.enabled &&
                    (ab.fab.export ? (
                      <Fab
                        variant="contained"
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
                  user,
                  mainNav,
                  handleMainNav,

                  contentPadding: {
                    padding: { xs: "0px 36px 164px 36px", md: "0px" },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Popup */}
        <Dialog
          fullWidth
          maxWidth="sm"
          open={confirm.isOpen}
          onClose={() => {}}
          disableEscapeKeyDown
          onBackdropClick={() => {}}
          sx={{ zIndex: 1502 }}
        >
          <DialogTitle>Notifications</DialogTitle>
          <DialogContent sx={{ overflow: "hidden" }}>
            <Box sx={{ width: "100%" }}>
              {renderNotification(notifications)}
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 0 }}>
            <Button
              variant="text"
              onClick={() => {
                confirm.close();
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
};
RootLayout.propTypes = {
  loader: PropTypes.shape(),
  actionBar: PropTypes.shape(),
  setActionBar: PropTypes.func,
};
export default RootLayout;
