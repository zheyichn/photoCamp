import { CardMedia, Dialog, Grid, Typography } from '@mui/material';

export default function UserDialog(props) {
    const {
        dialogUser,
        dialogOpen,
        handleDialogClose,
        dialogUserInfo
    } = props;

    return(
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <Grid container height="300px" width="600px">
                <Grid item xs={6}>
                    <CardMedia
                        component="img"
                        height="300px"
                        width="300px"
                        style={{ borderRadius: "50%" }}
                        src={dialogUserInfo.profile}
                    />                  
                </Grid>
                <Grid item xs={6}>
                    <Grid container alignContent="center" flexDirection="column">
                        <Grid item xs={10}>
                            <Typography variant="h3" textAlign="center">
                                {dialogUser}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography>
                                <b>Following:</b> {dialogUserInfo.followings? dialogUserInfo.followings.length : null}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography>
                                <b>Followers:</b> {dialogUserInfo.followers? dialogUserInfo.followers.length : null}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography>
                                <b>Bio:</b> {dialogUserInfo? dialogUserInfo.bio : null}
                            </Typography>                            
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    );
}