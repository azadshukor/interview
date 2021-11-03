import { Grid, Box, Typography, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { IOrderObj } from "src/interfaces";
import { OrderService } from "src/services";

const OrderIdContainer = styled(Grid)`
  .box {
    background: white;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    max-width: 520px;
    width: 100%;
  }
`;

const OrderIdPage = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router);
  const [orderDetails, setOrderDetails] = useState<IOrderObj | null>(null);

  useEffect(() => {
    if (id == undefined || id == null) return;
    const getOrder = async () => {
      const resp = await OrderService.GetOrder(id as string);
      setOrderDetails(resp);
    };

    getOrder();
  }, [id]);

  const getReadableDateFormat = (value: string | undefined): string => {
    if (!value) return "Invalid Date";

    var date = new Date(orderDetails?.created_at || "");
    return date.toDateString();
  };

  return (
    <OrderIdContainer
      container
      alignContent="center"
      justifyContent="center"
      height="100vh"
    >
      <Box p={3} className="box">
        <Box mb={2}>
          <Typography variant="h4">Order Details</Typography>
        </Box>

        <TextField
          label="Station"
          value={orderDetails?.station || ""}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          variant="filled"
        />
        <TextField
          label="Price"
          value={`MYR ${orderDetails?.price}` || ""}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          variant="filled"
        />
        <TextField
          label="Sale Date"
          value={getReadableDateFormat(orderDetails?.created_at)}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          variant="filled"
        />
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
            onClick={() => router.push("/order")}
            sx={{ mt: 1, mr: 1 }}
          >
            go to orders
          </Button>
        </Grid>
      </Box>
    </OrderIdContainer>
  );
};

export default OrderIdPage;
