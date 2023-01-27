import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
// Context
import { useAuth } from '../../context/Auth';

export function CreateUserModal() {

    const [open, setOpen] = React.useState<Boolean>(false);

    function handleOpen() {
        setOpen(true);
    }

    return (
        <Tooltip title="Add User">
            <IconButton variant="contained" onClick={handleOpen}>
                <AddIcon />
            </IconButton>
        </Tooltip>
    )
}