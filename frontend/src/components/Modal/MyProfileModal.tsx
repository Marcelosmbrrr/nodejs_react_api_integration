import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
// Context
import { useAuth } from '../../context/Auth';

export function MyProfileModal() {

    const { user } = useAuth();
    const [open, setOpen] = React.useState(false);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <Tooltip title="Profile">
            <IconButton onClick={handleOpen}>
                <AccountCircleIcon />
            </IconButton>
        </Tooltip>
    );
}