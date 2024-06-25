import {
  Link,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Error from "../assets/404.gif";

const Error404 = () => {
  const error = useRouteError();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const navigate = useNavigate();

  console.error(error);

  return (
    <>
      <Box>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            background: { xs: "white" },
            borderBottom: { md: "1px solid rgba(0, 0, 0, 0.08)" },
            transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            boxShadow: {
              xs: "rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px",
              md: "none",
            },
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-end", md: "space-between" },
              paddingY: "0px",
              height: "72px",
              // paddingX: "36px",
            }}
          >
            {isMediumScreen && (
              <Link
                label="Home"
                to="/"
                sx={{ display: { xs: "none", lg: "initial" } }}
              />
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingY: "60px",
          background: "#E9F2FF",
        }}
      >
        <Box
          component="img"
          src={Error}
          sx={{ width: "300px", height: "300px" }}
        />
        <Typography variant="h4" sx={{ marginTop: "8px" }}>
          Uh oh! It looks like we took a wrong turn.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: "8px" }}>
          The page you are looking for is no longer available.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (location.key === "default") {
              navigate("/");
            } else {
              navigate(-1);
            }
          }}
          sx={{ marginTop: "16px" }}
        >
          Back to previous page
        </Button>
      </Box>
    </>
  );
};

export default Error404;
