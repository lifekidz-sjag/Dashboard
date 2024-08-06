import { useEffect } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import BackgroundImage from "../assets/background.jpg";
import CardBackgroundImage from "../assets/login.gif";
import { useAuth } from "../contexts/auth";

const UserLayout = () => {
  const { checkAuthenticated } = useAuth();
  const navigate = useNavigate();
  const sharedProps = useOutletContext();

  useEffect(() => {
    // Pages that doesnt require API to load
    // Pages that are not part of user
    if (checkAuthenticated()) {
      navigate("/", { replace: true });
    }
    // navigate("/user/login", { replace: true });
  }, []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "50%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(25px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: { xs: "0", md: "400px" },
          background: "white",
          maxWidth: { xs: "320px", md: "850px" },
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          boxShadow: "0px 2px 20px rgba(185, 211, 215, 0.5)",
        }}
      >
        <Grid container spacing={3}>
          {isMediumScreen && (
            <Grid item xs={7}>
              <Box
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                  backgroundSize: "contain",
                  display: "flex",
                  alignItems: "end",
                }}
                src={CardBackgroundImage}
              />
            </Grid>
          )}

          <Grid
            item
            xs={12}
            md={5}
            sx={{
              padding: { xs: "0px", md: "24px" },
              margin: { xs: "24px", md: "0px" },
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Outlet
                context={{
                  isSmallScreen,
                  isMediumScreen,
                  isLargeScreen,
                  ...sharedProps,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserLayout;
