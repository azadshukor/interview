import styled from "@emotion/styled";
import { Grid } from "@mui/material";

export const HomeContainer = styled(Grid)`
  .box {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    max-width: 520px;
  }

  .title {
    margin-bottom: 20px;
  }

  .stepper {
    max-width: 500px;
  }

  .select {
    min-width: 50px;
    padding: 12px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    margin: 5px;
    border-radius: 8px;
    cursor: pointer;
  }

  .icon {
    cursor: pointer;
  }

  .select:hover {
    transform: scale(1.05);
  }

  .active {
    border-style: solid;
    border-color: #008fff;
    border-width: 2px;
  }

  @media only screen and (max-width: 521px) {
    .box {
      box-shadow: none;
      min-width: auto;
      border-radius: 0px;
      height: 100vh;
    }
  }
`;
