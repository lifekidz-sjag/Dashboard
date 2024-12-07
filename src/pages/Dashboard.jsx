import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Slider from "react-slick";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import dayjs, { utc } from "dayjs";
import moment from "moment";

import AnnouncementV1 from "../assets/announcement-v1.gif";
import AnnouncementV2 from "../assets/announcement-v2.gif";
import AnnouncementV3 from "../assets/announcement-v3.gif";
import Bible from "../assets/bible.png";
import BirthdayV1 from "../assets/birthday-v1.gif";
import BirthdayV2 from "../assets/birthday-v2.gif";
import BirthdayV3 from "../assets/birthday-v3.gif";
import BirthdayV4 from "../assets/birthday-v4.gif";
import BirthdayV5 from "../assets/birthday-v5.gif";
import ClockIn from "../assets/clock-in.png";
import ClockOut from "../assets/clock-out.png";
import DashboardVideo from "../assets/dashboard-unscreen.gif";
import Marketing from "../assets/marketing.png";
import Student from "../assets/student.png";
import Teacher from "../assets/teacher.png";
import Add from "../components/GoogleIcons/Add";
import Popup from "../components/Popup";
import { useAuth } from "../contexts/auth";
import useStudentsFeatures from "../features/students/useStudentsFeatures";
import usePopup from "../hooks/usePopup";
import useBible from "../services/bible";
import useNotifications from "../services/notifications";

const Dashboard = () => {
  const birthdayImageList = [
    BirthdayV1,
    BirthdayV2,
    BirthdayV3,
    BirthdayV4,
    BirthdayV5,
  ];
  const announcementImageList = [
    AnnouncementV1,
    AnnouncementV2,
    AnnouncementV3,
  ];
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  const slickSettings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  const contextProps = useOutletContext();
  const { loader, setActionBar, actionBarDefault } = contextProps;
  const { user } = useAuth();
  const { fetch: fetchNotifications } = useNotifications();
  const [notification, setNotification] = useState(null);

  const { fetch: fetchBible, post: postBible } = useBible();
  const [{ data: fetchBibleData }, fetchBibleExecute] = fetchBible;
  const [postBibleExecute] = postBible;
  const [info, setInfo] = useState(null);
  dayjs.extend(utc);
  const popupClockIn = usePopup();
  const popupClockOut = usePopup();

  const navigate = useNavigate();
  const { features } = useStudentsFeatures({
    contextProps,
    popupClockIn,
    popupClockOut,
  });

  const { clockInStudent, clockOutStudent } = features;
  const [{ data: fetchNotificationsData }, fetchNotificationsExecute] =
    fetchNotifications;
  useEffect(() => {
    loader.start();
    fetchNotificationsExecute({
      params: {
        "filter[status]": "active",
        sort: "-updatedAt",
      },
    });

    axios.get("Dashboard/Info").then(response => {
      setInfo(response.data);
      loader.end();
    });
    setActionBar({
      ...actionBarDefault,
      title: {
        enabled: true,
        display: true,
        name: `Welcome back, ${user.name}.`,
      },
    });
    fetchBibleExecute();
  }, []);

  useEffect(() => {
    if (fetchNotificationsData && fetchNotificationsData.data) {
      setNotification(fetchNotificationsData.data);
    }

    return () => {};
  }, [fetchNotificationsData]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const renderBirthday = () => {
    if (info.birthday.length !== 0) {
      if (info.birthday.length > 1) {
        return (
          <Box sx={{ textAlign: "center" }}>
            <Slider {...slickSettings}>
              {info &&
                info.birthday &&
                info.birthday.map((e, index) => {
                  return (
                    <Card
                      key={e.studentName}
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
                          sx={{ width: "200px" }}
                          image={birthdayImageList[index]}
                          alt="birthday"
                        />
                      </Box>
                      <CardContent>
                        <Typography
                          variant="h5"
                          gutterBottom
                          color="textPrimary"
                          fontWeight={500}
                          component="div"
                        >
                          {e.studentName}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textPrimary"
                          fontWeight={500}
                        >
                          {moment(e.birthdayDate).format("MMMM D, YYYY")}
                        </Typography>
                        <Typography variant="body1" color="textPrimary">
                          {e.dayCountdown === 0
                            ? "TODAY!"
                            : `${e.dayCountdown} day(s) from now`}
                        </Typography>
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
            key={info.birthday[0].studentName}
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
                sx={{ width: "200px" }}
                image={birthdayImageList[0]}
                alt="birthday"
              />
            </Box>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                color="textPrimary"
                fontWeight={500}
                component="div"
              >
                {info.birthday[0].studentName}
              </Typography>
              <Typography variant="body1" color="textPrimary" fontWeight={500}>
                {moment(info.birthday[0].birthdayDate).format("MMMM D, YYYY")}
              </Typography>
              <Typography variant="body1" color="textPrimary">
                {info.birthday[0].dayCountdown === 0
                  ? "TODAY!"
                  : `${info.birthday[0].dayCountdown} day(s) from now`}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return null;
  };
  const renderNotification = () => {
    if (notification && notification.length !== 0) {
      if (notification.length > 1) {
        return (
          <Box
            sx={{
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
                          sx={{ width: "200px" }}
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
                md: "80% !important",
              },
              borderRadius: "16px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CardMedia
                component="img"
                sx={{ width: "200px" }}
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

  const [verse, setVerse] = useState({ reference: "", content: "" });

  useEffect(() => {
    if (fetchBibleData) {
      if (
        fetchBibleData.id &&
        fetchBibleData.reference &&
        fetchBibleData.text
      ) {
        setVerse({
          reference: fetchBibleData.reference,
          content: fetchBibleData.text,
        });
      } else {
        const fetchVerseOfTheDay = async () => {
          const response = await axios.get(
            "https://beta.ourmanna.com/api/v1/get/?format=json",
          );
          const verseOfTheDay = response.data.verse.details;
          setVerse({
            reference: verseOfTheDay.reference,
            content: verseOfTheDay.text,
          });
          postBibleExecute({
            reference: verseOfTheDay.reference,
            text: verseOfTheDay.text,
          });
        };
        fetchVerseOfTheDay();
      }
    }
  }, [fetchBibleData]);
  return (
    info && (
      <>
        <Box>
          <Box
            sx={{
              display: { xs: "block", sm: "flex" },
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "primary.light",
                padding: "24px",
                borderRadius: "8px",
                position: "relative",
                flex: 1,
                gap: "16px",
                marginBottom: { xs: "24px", sm: "0px" },
              }}
            >
              <Box
                component="img"
                sx={{
                  width: { xs: 180, sm: 250 },
                  position: "absolute",
                  top: { xs: "-90px", sm: "unset" },
                  bottom: { sm: "0px" },
                  right: { xs: "8px", sm: "24px" },
                }}
                src={DashboardVideo}
              />
              <Box sx={{ maxWidth: { xs: "100%", sm: "50%" } }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "800", marginBottom: "16px", width: "60%" }}
                >
                  {verse.reference || "Matthew 27:42"}
                </Typography>
                <Typography variant="h8">
                  {verse.content ||
                    "He saved others; He cannot save Himself He is the King of Israel; let Him now come down from the cross, and we will believe in Him."}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: "#CCDFFB",
                padding: { xs: "30px", sm: "40px" },
                borderRadius: "8px",
                width: { xs: "100%", sm: "50%" },
                // flex: 1,
              }}
            >
              <div>
                <Typography
                  variant="h5"
                  color="textPrimary"
                  fontWeight={500}
                  sx={{ marginBottom: "24px" }}
                >
                  Announcements
                </Typography>
              </div>

              {renderNotification()}
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid container item xs={12} lg={6}>
              {user.role.indexOf("admin") >= 0 && (
                <Box
                  sx={{
                    backgroundColor: "#FFF",
                    flex: "1 1 auto",
                    height: "100%",
                    padding: "24px",
                    margin: "24px 0px 0px 0px",
                    borderRadius: "8px",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="h5"
                    color="textPrimary"
                    fontWeight={500}
                    sx={{ marginBottom: "24px" }}
                  >
                    Quick Actions
                  </Typography>
                  <Grid container rowSpacing={4} columnSpacing={4}>
                    <Grid item xs={6} sm={6}>
                      <Box sx={{ marginBottom: "16px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            fontWeight={500}
                          >
                            Teachers
                          </Typography>
                          <IconButton
                            onClick={() => {
                              navigate("/teachers?add=true");
                            }}
                            sx={{
                              padding: "0px",
                              marginLeft: "8px",
                              border: `1px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            <Add color={theme.palette.primary.main} />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={Teacher}
                            sx={{ width: "auto", height: "120px" }}
                          />
                          <Typography
                            variant={isSmallScreen ? "h5" : "h4"}
                            sx={{ marginLeft: "16px" }}
                          >
                            {info.dashboardInfo.teacherCount}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <Box sx={{ marginBottom: "16px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            fontWeight={500}
                          >
                            Classes
                          </Typography>
                          <IconButton
                            onClick={() => {
                              navigate("/classes?add=true");
                            }}
                            sx={{
                              padding: "0px",
                              marginLeft: "8px",
                              border: `1px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            <Add color={theme.palette.primary.main} />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={Bible}
                            sx={{ width: "auto", height: "120px" }}
                          />
                          <Typography
                            variant={isSmallScreen ? "h5" : "h4"}
                            sx={{ marginLeft: "16px" }}
                          >
                            {info.dashboardInfo.classCount}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <Box sx={{ marginBottom: "16px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            fontWeight={500}
                          >
                            Students
                          </Typography>
                          <IconButton
                            onClick={() => {
                              navigate("/students?add=true");
                            }}
                            sx={{
                              padding: "0px",
                              marginLeft: "8px",
                              border: `1px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            <Add color={theme.palette.primary.main} />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={Student}
                            sx={{ width: "auto", height: "120px" }}
                          />
                          <Typography
                            variant={isSmallScreen ? "h5" : "h4"}
                            sx={{ marginLeft: "16px" }}
                          >
                            {info.dashboardInfo.studentCount}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            fontWeight={500}
                          >
                            Announcements
                          </Typography>
                          <IconButton
                            onClick={() => {
                              navigate("/notifications?add=true");
                            }}
                            sx={{
                              padding: "0px",
                              marginLeft: "8px",
                              border: `1px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            <Add color={theme.palette.primary.main} />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={Marketing}
                            sx={{ width: "auto", height: "120px" }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {user.role.indexOf("teacher") >= 0 && (
                <Box
                  sx={{
                    backgroundColor: "#FFF",
                    flex: "1 1 100%",
                    height: "100%",
                    padding: "24px",
                    margin: "24px 0px",
                    borderRadius: "8px",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="h5"
                    color="textPrimary"
                    fontWeight={500}
                    sx={{ marginBottom: "24px" }}
                  >
                    Quick Actions
                  </Typography>
                  <Grid container rowSpacing={4} columnSpacing={4}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ marginBottom: "16px", width: "100%" }}>
                        Clock in
                      </Box>
                      <Card>
                        <CardActionArea
                          onClick={() => {
                            clockInStudent.onScan();
                          }}
                          sx={{ textAlign: "center" }}
                        >
                          <Box
                            component="img"
                            src={ClockIn}
                            sx={{
                              width: { xs: "50%", sm: "100%" },
                              padding: "24px",
                            }}
                          />
                        </CardActionArea>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ marginBottom: "16px", width: "100%" }}>
                        Clock out
                      </Box>
                      <Card>
                        <CardActionArea
                          onClick={() => {
                            clockOutStudent.onScan();
                          }}
                          sx={{ textAlign: "center" }}
                        >
                          <Box
                            component="img"
                            src={ClockOut}
                            sx={{
                              width: { xs: "50%", sm: "100%" },
                              padding: "24px",
                            }}
                          />
                        </CardActionArea>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ marginBottom: "16px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              marginBottom: "16px",
                              width: "100%",
                              display: "flex",
                              justifyContent: {
                                xs: "flex-start",
                                sm: "space-between",
                              },
                            }}
                          >
                            Students
                            <Typography
                              sx={{ marginLeft: "16px", fontSize: "24px" }}
                            >
                              {info.dashboardInfo.studentCount}
                            </Typography>
                            <IconButton
                              onClick={() => {
                                navigate("/students?add=true");
                              }}
                              sx={{
                                padding: "0px",
                                marginLeft: "8px",
                                border: `1px solid ${theme.palette.primary.main}`,
                              }}
                            >
                              <Add
                                color={theme.palette.primary.main}
                                fontSize="16px"
                              />
                            </IconButton>
                          </Box>
                        </Box>
                        <Card>
                          <CardActionArea
                            onClick={() => {
                              navigate("/students?add=true");
                            }}
                            sx={{ textAlign: "center" }}
                          >
                            <Box
                              component="img"
                              src={Student}
                              sx={{
                                width: { xs: "50%", sm: "100%" },
                                padding: "24px",
                              }}
                            />
                          </CardActionArea>
                        </Card>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  backgroundColor: "#FFF",
                  flex: "1 1 auto",
                  minHeight: "100%",
                  padding: "24px 24px 0px",
                  margin: "24px 0px",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    color="textPrimary"
                    fontWeight={500}
                    sx={{ marginBottom: " 24px" }}
                  >
                    Upcoming Birthdays
                  </Typography>
                </Box>
                {renderBirthday()}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Popup {...popupClockIn}>{popupClockIn.popupContent}</Popup>
        <Popup {...popupClockOut}>{popupClockOut.popupContent}</Popup>
      </>
    )
  );
};

export default Dashboard;
