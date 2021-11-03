import {
  Typography,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import Snackbar from "@mui/material/Snackbar";

import { HomeContainer } from "./styles";
import { OrderService } from "src/services";
import { SelectComponent } from "src/components/SelectComponent";
import { types, stations, prices } from "src/constants";
import { Alert } from "src/components/Alert";

const steps = [
  {
    label: "Select pump station",
    type: types[0],
  },
  {
    label: "Select price",
    type: types[1],
  },
];

const HomePage: NextPage = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedStation, setSelectedStation] = React.useState("");
  const [selectedPrice, setSelectedPriceStation] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState<string>("");
  const [snackbarText, setSnackBarText] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = async () => {
    const body = {
      station: selectedStation,
      price: selectedPrice,
    };

    try {
      setIsLoading(true);
      const response = await OrderService.PostOrder(body);

      if (!response) {
        setSeverity("error");
        return handleClick();
      }

      setSeverity("success");
      setSnackBarText("Order successfully created.");
      setIsLoading(false);

      handleClick();
      return router.push("/order");
    } catch (error) {
      setSeverity("error");
      setSnackBarText("Failed to create order. Please try again later.");
      setIsLoading(false);

      return handleClick();
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSelectComponent = (type: string) => {
    if (type == types[0]) {
      return (
        <SelectComponent
          items={stations}
          prefix=""
          state={selectedStation}
          setState={(value) => setSelectedStation(value)}
        />
      );
    }

    return (
      <SelectComponent
        items={prices}
        prefix="MYR "
        state={selectedPrice}
        setState={(value) => setSelectedPriceStation(value)}
      />
    );
  };

  const isDisabled = (type: string): boolean => {
    if (type == types[0]) {
      return selectedStation == "";
    }

    return selectedPrice == "";
  };

  return (
    <HomeContainer
      container
      alignContent="center"
      justifyContent="center"
      height="100vh"
    >
      <Box p={3} className="box">
        <Typography className="title" variant="h4">
          Welcome To Our New Pump Station System
        </Typography>

        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          className="stepper"
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 1 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {handleSelectComponent(step.type)}
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={isDisabled(step.type)}
                    >
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Grid container>
              <Button
                variant="contained"
                sx={{ mt: 1, mr: 1 }}
                onClick={() => handleSubmit()}
                disabled={isLoading}
              >
                {isLoading ? "submitting" : "create order"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ mt: 1, mr: 1 }}
              >
                Reset
              </Button>
            </Grid>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </HomeContainer>
  );
};

export default HomePage;
