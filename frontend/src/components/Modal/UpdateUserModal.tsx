import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
// Axios
import { api as axios } from '../../services/api';
// Context
import { useRefreshTable } from '../../context/RefreshTable';
// Types
import { IFormValidation } from '../../types';

const initialFormData = { name: '', email: '' }
const initialFormError = { name: { error: false, message: '' }, email: { error: false, message: '' } }
const initialAlert = { display: false, type: "", message: "" }

const formValidation: IFormValidation = {
    name: {
        test: (value) => value != null && value.length >= 3,
        message: 'Name must have at least 3 letters.'
    },
    email: {
        test: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        message: 'Email invalid.'
    }
}

export const UpdateUserModal = React.memo((props) => {

    // Contexts
    const { refreshTable } = useRefreshTable();
    // Local states
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState(initialAlert);
    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);

    function handleOpen() {
        setOpen(true);
        setFormData({ name: props.formData.name, email: props.formData.email });
        setFormError(initialFormError);
        setAlert(initialAlert);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleSubmit() {

        let errors = Object.assign({}, formError);
        for (let field in formData) {
            if (!formValidation[field].test(formData[field])) {
                errors[field].error = true;
                errors[field].message = formValidation[field].message;
            } else {
                errors[field].error = false;
                errors[field].message = '';
            }
        }

        setFormError(errors);

        if (formError.name.error || formError.email.error) return '';

        requestServer();

    }

    async function requestServer() {

        setLoading(true);

        try {

            const token = localStorage.getItem('authtoken');

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }

            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/user/${props.formData.id}`, formData, { headers });

            setAlert({ display: true, type: "success", message: response.data.message });

            setTimeout(() => {
                refreshTable();
                handleClose();
            }, 2000);

        } catch (error) {

            setAlert({ display: true, type: "error", message: error.response.data.message });

        } finally {

            setLoading(false);

        }
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.currentTarget.value });
    }

    return (
        <>
            <Tooltip title="Edit User">
                <IconButton variant="contained" onClick={handleOpen}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>User Update</DialogTitle>
                <Divider />

                <DialogContent>
                    <DialogContentText mb={1}>
                        The user will receive a notification to be informed about the changes.
                    </DialogContentText>
                    <Grid container rowSpacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                name="name"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.name}
                                error={formError.name.error}
                                helperText={formError.name.message}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="email"
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={formData.email}
                                error={formError.email.error}
                                helperText={formError.email.message}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <Divider />
                {loading && <LinearProgress />}
                {alert.display && <Alert severity={alert.type}>{alert.message}</Alert>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Update</Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
