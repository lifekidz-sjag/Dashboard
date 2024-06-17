import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";

import Close from "./GoogleIcons/Close";

const Popup = props => {
  const {
    popupButton,
    children = null,
    title,
    popup,
    cancel,
    isOpen,
    onClose = null,
    type = null,
    zIndex = 2002,
  } = props;
  const headerWithBorder = {
    borderBottom: "1px solid #E8E8E8",
  };
  const headerWithoutBorder = {
    borderBottom: "0px solid #E8E8E8",
  };
  const contentWithoutSpacing = {
    padding: "0",
  };
  const contentWithSpacing = {
    padding: "0 36px 20px 36px",
  };

  const contentWithFullSpacing = {
    padding: "0px 24px 16px 24px",
  };

  const getWidth = widthType => {
    switch (widthType) {
      case "OTPLayout":
        return "xs"; // 0px
      case "AddMedia":
        return "sm"; // 600px
      default:
        return "xl"; // 1530px
    }
  };
  return (
    <Box>
      <Dialog
        open={isOpen}
        onClose={onClose}
        disableEscapeKeyDown
        onBackdropClick={() => {}}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { background: "white" } }}
        sx={{ zIndex }}
      >
        {(type !== "OTPLayout" || type !== "AddMedia") && (
          <DialogTitle
            className="popup"
            style={
              type === "headerBorder" ? headerWithBorder : headerWithoutBorder
            }
          >
            <Box
              sx={{
                display: " flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {title}
              <Box
                sx={{
                  display: " flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{ marginRight: "-16px", marginLeft: "16px" }}
                  aria-label="close"
                  onClick={e => {
                    if (cancel.onClick) {
                      cancel.onClick(e);
                    }
                  }}
                >
                  <Close color="inherit" />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
        )}

        <DialogContent
          sx={{
            padding: "0px 0px 16px !important",
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
          }}
          style={contentWithFullSpacing}
        >
          {children}
        </DialogContent>
        <DialogActions
          sx={{
            display:
              popup.position && popup.position === "bottom" ? "flex" : "none",
            padding: "24px",
          }}
        >
          <Button
            onClick={e => {
              if (cancel.onClick) {
                cancel.onClick(e);
              }
            }}
            variant="text"
            style={{ borderRadius: "20px" }}
          >
            {cancel.text}
          </Button>
          <Button
            className="XyanButton"
            onClick={() => {
              popup.onClick();
            }}
            variant="contained"
            style={{ borderRadius: "20px" }}
            disabled={popupButton}
          >
            {popup.text}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  /* eslint-enable */
};

Popup.propTypes = {
  popupButton: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  popup: PropTypes.shape().isRequired,
  cancel: PropTypes.shape().isRequired,
  children: PropTypes.shape(),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  type: PropTypes.string,
  zIndex: PropTypes.number,
};

export default Popup;
