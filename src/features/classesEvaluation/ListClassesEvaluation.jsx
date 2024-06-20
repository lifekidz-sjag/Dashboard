import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

import BlankImage from "../../assets/sjag_blank.gif";
import ActionDropdown from "../../components/ActionDropdown";
import Delete from "../../components/GoogleIcons/Delete";
import EditNote from "../../components/GoogleIcons/EditNote";

const nameWidth = "0 0 210px";
const descriptionWidth = "1";
const lastModifiedWidth = "0 0 210px";
const statusWidth = "0 0 80px";
const moreActionWidth = "0 0 40px";

const CustomizedListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== "open",
})(() => ({
  cursor: "default",
}));

const CustomizedListItemText = styled(
  ({ children, sx }) => {
    return (
      <ListItemText disableTypography sx={{ ...sx, marginX: "16px" }}>
        {children}
      </ListItemText>
    );
  },
  {
    shouldForwardProp: prop => prop !== "open",
  },
)(() => ({}));

const CustomizedDivider = styled(() => (
  <Divider orientation="vertical" variant="middle" flexItem />
))(() => ({}));

const ListClassesEvaluation = ({
  newItemAnimation,
  className,
  nodeRefFunc,
  list,
  paginationComponent,
  onUpdate,
  onDelete,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Action Dropdown set up
  const dropdownItems = (id, name) => {
    const menuItems = [
      {
        text: "Manage",
        icon: (
          <EditNote
            className="xtopia-menu-icon"
            sx={{ width: "24px", height: "24px" }}
          />
        ),
        action: () => {
          onUpdate(id);
        },
      },
    ];
    menuItems.push({
      text: "Remove",
      icon: (
        <Delete
          className="xtopia-menu-icon"
          sx={{ width: "24px", height: "24px" }}
        />
      ),
      action: () => {
        onDelete({ id, name });
      },
    });

    return menuItems;
  };
  const renderStatusChip = status => {
    let statusText = "";
    let backgroundColor = "";
    let color = "";
    switch (status) {
      case "active":
        statusText = "Active";
        backgroundColor = theme.palette.success.main;
        color = theme.palette.secondary.contrastText;
        break;
      case "inactive":
        statusText = "Inactive";
        backgroundColor = theme.palette.grey["300"];
        color = theme.palette.text.primary;
        break;
      default:
        statusText = "NONE";
        break;
    }
    return isSmallScreen ? (
      <Box
        sx={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: backgroundColor,
        }}
      />
    ) : (
      <Chip
        label={statusText}
        sx={{
          backgroundColor,
          color,
          width: "auto",
          height: "24px",
          "& .MuiChip-label": {
            overflow: "unset !important",
            paddingX: "0px !important",
          },
          paddingX: "8px !important",
        }}
      />
    );
  };

  const renderMobileDropdownInfo = data => {
    if (data) {
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
      return (
        <>
          <Typography variant="body1">{data.criteriaName}</Typography>
          <Typography
            variant="body1"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Description: <b>{data.criteriaDescription}</b>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >{`Last Modified ${date}`}</Typography>
        </>
      );
    }
    return null;
  };

  const renderMobileList = () => {
    if (Array.isArray(list)) {
      return null;
    }
    return list && list.data.length > 0 ? (
      list.data.map((item, index) => {
        return (
          <ListItem
            key={item.id}
            ref={node => {
              nodeRefFunc(newItemAnimation.newItem === item.id, node);
            }}
            className={className(newItemAnimation.newItem === item.id)}
            disablePadding
            sx={{
              borderBottom:
                index === list.data.length - 1
                  ? "unset"
                  : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <CustomizedListItemButton
              dense
              disableRipple
              disableTouchRipple
              sx={{
                width: "100%",
                height: "60px",
                paddingLeft: "16px",
                paddingRight: "0px",
                "&.Mui-selected": {
                  backgroundColor: "#E9F2FF",
                },
              }}
            >
              {/* Class Name */}
              <CustomizedListItemText disableTypography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      wordBreak: "break-word",
                      WebkitLineClamp: "1",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    <Typography variant="body1">{item.criteriaName}</Typography>
                  </Box>
                </Box>
              </CustomizedListItemText>
            </CustomizedListItemButton>
            <CustomizedListItemText
              disableTypography
              sx={{
                display: "flex",
                flex: statusWidth,
                justifyContent: "center",
              }}
            >
              {renderStatusChip(item.status)}
            </CustomizedListItemText>
            {/* Lock & More action */}
            <CustomizedListItemButton
              dense
              disableRipple
              disableTouchRipple
              sx={{
                paddingX: "30px",
                height: "60px",
                "&.Mui-selected": {
                  backgroundColor: "#E9F2FF",
                },
              }}
            >
              <CustomizedListItemText disableTypography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <ActionDropdown
                      menuItems={dropdownItems(item.id, item.criteriaName)}
                      iconOrientation="horizontal"
                      data={item}
                      renderElement={() => {
                        return renderMobileDropdownInfo(item);
                      }}
                    />
                  </Box>
                </Box>
              </CustomizedListItemText>
            </CustomizedListItemButton>
          </ListItem>
        );
      })
    ) : (
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

  const renderDesktopList = () => {
    if (Array.isArray(list)) {
      return null;
    }

    return list.data.length > 0 ? (
      <>
        {list.data.map((item, index) => {
          return (
            <ListItem
              key={item.id}
              ref={node => {
                nodeRefFunc(newItemAnimation.newItem === item.id, node);
              }}
              className={className(newItemAnimation.newItem === item.id)}
              disablePadding
              sx={{
                borderBottom:
                  index === list.data.length - 1
                    ? "unset"
                    : "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <CustomizedListItemButton
                dense
                disableRipple
                disableTouchRipple
                sx={{
                  height: "60px",
                  "&.Mui-selected": {
                    backgroundColor: "#E9F2FF",
                  },
                  ":hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {/* Class Name */}
                <CustomizedListItemText
                  disableTypography
                  sx={{ flex: nameWidth }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        wordBreak: "break-word",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      <Typography variant="body1">
                        {item.criteriaName}
                      </Typography>
                    </Box>
                  </Box>
                </CustomizedListItemText>
                {/* Class Description */}
                <CustomizedListItemText
                  disableTypography
                  sx={{
                    flex: descriptionWidth,
                    display: { xs: "none", lg: "block" },
                  }}
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      wordBreak: "break-word",
                      WebkitLineClamp: "1",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    <Typography variant="body1">
                      {item.criteriaDescription}
                    </Typography>
                  </Box>
                </CustomizedListItemText>

                <CustomizedListItemText
                  sx={{
                    flex: lastModifiedWidth,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  <Typography variant="body1" sx={{ fontSize: "14px" }}>
                    {(() => {
                      const date = new Date(item.updatedAt);
                      return date.toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      });
                    })()}
                  </Typography>
                </CustomizedListItemText>
                {/* Status */}
                <CustomizedListItemText
                  disableTypography
                  sx={{
                    display: "flex",
                    flex: statusWidth,
                    justifyContent: "center",
                  }}
                >
                  {renderStatusChip(item.status)}
                </CustomizedListItemText>
                {/* Lock & More action */}
                <CustomizedListItemText
                  disableTypography
                  sx={{ flex: moreActionWidth }}
                >
                  <Box>
                    <ActionDropdown
                      menuItems={dropdownItems(item.id, item.criteriaName)}
                      iconOrientation="horizontal"
                    />
                  </Box>
                </CustomizedListItemText>
              </CustomizedListItemButton>
            </ListItem>
          );
        })}
        {paginationComponent}
      </>
    ) : (
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

  return (
    <Box>
      {(() => {
        if (list.data) {
          if (list.data.length > 0) {
            if (isSmallScreen) {
              return (
                <List
                  sx={{
                    width: "100%",
                    borderRadius: { xs: "24px 24px 0px 0px", md: "8px" },
                    backgroundColor: "background.paper",
                  }}
                >
                  {/* Header */}
                  <ListItem disablePadding>
                    <CustomizedListItemButton
                      dense
                      disableRipple
                      disableTouchRipple
                      // disable Hover on header
                      sx={{
                        ":hover": {
                          backgroundColor: "transparent",
                        },
                        paddingLeft: "16px",
                        paddingRight: "0px",
                      }}
                    >
                      <CustomizedListItemText
                        disableTypography
                        sx={{
                          flex: nameWidth,
                          cursor: "pointer",
                          ".downward": {
                            transform: "rotate(180deg)",
                          },
                          ".sort-icon": {
                            display: "block",
                            transition: "transform 0.3s ease-in-out",
                          },
                        }}
                      >
                        <Typography variant="body1">Name</Typography>
                      </CustomizedListItemText>
                    </CustomizedListItemButton>
                  </ListItem>
                  {renderMobileList()}
                  {paginationComponent}
                </List>
              );
            }
            return (
              <List
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "background.paper",
                }}
              >
                {/* Header */}
                <ListItem disablePadding>
                  <CustomizedListItemButton
                    dense
                    disableRipple
                    disableTouchRipple
                    // disable Hover on header
                    sx={{
                      ":hover": {
                        backgroundColor: "transparent",
                      },
                      minHeight: "50px",
                    }}
                  >
                    {/* Class name */}
                    <CustomizedListItemText
                      disableTypography
                      sx={{
                        flex: nameWidth,
                        cursor: "pointer",
                        ".downward": {
                          transform: "rotate(180deg)",
                        },
                        ":hover": {
                          ".sort-icon": {
                            display: "block",
                            transition: "transform 0.3s ease-in-out",
                          },
                        },
                      }}
                    >
                      <Typography variant="body1">Name</Typography>
                    </CustomizedListItemText>
                    <CustomizedDivider />
                    {/* Class Description */}
                    <CustomizedListItemText
                      disableTypography
                      sx={{
                        flex: descriptionWidth,
                        display: { xs: "none", lg: "block" },

                        cursor: "pointer",
                        ".downward": {
                          transform: "rotate(180deg)",
                        },
                        ":hover": {
                          ".sort-icon": {
                            display: "block",
                            transition: "transform 0.3s ease-in-out",
                          },
                        },
                      }}
                    >
                      <Typography variant="body1">Description</Typography>
                    </CustomizedListItemText>
                    <CustomizedDivider />

                    <CustomizedListItemText
                      sx={{
                        flex: lastModifiedWidth,
                        display: { xs: "none", md: "block" },
                        cursor: "pointer",
                        ".downward": {
                          transform: "rotate(180deg)",
                        },
                        ":hover": {
                          ".sort-icon": {
                            display: "block",
                            transition: "transform 0.3s ease-in-out",
                          },
                        },
                      }}
                    >
                      <Typography variant="body1">Last Modified</Typography>
                    </CustomizedListItemText>
                    <CustomizedDivider />
                    <CustomizedListItemText
                      sx={{
                        flex: statusWidth,
                        justifyContent: "center",
                        display: { xs: "none", md: "flex" },
                        cursor: "pointer",
                        ".downward": {
                          transform: "rotate(180deg)",
                        },
                        ":hover": {
                          ".sort-icon": {
                            display: "block",
                            transition: "transform 0.3s ease-in-out",
                          },
                        },
                      }}
                    >
                      <Typography variant="body1">Status</Typography>
                    </CustomizedListItemText>
                    <CustomizedDivider />
                    {/* Lock & More action */}
                    <CustomizedListItemText
                      disableTypography
                      sx={{ flex: moreActionWidth }}
                    />
                  </CustomizedListItemButton>
                </ListItem>

                {renderDesktopList()}
              </List>
            );
          }
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
        }
        return null;
      })()}
    </Box>
  );
};

ListClassesEvaluation.propTypes = {
  newItemAnimation: PropTypes.shape().isRequired,
  className: PropTypes.func.isRequired,
  nodeRefFunc: PropTypes.func.isRequired,
  list: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  paginationComponent: PropTypes.element.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ListClassesEvaluation;
