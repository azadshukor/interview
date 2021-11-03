import styled from "@emotion/styled";
import { Grid } from "@mui/material";

export const OrderContainer = styled(Grid)`
  padding-top: 20px;
  padding-bottom: 20px;

  .pointer {
    cursor: pointer;
  }

  .box {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    min-width: 520px;
  }

  .info-box {
    background: #ebebeb;
    padding: 8px;
    border-radius: 8px;
  }

  .station {
    margin-right: 5px;
  }

  .price {
    margin-right: 5px;
  }

  @media only screen and (max-width: 600px) {
    padding-top: 0px;
    padding-bottom: 0px;

    .box {
      box-shadow: none;
      min-width: auto;
      border-radius: 0px;
      width: 100%;
    }

    .info-box {
      margin-bottom: 5px;
    }
  }
`;
