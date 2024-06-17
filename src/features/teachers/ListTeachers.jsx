import {
  Box,
  Divider,
  IconButton,
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
import ArrowUpward from "../../components/GoogleIcons/ArrowUpward";
import Delete from "../../components/GoogleIcons/Delete";
import EditNote from "../../components/GoogleIcons/EditNote";

const nameWidth = "2";
const phoneWidth = "1";
const classWidth = "2";

const lastModifiedWidth = "0 0 210px";
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

const ListTeachers = ({
  user,
  newItemAnimation,
  className,
  nodeRefFunc,
  list,
  classes,
  paginationComponent,
  onSort,
  sort,
  lastClicked,
  onUpdate,
  onDelete,
  searchStatus,
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
    if (user.role === "superadmin" && id !== user.id) {
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
    }

    return menuItems;
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
          <Typography variant="body1">{data.name}</Typography>
          <Typography
            variant="body1"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Phone: <b>{data.phone}</b>, Class:{" "}
            <b>
              {classes &&
                classes.data &&
                classes.data.filter(c => {
                  return c.id === data.class;
                })[0].name}
            </b>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >{`Last updated ${date}`}</Typography>
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
                    <Typography variant="body1">{item.name}</Typography>
                  </Box>
                </Box>
              </CustomizedListItemText>
            </CustomizedListItemButton>

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
                      menuItems={dropdownItems(item.id, item.name)}
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
                {/* Teacher Name */}
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
                      <Typography variant="body1">{item.name}</Typography>
                    </Box>
                  </Box>
                </CustomizedListItemText>

                {/* Teacher Phone */}
                <CustomizedListItemText
                  disableTypography
                  sx={{
                    flex: phoneWidth,
                    display: { xs: "none", md: "block" },
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
                    <Typography variant="body1">{item.phone}</Typography>
                  </Box>
                </CustomizedListItemText>

                {/* Teacher Phone */}
                <CustomizedListItemText
                  disableTypography
                  sx={{
                    flex: classWidth,
                    display: { xs: "none", md: "block" },
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
                      {classes &&
                        classes.data &&
                        classes.data.filter(c => {
                          return c.id === item.class;
                        })[0].name}
                    </Typography>
                  </Box>
                </CustomizedListItemText>

                {/* Last Modified */}
                <CustomizedListItemText
                  sx={{
                    flex: lastModifiedWidth,
                    display: { xs: "none", lg: "block" },
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

                {/* Lock & More action */}
                <CustomizedListItemText
                  disableTypography
                  sx={{
                    flex: moreActionWidth,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  <Box>
                    <ActionDropdown
                      menuItems={dropdownItems(item.id, item.name)}
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
                        <Box
                          role="button"
                          onClick={() => {
                            if (searchStatus === "none") {
                              onSort("name");
                            }
                          }}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography variant="body1">Name</Typography>
                          {searchStatus === "none" && (
                            <IconButton
                              onClick={() => {
                                onSort("name");
                              }}
                              sx={{ marginLeft: "8px" }}
                            >
                              <ArrowUpward
                                color="inherit"
                                className={`sort-icon ${
                                  sort.name === 1 ? "upward" : "downward"
                                }`}
                              />
                            </IconButton>
                          )}
                        </Box>
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
                    {/* Teacher Name */}
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
                      <Box
                        role="button"
                        onClick={() => {
                          if (searchStatus === "none") {
                            onSort("name");
                          }
                        }}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body1">Name</Typography>
                        {searchStatus === "none" && (
                          <IconButton
                            onClick={() => {
                              onSort("name");
                            }}
                            sx={{ marginLeft: "8px" }}
                          >
                            <ArrowUpward
                              color="inherit"
                              className={`sort-icon ${
                                sort.name === 1 ? "upward" : "downward"
                              }`}
                              sx={{
                                display: lastClicked.name ? "block" : "none",
                              }}
                            />
                          </IconButton>
                        )}
                      </Box>
                    </CustomizedListItemText>
                    <CustomizedDivider />
                    {/* Teacher Phone */}
                    <CustomizedListItemText
                      disableTypography
                      sx={{
                        flex: phoneWidth,
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
                      <Typography variant="body1">Phone</Typography>
                    </CustomizedListItemText>
                    <CustomizedDivider />

                    {/* Teacher Class */}
                    <CustomizedListItemText
                      disableTypography
                      sx={{
                        flex: classWidth,
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
                      <Typography variant="body1">Class</Typography>
                    </CustomizedListItemText>
                    <CustomizedDivider />

                    <CustomizedListItemText
                      sx={{
                        flex: lastModifiedWidth,
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
                      <Box
                        role="button"
                        onClick={() => {
                          if (searchStatus === "none") {
                            onSort("updatedAt");
                          }
                        }}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body1">Last Modified</Typography>
                        {searchStatus === "none" && (
                          <IconButton
                            onClick={() => {
                              onSort("updatedAt");
                            }}
                            sx={{ marginLeft: "8px" }}
                          >
                            <ArrowUpward
                              color="inherit"
                              className={`sort-icon ${
                                sort.updatedAt === 1 ? "upward" : "downward"
                              }`}
                              sx={{
                                display: lastClicked.updatedAt
                                  ? "block"
                                  : "none",
                              }}
                            />
                          </IconButton>
                        )}
                      </Box>
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

ListTeachers.propTypes = {
  user: PropTypes.shape().isRequired,
  newItemAnimation: PropTypes.shape().isRequired,
  className: PropTypes.func.isRequired,
  nodeRefFunc: PropTypes.func.isRequired,
  list: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  classes: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  paginationComponent: PropTypes.element.isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.shape().isRequired,
  lastClicked: PropTypes.shape().isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  searchStatus: PropTypes.string.isRequired,
};

export default ListTeachers;
