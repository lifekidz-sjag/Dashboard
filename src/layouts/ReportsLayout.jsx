import { Outlet, useOutletContext } from "react-router-dom";
import { Box } from "@mui/material";

const ReportsLayout = () => {
  // Shared components
  const props = useOutletContext();

  return (
    <Box>
      <Outlet
        context={{
          ...props,
        }}
      />
    </Box>
  );
};

export default ReportsLayout;
