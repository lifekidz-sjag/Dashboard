import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import * as yup from "yup";

import { FormTextAreaField, FormTextField } from "../../components/FormInput";
import ArrowBack from "../../components/GoogleIcons/ArrowBack";
import useNotifications from "../../services/notifications";

const useAddNotification = ({
  loader,
  sidebar,
  snackbar,
  setNewItemAnimation,
  fetchList,
  sharedFunction,
}) => {
  // API service
  const { post: postNotifications } = useNotifications();
  const [
    { data: postNotificationsData, error: postNotificationsError },
    postNotificationsExecute,
  ] = postNotifications;

  // React Hook Form Set Up

  const createNotificationSchema = yup.object({
    title: yup.string().required("Please enter title of the notification"),
    description: yup
      .string()
      .required("Please enter description of the notification"),
  });

  const {
    control: controlCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetAdd,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: yupResolver(createNotificationSchema),
  });

  const handleAdd = async data => {
    loader.start();
    postNotificationsExecute(data);
  };

  const sideCreate = () => {
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
          onSubmit={handleSubmitCreate(handleAdd)}
          sx={{
            overflow: "auto",
            maxHeight: { xs: "80vh", md: "100vh" },
            paddingBottom: "80px",
          }}
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
                  <Typography variant="subtitle1">
                    Create New Notification
                  </Typography>
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
                        name="title"
                        label="Title of Notification"
                        control={controlCreate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextAreaField
                        required
                        name="description"
                        label="Description of Notification (Keep it short)"
                        control={controlCreate}
                        rows={3}
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
    );
  };

  const onAdd = () => {
    sharedFunction.setAction("Add");
    resetAdd();
    sidebar.setSidebar(prevState => {
      return {
        ...prevState,
        dependencies: {
          ...prevState.dependencies,
        },
        sidebar: sideCreate,
      };
    });
    sidebar.open();
  };

  // Side Effects
  useEffect(() => {
    if (postNotificationsData) {
      setNewItemAnimation(prevState => {
        return {
          ...prevState,
          newItem: postNotificationsData.id,
          callbackFunc: () => {
            snackbar.open("Notification created successfully.", false);
            resetAdd();
            sharedFunction.setAction("View");
          },
        };
      });
      fetchList({ params: { sort: "status" } });

      sidebar.close();
    }

    return () => {};
  }, [postNotificationsData]);

  // Side Effects
  useEffect(() => {
    if (postNotificationsError) {
      loader.end();

      switch (postNotificationsError.response.data) {
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "UNAUTHORIZED_ACTION":
          snackbar.open("Please login again to proceed", true);
          break;
        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [postNotificationsError]);

  return {
    onAdd,
  };
};

useAddNotification.propTypes = {};

export default useAddNotification;
