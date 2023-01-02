import React from "react";
import { Grid } from "@mui/material";
import Follower from "../Follow/Follower";
import Header from "../Activity/Header";
import { lightGridStyle } from "../../styles/gridStyles";

export default function FollowerPage() {
  return (
    <div>
      <Header />
      <Grid container flexDirection="column" sx={lightGridStyle}>
        <Grid item width="50%" alignSelf="center" alignItems="center" mt={5}>
          <Follower />
        </Grid>
      </Grid>
    </div>
  );
}
