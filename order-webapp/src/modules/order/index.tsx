import {
  Grid,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { IOrderObj } from "src/interfaces";
import { ORDER_STATE } from "src/enums";
import { OrderContainer } from "./styles";
import { OrderService } from "src/services";
import { useEffect, useState } from "react";
import useInterval from "src/hooks/useInterval";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Alert } from "src/components/Alert";

const OrderPage = (): JSX.Element => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrderObj[] | null>(null);
  const [showCheckStatus, setShowCheckStatus] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [copyString, setCopyString] = useState<string>("");

  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [severitySnackBar, setSeveritySnackBar] = useState<string>("");
  const [textSnackBar, setTextSnackBar] = useState<string>("");

  // hooks
  useEffect(() => {
    const getOrders = async () => {
      const orders = await OrderService.GetOrders();
      setOrders(orders);
    };
    getOrders();
  }, []);

  useInterval(async () => {
    const orders = await OrderService.GetOrders();
    setOrders(orders);
  }, 10000);

  // events
  const handleCancelOrder = async (id: string) => {
    const body = {
      id,
      state: ORDER_STATE.CANCELLED,
    };
    const resp = await OrderService.PatchOrder(body);

    if (resp == null) {
      setTextSnackBar("Failed to cancel order.");
      setSeveritySnackBar("error");
      return setShowSnackBar(true);
    }

    const orders = await OrderService.GetOrders();
    setOrders(orders);

    setTextSnackBar("Order successfully updated 🎉");
    setSeveritySnackBar("success");
    setShowSnackBar(true);
  };

  const handleChange = (event: React.FormEvent<EventTarget>) => {
    let target = event.target as HTMLInputElement;
    setValue(target.value);
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopyString(id);
      setTextSnackBar("Copied successfully 🎉");
      setSeveritySnackBar("success");
      setShowSnackBar(true);
    } catch (err) {
      setTextSnackBar("Failed to copy.");
      setSeveritySnackBar("error");
      setShowSnackBar(true);
    }
  };

  const handleClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackBar(false);
  };

  const handleCheckStatus = async () => {
    try {
      const resp = await OrderService.GetOrder(copyString);

      if (resp == null) {
        setTextSnackBar("Failed to get status.");
        setSeveritySnackBar("error");
        return setShowSnackBar(true);
      }

      setTextSnackBar(`Status ${resp.state}`);
      setSeveritySnackBar("info");
      setShowSnackBar(true);
    } catch (error) {
      setTextSnackBar("Failed to get status.");
      setSeveritySnackBar("error");
      return setShowSnackBar(true);
    }
  };

  // helpers
  const getTruncateText = (text: string): string => {
    return `${text.substring(0, 12)}...`;
  };

  const getIsHideCancelButton = (state: string): boolean => {
    if (state == ORDER_STATE.CREATED || state == ORDER_STATE.CONFIRMED) {
      return false;
    }
    return true;
  };

  // views
  const getInfoBox = (imagePath: string, prefix: string, value: string) => {
    return (
      <Grid
        container
        alignItems="center"
        className={`info-box ${prefix.toLowerCase()}`}
        width="fit-content"
      >
        <Image src={imagePath} alt="me" width="30" height="30" />
        <Typography>{`${prefix} ${value}`}</Typography>
      </Grid>
    );
  };

  const getInfoBoxStatus = (state: string) => {
    return (
      <Grid
        container
        alignItems="center"
        className={`info-box ${state.toLowerCase()}`}
        width="fit-content"
      >
        <Typography>{state}</Typography>
      </Grid>
    );
  };

  if (orders == null || orders.length == 0) {
    return (
      <OrderContainer
        container
        alignContent="center"
        justifyContent="center"
        height="100vh"
      >
        <Box p={3} className="box">
          <Typography className="title" variant="h4">
            Create an order
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/")}
            sx={{ mt: 1, mr: 1 }}
          >
            create order
          </Button>
        </Box>
      </OrderContainer>
    );
  }

  return (
    <OrderContainer container alignContent="center" justifyContent="center">
      <Box p={3} className="box">
        <Typography className="mb-1" variant="h4">
          Manage Orders
        </Typography>

        <Grid>
          <Button
            variant="outlined"
            onClick={() => router.push("/")}
            sx={{ mt: 1, mr: 1 }}
          >
            create order
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowCheckStatus(!showCheckStatus)}
            sx={{ mt: 1, mr: 1 }}
          >
            check status
          </Button>
        </Grid>

        {showCheckStatus && (
          <Box mt={2}>
            <TextField
              id="text-field"
              value={value}
              hiddenLabel
              variant="filled"
              size="small"
              fullWidth
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <SearchIcon onClick={() => handleCheckStatus()} />
                ),
              }}
            />
          </Box>
        )}

        <Box mt={2} mb={2}></Box>
        {orders &&
          orders.length > 0 &&
          orders.map((order) => {
            return (
              <div key={order.id}>
                <Box mt={2} mb={2}>
                  <Divider orientation="horizontal" />
                </Box>
                <Grid>
                  <Grid
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid>
                      <Typography>
                        {`Order ID ${getTruncateText(order.id)}`}
                        <ContentCopyIcon
                          className="icon"
                          fontSize="small"
                          onClick={() => handleCopyId(order.id)}
                        />
                      </Typography>
                      <Grid container className="box-info-container">
                        {getInfoBox(
                          "/images/pump.png",
                          "Station",
                          order.station
                        )}
                        {getInfoBox("/images/price.png", "Price", order.price)}
                        {getInfoBoxStatus(order.state)}
                      </Grid>
                    </Grid>
                    <ArrowForwardIosIcon
                      color="primary"
                      className="pointer"
                      style={{ cursor: "pointer !important" }}
                      onClick={() => router.push(`order/${order.id}`)}
                    />
                  </Grid>

                  <Box mt={2} hidden={getIsHideCancelButton(order.state)}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </Button>
                  </Box>
                </Grid>
              </div>
            );
          })}
      </Box>

      <Snackbar
        open={showSnackBar}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={severitySnackBar}
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          {textSnackBar}
        </Alert>
      </Snackbar>
    </OrderContainer>
  );
};

export default OrderPage;
