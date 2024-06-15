import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Bible from "../assets/bible.png";
import DashboardVideo from "../assets/dashboard-unscreen.gif";
import Student from "../assets/student.png";
import Teacher from "../assets/teacher.png";
import Add from "../components/GoogleIcons/Add";
import { useAuth } from "../contexts/auth";

const Dashboard = () => {
  const { loader, setActionBar } = useOutletContext();
  const { user } = useAuth();
  useEffect(() => {
    loader.start();

    setActionBar({
      title: {
        enabled: true,
        display: true,
        name: `Welcome back, ${user.name}.`,
      },
    });
    loader.end();
  }, []);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
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
            He saved others; He cannot save Himself He is the King of Israel;
            let Him now come down from the cross, and we will believe in Him.
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
        <Grid item xs={12} lg={6}>
          <Box
            sx={{
              backgroundColor: "#FFF",
              flex: "1 1 auto",
              minHeight: "100%",
              padding: "24px 24px 64px",
              margin: "24px 0px",
              borderRadius: "8px",
            }}
          >
            <div>
              <Typography
                variant="body1"
                color="textPrimary"
                fontWeight={500}
                sx={{ marginBottom: "24px" }}
              >
                Live Class Attendance
              </Typography>
            </div>
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
                variant="body1"
                color="textPrimary"
                fontWeight={500}
                sx={{ marginBottom: "16px" }}
              >
                Analytics: Overall Attendance
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid container item xs={12} lg={6}>
          <Grid item xs={6} />
          {user.role === "superadmin" && (
            <Box
              sx={{
                backgroundColor: "#FFF",
                flex: "1 1 auto",
                padding: "24px",
                margin: "24px 0px",
                borderRadius: "8px",
                position: "relative",
              }}
            >
              <Grid container rowSpacing={4} columnSpacing={4}>
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
                        50
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
                        3
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
                        100
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
