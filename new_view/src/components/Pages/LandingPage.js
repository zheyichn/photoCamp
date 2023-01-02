import React from "react";
import LandingVideo from "../Landing/LandingVideo";
import LandingFunctions from "../Landing/LandingFunctions";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Header from '../Activity/Header';
import { ThemeProvider } from '@mui/material/styles';
import ThemeBuilder from '../../themes/ThemeBuilder';

export default function LandingPage() {

  return (
    <ThemeProvider theme={ThemeBuilder()}>
      <Header />
      <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center"
          style={{ minHeight: '100vh', gap: '20px',}}
      >
          <LandingVideo />
          <LandingFunctions />
          <Box sx={{height: 100}}></Box>
      </Grid> 
  </ThemeProvider>
  );

}