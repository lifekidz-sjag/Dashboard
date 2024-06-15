import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

import MoreHoriz from "./GoogleIcons/MoreHoriz";

const ActionDropdown = props => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const initialState = {
    anchorEl: null,
  };

  const [values, setValues] = useState(initialState);
  const [mobileSlideUp, setMobileSlideUp] = useState(false);

  const {
    menuItems,
    data = {},
    mobileSlideOut = false,
    selectedItems = 0,
    zIndex = null,
    isLongPressMode = false,
  } = props;

  const handleClick = event => {
    if (selectedItems > 0) {
      return;
    }
    setValues({
      anchorEl: event.target,
    });
  };

  const handleClickMobile = () => {
    if (!isLongPressMode) {
      setMobileSlideUp(true);
    }
  };
  const handleClose = (e, menuItem) => {
    if (isSmallScreen) {
      setMobileSlideUp(false);
    } else {
      setValues({
        anchorEl: null,
      });
    }

    if (menuItem.action) {
      menuItem.action(e); // Pass params to the action function
    }
  };
  const date =
    Object.keys(data).length > 0 &&
    new Date(data.updatedAt).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  const renderMenuDropdown = () => {
    if (Object.keys(data).length > 0) {
      return (
        <Box>
          <IconButton onClick={handleClickMobile}>
            <MoreHoriz className="xtopia-small-icon" />
          </IconButton>
          <Drawer
            anchor="bottom"
            open={mobileSlideUp}
            sx={{
              zIndex: "1501",
              "& .MuiDrawer-paper": {
                borderRadius: "16px 16px 0px 0px",
                background: "#fff",
              },
            }}
            onClose={() => {
              setMobileSlideUp(false);
            }}
          >
            <Box
              sx={{
                padding: "24px 16px 16px 16px",
                borderBottom: "1px solid rgba(43, 43, 43, 0.38)",
              }}
            >
              <Typography variant="body1">{data.name}</Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
              >{`Last updated ${date}`}</Typography>
            </Box>
            <List>
              {menuItems.map(menuItem => {
                return (
                  <ListItem disablePadding key={menuItem.text}>
                    <ListItemButton
                      onClick={e => {
                        handleClose(e, menuItem);
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "24px", marginRight: "8px" }}
                      >
                        {menuItem.icon}
                      </ListItemIcon>
                      <ListItemText disableTypography>
                        <Typography variant="body2">{menuItem.text}</Typography>
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Drawer>
        </Box>
      );
    }

    if (mobileSlideOut) {
      return (
        <Box>
          <IconButton onClick={handleClickMobile}>
            <MoreHoriz className="xtopia-small-icon" />
          </IconButton>
          <Drawer
            anchor="bottom"
            open={mobileSlideUp}
            sx={{
              zIndex: "2002",
              "& .MuiDrawer-paper": {
                borderRadius: "16px 16px 0px 0px",
                background: "#fff",
              },
            }}
            onClose={() => {
              setMobileSlideUp(false);
            }}
          >
            <Box
              sx={{
                padding: "24px 16px 16px 16px",
                borderBottom: "1px solid rgba(43, 43, 43, 0.38)",
              }}
            >
              <Typography variant="body1">
                {selectedItems} items selected
              </Typography>
            </Box>
            <List>
              {menuItems.map(menuItem => {
                return (
                  <ListItem disablePadding key={menuItem.text}>
                    <ListItemButton
                      onClick={e => {
                        handleClose(e, menuItem);
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "24px", marginRight: "8px" }}
                      >
                        {menuItem.icon}
                      </ListItemIcon>
                      <ListItemText disableTypography>
                        <Typography variant="body2">{menuItem.text}</Typography>
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Drawer>
        </Box>
      );
    }
    return (
      <Box>
        <IconButton onClick={handleClick}>
          <MoreHoriz className="xtopia-small-icon" />
        </IconButton>
        <Menu
          // TODO
          disableScrollLock
          anchorEl={values.anchorEl}
          open={Boolean(values.anchorEl)}
          onClose={() =>
            setValues({
              anchorEl: null,
            })
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          style={zIndex && { zIndex }}
        >
          {menuItems.map(menuItem => {
            return (
              <MenuItem
                key={menuItem.text}
                onClick={e => {
                  handleClose(e, menuItem);
                }}
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText disableTypography>{menuItem.text}</ListItemText>
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
    );
  };

  return isSmallScreen ? (
    renderMenuDropdown()
  ) : (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreHoriz className="xtopia-small-icon" />
      </IconButton>
      <Menu
        // TODO
        disableScrollLock
        anchorEl={values.anchorEl}
        open={Boolean(values.anchorEl)}
        onClose={() =>
          setValues({
            anchorEl: null,
          })
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {menuItems.map(menuItem => {
          return (
            <MenuItem
              key={menuItem.text}
              onClick={e => {
                handleClose(e, menuItem);
              }}
            >
              <ListItemIcon>{menuItem.icon}</ListItemIcon>
              <ListItemText disableTypography>{menuItem.text}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

ActionDropdown.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      action: PropTypes.func.isRequired,
    }),
  ).isRequired,
  data: PropTypes.shape(),
  mobileSlideOut: PropTypes.bool,
  selectedItems: PropTypes.number,
  zIndex: PropTypes.string,
  isLongPressMode: PropTypes.bool,
};

export default ActionDropdown;
