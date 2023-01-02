import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { Grid } from "@mui/material";

export default function Header() {
  // const [login, setLogin] = useState(false);
  // if (props.login) {
  //   setLogin(true);
  // }
  // let login = props.login;

  const handleHomeClick = () => (window.location.pathname = "/homepage");
  const handlePostClick = () => (window.location.pathname = "/post");
  const handleNetworkClick = () => (window.location.pathname = "/suggestion");
  const handleProfileClick = () => (window.location.pathname = "/profile");
  const handleShowAllClick = () => (window.location.pathname = "/display");
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.pathname = "/";
  };

  return (
    <div>
      <Grid
        sx={{
          borderBottom: 1,
          borderColor: "#D9D9D9",
          backgroundColor: "#FFFF",
        }}
        m={0}
      >
        <Toolbar>
          <Grid
            container
            style={{ backgroundColor: "white" }}
            justifyContent="space-between"
          >
            <Grid style={{ backgroundColor: "white" }} item ml="15%">
              <Typography
                sx={{ fontFamily: "Pacifico" }}
                variant="h6"
                color="black"
                component="div"
              >
                PhotoCamp
              </Typography>
            </Grid>
            {["/", "/CreateNewAccount", "/forgotpassword"].includes(
              window.location.pathname
            ) ? null : (
              <>
                <Grid item>
                  {/* <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      fullWidth
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search> */}
                </Grid>
                <Grid item mr="15%">
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    onClick={handleHomeClick}
                  >
                    <HomeIcon data-testid="home-icon" />
                  </IconButton>
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={handlePostClick}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleShowAllClick}
                  >
                    <AccountBoxIcon />
                  </IconButton>

                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleNetworkClick}
                  >
                    <PeopleAltIcon />
                  </IconButton>
                  <IconButton onClick={handleProfileClick}>
                    <Avatar
                      src={sessionStorage.getItem("userProfile")}
                      sx={{ width: 24, height: 24 }}
                    ></Avatar>
                  </IconButton>
                  <IconButton onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </Grid>
              </>
            )}
          </Grid>
        </Toolbar>
      </Grid>
    </div>
  );
}
