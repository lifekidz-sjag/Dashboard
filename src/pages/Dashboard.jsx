import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  List,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import dayjs, { utc } from "dayjs";
import moment from "moment";

import Bible from "../assets/bible.png";
import Birthday from "../assets/birthday.gif";
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
import useNotifications from "../services/notifications";

const Dashboard = () => {
  const contextProps = useOutletContext();
  const { loader, setActionBar, actionBarDefault } = contextProps;
  const { user } = useAuth();
  const { fetch: fetchNotifications } = useNotifications();
  const [notification, setNotification] = useState(null);
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
  const [
    { data: fetchNotificationsData, error: fetchNotificationsError },
    fetchNotificationsExecute,
  ] = fetchNotifications;
  useEffect(() => {
    loader.start();
    fetchNotificationsExecute({
      params: {
        "filter[status]": "active",
        sort: "-updatedAt",
        "page[size]": 1,
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
  }, []);

  useEffect(() => {
    if (fetchNotificationsData && fetchNotificationsData.data) {
      setNotification(fetchNotificationsData.data);
    }

    return () => {};
  }, [fetchNotificationsData]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    info && (
      <>
        <Box>
          <Box
            sx={{
              backgroundColor: "primary.light",
              padding: "24px 24px 24px 24px",
              borderRadius: "8px",
              position: "relative",
              marginTop: "32px",
            }}
          >
            <Box
              component="img"
              sx={{
                width: { xs: 180, sm: 250 },
                position: "absolute",
                top: { xs: "-64px", sm: "-80px" },
                right: { xs: "8px", sm: "24px" },
              }}
              src={DashboardVideo}
            />
            <Box sx={{ maxWidth: { xs: "100%", sm: "80%" } }}>
              <Typography variant="h6">Verse of the day </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "800", marginBottom: "16px" }}
              >
                Matthew 27:42
              </Typography>
              <Typography variant="h8">
                He saved others; He cannot save Himself He is the King of
                Israel; let Him now come down from the cross, and we will
                believe in Him.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid container item xs={12} lg={6}>
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
                  Teacher Quick Actions
                </Typography>
                <Grid container rowSpacing={4} columnSpacing={4}>
                  <Grid item xs={6} sm={6}>
                    <Box sx={{ marginBottom: "16px", width: "100%" }}>
                      Clock in
                    </Box>
                    <Card>
                      <CardActionArea
                        onClick={() => {
                          clockInStudent.onScan();
                        }}
                      >
                        <Box
                          component="img"
                          src={ClockIn}
                          sx={{ width: "100%", padding: "24px" }}
                        />
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Box sx={{ marginBottom: "16px", width: "100%" }}>
                      Clock out
                    </Box>
                    <Card>
                      <CardActionArea
                        onClick={() => {
                          clockOutStudent.onScan();
                        }}
                      >
                        <Box
                          component="img"
                          src={ClockOut}
                          sx={{ width: "100%", padding: "24px" }}
                        />
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  backgroundColor: "#FFF",
                  flex: "1 1 auto",
                  minHeight: "100%",
                  padding: "24px 24px 64px",
                  margin: "24px 0px",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    color="textPrimary"
                    fontWeight={500}
                    sx={{ marginBottom: "16px" }}
                  >
                    Upcoming Birthdays
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={Birthday}
                      sx={{ width: "200px", marginTop: "24px" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List
                      sx={{
                        width: "100%",
                        borderRadius: { xs: "24px 24px 0px 0px", md: "8px" },
                        backgroundColor: "background.paper",
                      }}
                    >
                      {info &&
                        info.birthday &&
                        info.birthday.map((e, index) => {
                          return (
                            <Box
                              key={e.studentName}
                              sx={{ marginBottom: "24px" }}
                            >
                              <Typography
                                variant="h5"
                                color="textPrimary"
                                fontWeight={500}
                              >
                                {index + 1}. {e.studentName}
                              </Typography>
                              <Typography
                                variant="body1"
                                color="textPrimary"
                                fontWeight={500}
                              >
                                {moment(e.birthdayDate).format("MMMM D, YYYY")},{" "}
                                {e.dayCountdown} days
                              </Typography>
                            </Box>
                          );
                        })}
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid container item xs={12} lg={6}>
              <Grid item xs={6} />
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
                    Admin Actions
                  </Typography>
                  <Grid container rowSpacing={1} columnSpacing={4}>
                    <Grid item xs={6} sm={4}>
                      <Box sx={{ marginBottom: "16px" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                            justifyContent: "flex-start",
                          }}
                        >
                          <Box
                            component="img"
                            src={Teacher}
                            sx={{ width: "auto", height: "64px" }}
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
                    <Grid item xs={6} sm={4}>
                      <Box sx={{ marginBottom: "16px" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                            justifyContent: "flex-start",
                          }}
                        >
                          <Box
                            component="img"
                            src={Bible}
                            sx={{ width: "auto", height: "64px" }}
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
                    <Grid item xs={6} sm={4}>
                      <Box sx={{ marginBottom: "16px" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                            justifyContent: "flex-start",
                          }}
                        >
                          <Box
                            component="img"
                            src={Student}
                            sx={{ width: "auto", height: "64px" }}
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
                    <Grid item xs={6} sm={4}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                            justifyContent: "flex-start",
                          }}
                        >
                          <Box
                            component="img"
                            src={Marketing}
                            sx={{ width: "auto", height: "64px" }}
                          />
                        </Box>
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
                  minHeight: "80%",
                  padding: "24px",
                  margin: "24px 0px",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <Typography
                    variant="h5"
                    color="textPrimary"
                    fontWeight={500}
                    sx={{ marginBottom: "24px" }}
                  >
                    Notifications by Admin
                  </Typography>
                </div>
                <Card variant="project-card">
                  <CardContent sx={{ padding: "16px" }}>
                    <Typography
                      variant="h5"
                      color="textPrimary"
                      fontWeight={500}
                      sx={{ marginBottom: "24px" }}
                    >
                      {notification && notification[0].title}
                    </Typography>
                    {notification &&
                      notification[0].description.split("\n\n").map(e => {
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
