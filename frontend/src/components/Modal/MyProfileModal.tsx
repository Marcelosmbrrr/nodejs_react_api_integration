import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
// Custom
import { useAuth } from '../../context/Auth';

export function MyProfileModal() {

    const { user } = useAuth();
    const [open, setOpen] = React.useState<boolean>(false);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
            <Tooltip title="My Profile">
                <IconButton onClick={handleOpen}>
                    <AccountCircleIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>My Profile</DialogTitle>
                <Divider />

                <DialogContent>
                    <Grid container rowSpacing={1} columnSpacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={user.name}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={user.email}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="role"
                                label="Role"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={user.role_id}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="created_at"
                                label="Created at"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={user.created_at}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="error">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
