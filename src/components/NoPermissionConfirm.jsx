import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";

import uhOhPage from "../assets/sjag_uh_oh.gif";

const NoPermissionConfirm = ({ cancel, isOpen, onClose = null }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      disableEscapeKeyDown
      onBackdropClick={() => {}}
      sx={{ zIndex: 3000 }}
    >
      <DialogTitle>Uh Oh...</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: { xs: "14px", md: "18px" } }}>
          <Box
            component="img"
            src={uhOhPage}
            sx={{
              width: { xs: "150px", md: "200px" },
              display: "table",
              margin: "0px auto 30px auto",
            }}
          />
          We are sorry. You do not have permission to perform this action.
          Please contact your project owner for more details.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={async e => {
            if (cancel.onClick) {
              cancel.onClick(e);
            }
          }}
        >
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NoPermissionConfirm.propTypes = {
  cancel: PropTypes.shape().isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default NoPermissionConfirm;
