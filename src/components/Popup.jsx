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
    children,
    title,
    popup,
    cancel,
    isOpen,
    onClose,
    type,
    zIndex,
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
  /* eslint-disable */
  return (
    <Box>
      <Dialog
        open={isOpen}
        onClose={onClose}
        disableEscapeKeyDown
        onBackdropClick={() => {}}
        fullWidth
        maxWidth={getWidth(type)}
        PaperProps={{ sx: {  background: "white" } }}
        sx={{ zIndex: zIndex }}
      >
        {(type !== "OTPLayout" || type !== "AddMedia")  && (
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
                <Button
                  className="XyanButton"
                  onClick={null}
                  variant="contained"
                  style={{
                    display:
                      popup.position && popup.position !== "bottom"
                        ? "block"
                        : "none",
                  }}
                  sx={{ borderRadius: "20px", fontWeight: "600" }}
                >
                  {popup.text}
                </Button>
                <IconButton
                  sx={{ marginRight: "-16px", marginLeft: "16px" }}
                  aria-label="close"
                  onClick={e => {
                    if (cancel.onClick) {
                      cancel.onClick(e);
                    }
                  }}
                >
                  <Close
                    sx={{ fontSize: "30px", strokeWidth: 1, stroke: "#ffffff" }}
                  />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
        )}

        <DialogContent
          sx={{
            padding: "0px 40px",
            display: "flex",
            alignItems: "start",
          }}
          style={
            type === "headerBorder"
              ? contentWithoutSpacing
              : type === "OTPLayout"
                ? contentWithFullSpacing
                : contentWithSpacing
          }
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

Popup.defaultProps = {
  onClose: null,
  children: null,
  type: null,
  zIndex: 2002,
};

export default Popup;
