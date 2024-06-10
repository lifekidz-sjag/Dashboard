import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const UserLogout = () => {
  const navigate = useNavigate(); // FORM FIELDS SET UP

  return (
    <>
      <Box sx={{ marginBottom: "16px" }}>
        <Typography variant="subtitle1">Logged Out</Typography>
        <Typography variant="body2">
          You have logged out from SJAG Lifekidz Attendance System successfully.
        </Typography>
      </Box>

      <Box
        sx={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          // endIcon={<ArrowForward />}
          onClick={() => {
            navigate("/user");
          }}
        >
          Back to login
        </Button>
      </Box>
    </>
  );
};

export default UserLogout;
