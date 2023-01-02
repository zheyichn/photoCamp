import React from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import {ThemeProvider} from '@mui/material/styles';
import ThemeBuilder from '../../themes/ThemeBuilder';
import Header from '../Activity/Header';

const ForgotPasswordTextField = (props) => {
    const myProp = props;
    const label = myProp.label;
    return(
        <TextField
          label={label}
          variant="outlined"
          size="small"
          sx={{
            input: { background: '#FFFFFF'},
          }}
        />
    );
  };

export default function ForgotPasswordPage() {

    return (
        <>
            <Header />
            <ThemeProvider theme={ThemeBuilder()}>
                <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    style={{
                        minHeight: '100vh',
                        gap: '20px',
                    }}
                >
                    <Grid
                        item
                        xs={5}
                        backgroundColor='#D9D9D9'
                        borderRadius='12px'
                        style={{
                            minHeight: '300px',
                            minWidth: '300px',
                        }}
                    >
                        <Box
                            marginX={6}
                            marginY={2}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignContent: 'center',
                                gap: '15px'
                            }}
                        >
                            <Typography align='center' style={{fontSize: 24}}>
                                Forgot Password?
                            </Typography>
                            <Typography align='left' style={{fontSize: 18}}>
                                We’ve got your back. Enter your email or
                                username and we’ll send you a link to reset your password.
                            </Typography>
                            <ForgotPasswordTextField label="Email / Username" />
                            <Button
                                variant="contained"
                                size="small"
                                sx={{width: '140px'}}
                            >
                                Send me the link!
                            </Button>
                            <Divider sx={{ backgroundColor: '#000000' }}/>
                            <Typography align="center" style={{fontSize: 12}}>
                                <Link href="/CreateNewAccount">
                                    Create New Account
                                </Link>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>     
            </ThemeProvider>
        </>
    )

}