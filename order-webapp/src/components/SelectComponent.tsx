import { Grid, Box } from "@mui/material";
import { ISelectComponent } from "src/interfaces";

export const SelectComponent = (props: ISelectComponent): JSX.Element => {
  return (
    <Grid container>
      {props.items.map((item) => {
        return (
          <Box
            className={`select ${props.state == item && "active"}`}
            key={item}
            onClick={() => props.setState(item)}
          >
            {`${props.prefix}${item}`}
          </Box>
        );
      })}
    </Grid>
  );
};
