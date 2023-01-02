import React from "react";
import {
  Grid,
  Box,
  TextField,
  Typography,
  Button,
  Link,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import {
  loginFunctionBoxStyles,
  createAccountBoxStyles,
} from "../../styles/landingStyle";
import { login } from "../../api/mock_api_j";
import { useState } from "react";
// import { styled } from "@mui/material/styles";

export default function LandingFunctions() {
  const theme = useTheme();

  // capture the current state of log in process
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [user, setUser] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // process login function
  const handleLogin = async () => {
    setFailure(false);
    const res = await login(userName, password);
    if (!res) {
      setErrorMsg("Connection not found");
      setFailure(true);
      return;
    }
    if (res.status !== 201) {
      setErrorMsg(res.data.message);
      setFailure(true);
      return;
    }
    setUser(res.data.userName);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setUser("");
      window.location.pathname = "/homepage";
    }, 2000);
  };

  const handleNewAccountClick = () =>
    (window.location.pathname = "/createnewaccount");

  // handles user inputs
  let userName;
  let password;

  const handleOnChange = (e) => {
    if (e.target.name === "Username:") {
      userName = e.target.value;
    }
    if (e.target.name === "Password:") {
      password = e.target.value;
    }
  };

  // Text boxes used
  const LogInTextField = (props) => {
    const myProp = props;
    const label = myProp.label;
    return (
      <TextField
        id={props.id}
        label={label}
        name={label}
        variant="outlined"
        size="small"
        autoComplete="off"
        onChange={handleOnChange}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ width: "500px", height: "150px" }}
      >
        <Grid item xs={6} sx={{ borderRight: 1, height: "200px" }}>
          <Box m={2} sx={loginFunctionBoxStyles}>
            <LogInTextField label="Username:" id="userNameInput" />
            <LogInTextField label="Password:" id="passwordInput" />
            {failure && <Alert severity="error">{errorMsg}</Alert>}
            {success && (
              <Alert severity="success">Welcome {user}. Please wait...</Alert>
            )}
            <Button
              onClick={handleLogin}
              variant="contained"
              size="small"
              sx={{ width: "80px" }}
              id="signinBtn"
            >
              Sign In
            </Button>
            <Typography style={{ fontSize: 12 }}>
              <Link href="/forgotpassword">Forgot Password?</Link>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} style={{ height: "150px" }}>
          <Box sx={createAccountBoxStyles}>
            <Button
              onClick={handleNewAccountClick}
              variant="contained"
              size="small"
              sx={{ width: "140px" }}
              id="registerBtn"
            >
              <Link href="/CreateNewAccount" underline="none" color="white">
                Create
                <br />
                New Account
              </Link>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
