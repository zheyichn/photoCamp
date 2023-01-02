import React from "react";
import {
  Grid,
  Box,
  TextField,
  Typography,
  Button,
  Divider,
  Link,
  Alert,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ThemeBuilder from "../../themes/ThemeBuilder";
import { useState } from "react";
import Header from "../Activity/Header";
// import { styled } from '@mui/system';

import { createUser } from "../../api/mock_api_j";

export default function CreateNewAccountPage() {
  // states to capture the account creation process
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [err, setErr] = useState("");
  const [userName, setUsername] = useState("");

  // custom text field built on top of standard text field
  const NewAccountTextField = (props) => {
    const myProp = props;
    const label = myProp.label;
    return (
      <TextField
        id={props.id}
        label={label}
        name={label}
        variant="outlined"
        size="small"
        onChange={handleOnChange}
        sx={{
          input: { background: "#FFFFFF" },
          width: "200px",
        }}
      />
    );
  };

  // handles user inputs
  let username;
  let password;
  let email;

  const handleOnChange = (e) => {
    if (e.target.name === "Username:") {
      username = e.target.value;
    }
    if (e.target.name === "Password:") {
      password = e.target.value;
    }
    if (e.target.name === "Email:") {
      email = e.target.value;
    }
  };

  // handles creation of new account
  const handleCreateNewAccount = async (e) => {
    e.preventDefault();
    const newUser = { userName: username, password: password, email: email };
    setFailure(false);
    try {
      const newUserCreated = await createUser(newUser);
      const userName = newUserCreated.userName;
      setUsername(userName);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setUsername(userName);
        window.location.pathname = "/";
      }, 2000);
    } catch (err) {
      setErr(err.message);
      setFailure(true);
    }
  };

  return (
    <div>
      <ThemeProvider theme={ThemeBuilder()}>
        <Header />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{
            minHeight: "100vh",
            gap: "20px",
          }}
        >
          <Grid
            item
            xs={6}
            backgroundColor="#D9D9D9"
            borderRadius="12px"
            style={{
              minHeight: "350px",
              minWidth: "300px",
            }}
          >
            <Box
              m={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                gap: "15px",
              }}
            >
              <Typography align="center" style={{ fontSize: 24 }}>
                Create New Account
              </Typography>
              <NewAccountTextField label="Email:" id="regEmail" />
              <NewAccountTextField label="Username:" id="regUsername" />
              <NewAccountTextField label="Password:" id="regPassword" />
              {failure && <Alert severity="error">{err}</Alert>}
              {success && (
                <Alert severity="success">
                  Account created for {userName}
                  <br />
                  <b>Redirecting to login page...</b>
                </Alert>
              )}
              <Button
                variant="contained"
                size="small"
                sx={{ width: "140px" }}
                onClick={handleCreateNewAccount}
                id="signupBtn"
              >
                Sign Up
              </Button>
              <Divider sx={{ backgroundColor: "#000000" }} />
              <Typography style={{ fontSize: 12 }}>
                <Link href="/">I already have an account</Link>
              </Typography>
            </Box>
          </Grid>
          <Box sx={{ height: 100 }}></Box>
        </Grid>
      </ThemeProvider>
    </div>
  );
}
