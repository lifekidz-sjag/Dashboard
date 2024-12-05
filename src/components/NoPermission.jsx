import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import uhOhPage from "../assets/sjag_uh_oh.gif";

const NoPermission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: { xs: "50vh", md: "calc(100vh - 300px)" },
      }}
    >
      <Card
        variant="outlined"
        sx={{
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <CardMedia
          component="img"
          image={uhOhPage}
          sx={{
            width: { xs: "150px", md: "200px" },
            display: "table",
            margin: "0 auto",
          }}
        />
        <CardContent
          style={{
            maxWidth: "640px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Typography
            gutterBottom
            component="div"
            variant="h5"
            sx={{
              marginBottom: "16px",
              fontWeight: "600",
            }}
          >
            Uh Oh...
          </Typography>
          <Typography
            flexWrap
            component="div"
            sx={{
              fontSize: { xs: "14px", md: "unset" },
              color: "#666",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            We are sorry. You do not have permission to perform this action.
            Please contact admin if this is unexpected.
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
        </CardContent>
      </Card>
    </Box>
  );
};

NoPermission.propTypes = {};

export default NoPermission;
