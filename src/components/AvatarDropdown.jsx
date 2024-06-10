/* eslint-disable import/no-cycle */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";

import { useAuth } from "../contexts/auth";

import AccountsIcon from "./GoogleIcons/Account";
import LogoutIcon from "./GoogleIcons/Logout";

const AvatarDropdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { SJAGLogout } = useAuth();

  const menuItems = [
    {
      id: "ce7f9d92-8c48-49e4-b3af-6305c427e893",
      name: "Profile",
      path: `/account/profile`,
      icon: <AccountsIcon />,
    },
    {
      id: "ce7f9d92-8c48-49e4-b3af-6305c427e898",
      name: "Logout",
      action: () => {
        SJAGLogout();
      },
      icon: <LogoutIcon />,
    },
  ];
  const initialState = {
    anchorEl: null,
  };

  const [values, setValues] = useState(initialState);

  const handleClick = event => {
    setValues({
      anchorEl: event.currentTarget,
    });
  };
  const handleClose = (e, menuItem) => {
    setValues({
      anchorEl: null,
    });

    if (menuItem.path) {
      navigate(menuItem.path);
    }

    if (menuItem.action) {
      menuItem.action();
    }
  };

  return (
    <Box>
      <Chip
        sx={{
          height: "40px",
          borderRadius: "40px",
          flexDirection: "row-reverse",
          padding: "12px",
          background: "transparent",
          border: `1px solid ${theme.palette.other.outlinedBorder}`,
          ":hover": {
            background: "rgba(0, 152, 234, 0.04)",
          },
          ".MuiChip-label": {
            fontSize: theme.typography.body2.fontSize,
            padding: "0px",
            overflow: "hidden",
            maxWidth: "8ch",
            whiteSpace: "nowrap",
            color: `${theme.palette.text.primary}`,
          },
          ".MuiAvatar-root": {
            marginLeft: "8px",
            marginRight: "0px",
          },
        }}
        onClick={handleClick}
        avatar={
          <Avatar
            sx={{
              color: "white !important",
              backgroundColor: user.colorProfile,
            }}
          >
            {user.username[0].toUpperCase()}
          </Avatar>
        }
        label={user.username}
      />
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
              key={menuItem.id}
              onClick={e => {
                handleClose(e, menuItem);
              }}
            >
              <ListItemIcon>{menuItem.icon}</ListItemIcon>
              <ListItemText disableTypography>{menuItem.name}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default AvatarDropdown;
