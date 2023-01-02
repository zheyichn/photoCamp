import React from "react";
import Header from "../Activity/Header";
import { Grid } from "@mui/material";
import Following from "../Follow/Following";
import { lightGridStyle } from "../../styles/gridStyles";

export default function FollowingPage() {
  return (
    <div>
      <Header />
      <Grid container flexDirection="column" sx={lightGridStyle}>
        <Grid item width="50%" alignSelf="center" alignItems="center" mt={5}>
          <Following />
        </Grid>
      </Grid>
    </div>
  );
}
