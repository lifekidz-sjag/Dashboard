import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import * as yup from "yup";

import formBg from "../assets/form-bg.png";
import BlankImage from "../assets/sjag_blank.gif";
import ActionDropdown from "../components/ActionDropdown";
import { FormTextField } from "../components/FormInput";
import ArrowBack from "../components/GoogleIcons/ArrowBack";
import ArrowUpward from "../components/GoogleIcons/ArrowUpward";
import Delete from "../components/GoogleIcons/Delete";
import EditNote from "../components/GoogleIcons/EditNote";
import useClasses from "../services/classes";

const nameWidth = "0 0 210px";
const descriptionWidth = "1";
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

const Classes = () => { 
  // Common page setup
  const { loader, sidebar, snackbar, confirm, setActionBar, paging } =
    useOutletContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Page listing setup
  const [list, setList] = useState([]);
  const defaultSortState = {
    name: -1,
  };
  const [sort, setSort] = useState(defaultSortState);

  const defaultLastClickedState = {
    name: false,
  };
  const [lastClicked, setLastClicked] = useState({
    name: true,
  });

  // API Definition
  const {
    fetch: fetchClasses,
    get: getClass,
    post: postClass,
    put: putClass,
    del: delClass,
  } = useClasses();
  const [
    { data: fetchClassesData, error: fetchClassesError },
    fetchClassesExecute,
  ] = fetchClasses;
  const [{ data: getClassData, error: getClassError }, getClassExecute] =
    getClass;
  const [{ data: postClassData, error: postClassError }, postClassExecute] =
    postClass;
  const [{ data: putClassData, error: putClassError }, putClassExecute] =
    putClass;
  const [{ data: delClassData, error: delClassError }, delClassExecute] =
    delClass;

  const [searchStatus, setSearchStatus] = useState("none");
  const [action, setAction] = useState("");

  const { paginationComponent } =
    list &&
    fetchClassesExecute &&
    paging(list, fetchClassesExecute, searchStatus);

  const handleSort = param => {
    let newState;
    let newStatus;

    if (lastClicked[param]) {
      if (sort[param] === 1) {
        newState = -1;
        newStatus = `-${param}`;
      } else {
        newState = 1;
        newStatus = param;
      }
    } else {
      newState = sort[param];
      newStatus = newState === -1 ? `-${param}` : param;
    }

    setLastClicked(() => {
      return {
        ...defaultLastClickedState,
        [param]: true,
      };
    });
    setSort(() => {
      return {
        ...defaultSortState,
        [param]: newState,
      };
    });
    loader.start();
    const params = {
      sort: newStatus,
      "page[size]": 10,
    };

    fetchClassesExecute({
      params,
    });
  };

  // React Hook Form Set Up

  const createClassSchema = yup.object({
    name: yup.string().required("Please enter name of the class"),
    description: yup.string().required("Please enter description of the class"),
  });

  const updateClassSchema = yup.object({
    name: yup.string().required("Please enter name of the class"),
    description: yup.string().required("Please enter description of the class"),
  });

  const {
    control: controlCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetAdd,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: yupResolver(createClassSchema),
  });

  const {
    control: controlUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      description: "",
    },
    resolver: yupResolver(updateClassSchema),
  });

  const createAPICall = async data => {
    setAction("add");
    loader.start();
    postClassExecute(data);
  };
  const updateAPICall = async (data, id) => {
    const modifiedData = data;
    delete modifiedData.id;
    setAction("update");

    loader.start();
    putClassExecute(id, modifiedData);
  };

  const sideCreate = dependencies => {
    return (
      <Box
        role="presentation"
        style={{
          backgroundColor: "white",
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmitCreate(createAPICall)}
        >
          <Box
            sx={{
              flex: "1 1 auto",
              minHeight: "100%",
              padding: "24px",
            }}
          >
            {/* Top Bar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <IconButton onClick={sidebar.close}>
                    <ArrowBack color="inherit" />
                  </IconButton>
                </Box>
                <Box sx={{ marginLeft: "8px" }}>
                  <Typography variant="subtitle1">Create New Class</Typography>
                </Box>
              </Box>
            </Box>

            {/* Form Fields */}
            <Box sx={{ padding: "8px" }}>
              <Grid container alignItems="center">
                <Grid item xs={12} sx={{ marginTop: "30px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="name"
                        label="Name"
                        control={controlCreate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="description"
                        label="description"
                        control={controlCreate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              width: "100%",
              bottom: { xs: "75px", md: "0px" },
              right: "0px",
              background: "white",
              zIndex: 1,
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {!isSmallScreen && (
              <Box component="img" src={formBg} sx={{ width: "100%" }} />
            )}

            <Box
              sx={{
                padding: "16px 24px 24px 24px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Stack spacing={5} direction="row">
                <Button
                  variant="text"
                  size="large"
                  style={{
                    borderRadius: "100px",
                  }}
                  onClick={sidebar.close}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  style={{
                    borderRadius: "100px",
                  }}
                >
                  Create
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const sideUpdate = dependencies => {
    return (
      <Box
        role="presentation"
        style={{
          backgroundColor: "white",
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmitUpdate(data => {
            updateAPICall(data, dependencies.id);
          })}
        >
          <Box
            sx={{
              flex: "1 1 auto",
              minHeight: "100%",
              padding: "24px",
            }}
          >
            {/* Top Bar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <IconButton onClick={sidebar.close}>
                    <ArrowBack color="inherit" />
                  </IconButton>
                </Box>
                <Box sx={{ marginLeft: "8px" }}>
                  <Typography variant="subtitle1">Update Class</Typography>
                </Box>
              </Box>
            </Box>

            {/* Form Fields */}
            <Box sx={{ padding: "8px" }}>
              <Grid container alignItems="center">
                <Grid item xs={12} sx={{ marginTop: "30px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="name"
                        label="Name"
                        control={controlUpdate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="description"
                        label="Description"
                        control={controlUpdate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: "0px",
              left: "0px",
              right: "0px",
            }}
          >
            {!isSmallScreen && (
              <Box component="img" src={formBg} sx={{ width: "100%" }} />
            )}

            <Box
              sx={{
                padding: "16px 24px 24px 24px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Stack spacing={5} direction="row">
                <Button
                  className="XyanButton"
                  variant="text"
                  size="large"
                  style={{
                    borderRadius: "100px",
                  }}
                  onClick={sidebar.close}
                >
                  Cancel
                </Button>
                <Button
                  className="XyanButton"
                  variant="contained"
                  size="large"
                  type="submit"
                  style={{
                    borderRadius: "100px",
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  // Action Dropdown set up
  const dropdownItems = id => {
    const menuItems = [
      {
        text: "Manage",
        icon: (
          <EditNote
            className="xtopia-menu-icon"
            sx={{ width: "24px", height: "24px" }}
          />
        ),
        action: e => {
          getClassExecute(id);
          sidebar.setSidebar(prev => {
            return {
              ...prev,
              dependencies: {
                id,
              },
              sidebar: sideUpdate,
            };
          });
          sidebar.open(e);
        },
      },

      {
        text: "Remove",
        icon: (
          <Delete
            className="xtopia-menu-icon"
            sx={{ width: "24px", height: "24px" }}
          />
        ),
        action: () => {
          confirm.open(
            "Delete Class",
            `Are you sure you want detele this class?`,
            {
              text: "Delete",
              onClick: async () => {
                setAction("delete");
                confirm.close();
                loader.start();
                await delClassExecute(id);
              },
            },
            {
              text: "Cancel",
            },
          );
        },
      },
    ];

    return menuItems;
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
                      menuItems={dropdownItems()}
                      iconOrientation="horizontal"
                      data={item}
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
                      <Typography variant="body1">{item.name}</Typography>
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
                    <Typography variant="body1">{item.description}</Typography>
                  </Box>
                </CustomizedListItemText>

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
                  sx={{ flex: moreActionWidth }}
                >
                  <Box>
                    <ActionDropdown
                      menuItems={dropdownItems(item.id)}
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

  // Page load actions
  useEffect(() => {
    fetchClassesExecute();
    loader.start();
    setActionBar({
      title: {
        enabled: true,
        display: true,
        name: "Classes",
      },
      fab: {
        enabled: true,
        display: true,
        action: event => {
          sidebar.setSidebar({
            isOpen: sidebar.isOpen,
            sidebar: sideCreate,
          });
          sidebar.open(event);
        },
      },
      search: {
        enabled: true,
        display: true,
        isOpen: false,
        searchResult: "none",
        renderContent: () => {},
        searchFunc: () => {},
        submitFunc: () => {},
        backFunc: () => {},
      },
    });
  }, []);

  useEffect(() => {
    if (fetchClassesData && fetchClassesData.data) {
      setList(fetchClassesData);
      loader.end();
    }
  }, [fetchClassesData]);

  useEffect(() => {
    if (loader.loading === 0) {
      if (action === "addComplete") {
        snackbar.open("New class added", false);
      } else if (action === "updateComplete") {
        snackbar.open("Class updated", false);
      } else if (action === "deleteComplete") {
        snackbar.open("Class deleted", false);
      }

      setAction("");
    }
  }, [loader.loading]);

  useEffect(() => {
    if (getClassData) {
      resetUpdate({
        id: getClassData.id,
        name: getClassData.name,
        description: getClassData.description,
      });
      sidebar.setSidebar(prev => {
        return {
          ...prev,
          dependencies: {
            id: getClassData.id,
          },
          sidebar: sideUpdate,
        };
      });
      sidebar.open();
    }
  }, [getClassData]);

  useEffect(() => {
    if (postClassData) {
      sidebar.close();
      setAction("addComplete");
      fetchClassesExecute();
    }
  }, [postClassData]);

  useEffect(() => {
    if (putClassData) {
      sidebar.close();
      setAction("updateComplete");
      fetchClassesExecute();
    }
  }, [putClassData]);

  useEffect(() => {
    if (delClassData) {
      sidebar.close();
      setAction("deleteComplete");
      fetchClassesExecute();
    }
  }, [delClassData]);

  useEffect(() => {
    if (fetchClassesError) {
      switch (fetchClassesError.response.data) {
        default:
          break;
      }
    }
  }, [fetchClassesError]);

  useEffect(() => {
    if (getClassError) {
      loader.end();
      switch (getClassError.response.data) {
        case "INVALID_ID":
          snackbar.open("The class is unavailable", true);
          sidebar.close();
          fetchClassesExecute();
          break;

        default:
          break;
      }
    }
  }, [getClassError]);

  useEffect(() => {
    if (postClassError) {
      loader.end();

      switch (postClassError.response.data) {
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "DUPLICATED_CLASS":
          snackbar.open(
            "Unique class name is required. Please rephrase your class",
            true,
          );
          break;
        case "UNAUTHORIZED_ACTION":
          snackbar.open("Please login again to proceed", true);
          break;
        default:
          break;
      }
    }
  }, [postClassError]);

  useEffect(() => {
    if (putClassError) {
      loader.end();

      switch (putClassError.response.data) {
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "DUPLICATED_CLASS":
          snackbar.open(
            "Unique class name is required. Please rephrase your class",
            true,
          );
          break;
        case "INVALID_ID":
          snackbar.open("The class is unavailable", true);
          sidebar.close();
          fetchClassesError();
          break;
        case "UNAUTHORIZED_ACTION":
          snackbar.open("Please login again to proceed", true);
          break;

        default:
          break;
      }
    }
  }, [putClassError]);

  useEffect(() => {
    if (delClassError) {
      loader.end();

      switch (delClassError.response.data) {
        case "INVALID_ID":
          snackbar.open("The class is unavailable", true);
          confirm.close();
          fetchClassesError();
          break;
        case "UNAUTHORIZED_ACTION":
          snackbar.open("Please login again to proceed", true);
          break;

        default:
          break;
      }
    }
  }, [delClassError]);

  useEffect(() => {
    if (!sidebar.isOpen) {
      resetAdd({
        name: "",
        description: "",
      });
      resetUpdate({
        id: "",
        name: "",
        description: "",
      });
    }
  }, [sidebar.isOpen]);

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
                        sx={{ flex: nameWidth }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "500" }}>
                          Name
                        </Typography>
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
                      <Box
                        role="button"
                        onClick={() => {
                          handleSort("name");
                        }}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body1">Name</Typography>
                        <IconButton
                          onClick={() => {
                            handleSort("name");
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
                              width: "15px",
                              height: "15px",
                            }}
                          />
                        </IconButton>
                      </Box>
                    </CustomizedListItemText>
                    <CustomizedDivider />
                    {/* Class Description */}
                    <CustomizedListItemText
                      disableTypography
                      sx={{
                        flex: descriptionWidth,
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
                        display: { xs: "none", lg: "block" },
                      }}
                    >
                      <Typography variant="body1">Last Modified</Typography>
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

export default Classes;
