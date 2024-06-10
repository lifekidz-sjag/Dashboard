import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";

const Confirm = ({
  title,
  content,
  confirm,
  cancel,
  isOpen,
  onClose,
  zIndex,
}) => {
  let confirmTextNormal;
  let confirmTextStaging;
  if (Array.isArray(confirm.text) && confirm.text.length === 2) {
    [confirmTextNormal, confirmTextStaging] = confirm.text;
  } else {
    confirmTextNormal = confirm.text;
    confirmTextStaging = confirmTextNormal;
  }

  const [isRunning, setIsRunning] = useState(false);
  const [confirmText, setConfirmText] = useState(confirmTextNormal);

  useEffect(() => {
    setConfirmText(confirmTextNormal);
  }, [confirmTextNormal, isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      disableEscapeKeyDown
      onBackdropClick={() => {}}
      sx={{ zIndex }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: { xs: "14px", md: "18px" } }}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={async e => {
            if (cancel.onClick) {
              if (isRunning) {
                return;
              }

              cancel.onClick(e);
            }
          }}
        >
          {cancel.text}
        </Button>
        <Button
          onClick={async e => {
            if (confirm.onClick) {
              if (isRunning) {
                return;
              }

              setConfirmText(confirmTextStaging);

              setIsRunning(true);

              await confirm.onClick(e);

              setIsRunning(false);
            }
          }}
          variant="contained"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Confirm.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  confirm: PropTypes.shape().isRequired,
  cancel: PropTypes.shape().isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  zIndex: PropTypes.number,
};

Confirm.defaultProps = {
  onClose: null,
  zIndex: 1501,
};

export default Confirm;
