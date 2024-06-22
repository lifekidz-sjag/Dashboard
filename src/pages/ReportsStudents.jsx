import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import BlankImage from "../assets/sjag_blank.gif";

const ReportsStudents = () => {
  const contextProps = useOutletContext();
  const { actionBarDefault, setActionBar, loader } = contextProps;
  useEffect(() => {
    loader.end();
    setActionBar({
      ...actionBarDefault,
      title: {
        enabled: true,
        display: true,
        name: "Reports - Students",
      },
    });
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        marginY: "60px",
      }}
    >
      <Box component="img" src={BlankImage} />
      <Typography variant="h4" sx={{ marginTop: "8px" }}>
        It’s empty here.
      </Typography>
      <Typography variant="body1" sx={{ marginTop: "8px" }}>
        There isn’t any data available for that yet. Check back later.
      </Typography>
    </Box>
  );
};

export default ReportsStudents;
