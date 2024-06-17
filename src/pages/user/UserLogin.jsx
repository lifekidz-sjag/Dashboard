import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { useRive, useStateMachineInput } from "rive-react";
import * as yup from "yup";

import { FormTextField } from "../../components/FormInput";
import ArrowBack from "../../components/GoogleIcons/ArrowBack";
import ArrowForward from "../../components/GoogleIcons/ArrowForward";
import School from "../../components/GoogleIcons/School";
import ShieldPerson from "../../components/GoogleIcons/ShieldPerson";
import useAuth from "../../contexts/auth/useAuth";

const UserLogin = () => {
  const [step, setStep] = useState(0);
  // INITAL PAGE SET UP
  const { loader } = useOutletContext();

  // FORM FIELDS SET UP
  // YUP Schema
  // 1. User Login Schema
  // 2. User OTP Schema
  const userLoginSchema = yup.object({
    name: yup.string().required("Please enter your name"),
    password: yup.string().required("Please enter your phone number"),
    role: yup.string(),
  });

  // React Hook Form Set Up
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      password: "",
      role: "",
    },
    resolver: yupResolver(userLoginSchema),
  });

  // API Setup
  const { SJAGLogin } = useAuth();
  const onSubmit = async data => {
    SJAGLogin({ name: data.name, password: data.password, role: data.role });
  };

  useEffect(() => {
    loader.end();
  }, []);

  const STATE_MACHINE_NAME = "State Machine 1";
  const { rive, RiveComponent } = useRive({
    src: "/Dashboard/login_screen_character.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
  });

  const stateSuccess = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "success",
  );
  const stateFail = useStateMachineInput(rive, STATE_MACHINE_NAME, "fail");
  const stateHandUp = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "hands_up",
  );

  const stateCheck = useStateMachineInput(rive, STATE_MACHINE_NAME, "Check");
  const stateLook = useStateMachineInput(rive, STATE_MACHINE_NAME, "Look");
  const setHandUp = handUp => {
    if (stateHandUp) {
      stateHandUp.value = handUp;
    }
  };

  const setCheck = check => {
    if (stateCheck) {
      stateCheck.value = check;
    }
  };

  const setLook = () => {
    if (!stateLook || !stateCheck || !setHandUp) {
      return;
    }
    setHandUp(false);
    setCheck(true);
    let nbChars = 0;
    if (watch("name")) {
      nbChars = parseFloat(watch("name").split("").length);
    }

    const ratio = nbChars / parseFloat(41);
    // console.log(`ratio ${ratio}`);

    const lookToSet = ratio * 100 - 25;
    // console.log(`lookToSet ${Math.round(lookToSet)}`);
    stateLook.value = Math.round(lookToSet);
  };

  useEffect(() => {
    setLook();
  }, [watch("name")]);

  const triggerSuccess = () => {
    if (stateSuccess) {
      stateSuccess.fire();
    }
  };
  const triggerFail = () => {
    if (stateFail) {
      stateFail.fire();
    }
  };

  return (
    <Box>
      <Box sx={{ padding: "32px 16px 16px 16px", position: "relative" }}>
        {step === 1 && (
          <IconButton
            sx={{ position: "absolute", top: "32px", left: "0px" }}
            onClick={() => {
              setStep(0);
            }}
          >
            <ArrowBack color="inherit" />
          </IconButton>
        )}

        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          Login to SJAG Lifekidz Attendance
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <RiveComponent
            style={{ width: "150px", height: "150px" }}
            src="/Dashboard/login_screen_character.riv"
          />
        </Box>
      </Box>
      {step === 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ShieldPerson fontSize="32px" color="white" />}
              onClick={() => {
                setStep(1);
                setValue("role", "admin");
              }}
            >
              Login as admin
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<School fontSize="32px" color="white" />}
              onClick={() => {
                setStep(1);
                setValue("role", "teacher");
              }}
            >
              Login as teacher
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormTextField
            required
            name="name"
            control={control}
            label="Name"
            sx={{ marginBottom: "24px" }}
          />
          <FormTextField
            required
            name="password"
            type="password"
            control={control}
            label="Phone Number"
            customOnChange={() => {
              setHandUp(true);
            }}
          />

          <Box
            sx={{
              marginTop: "32px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              endIcon={<ArrowForward />}
            >
              Login
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserLogin;
