import * as React from 'react';
// Material UI
import { Button, CssBaseline, TextField, FormControlLabel, Checkbox, Box, Typography, Container, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
// Context 
import { useAuth } from '../context/Auth';
// Types
import { IFormValidation } from '../types';

const formValidation: IFormValidation = {
    email: {
        test: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        message: 'Email invalid.'
    },
    password: {
        test: (value) => value != null && value.length > 0,
        message: "Password must be informed."
    }
}

export function Login() {

    const { enqueueSnackbar } = useSnackbar();

    const { signIn } = useAuth();
    const [formData, setFormData] = React.useState({ email: "", password: "" });
    const [formError, setFormError] = React.useState({ email: { error: false, message: "" }, password: { error: false, message: "" } });

    function handleSubmit(e) {
        e.preventDefault();

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

        if (formError.email.error || formError.password.error) return '';

        requestServer();

    }

    async function requestServer() {

        try {
            await signIn(formData);
        } catch (error) {
            enqueueSnackbar(error.response.data.message, { variant: "error" });
        }

    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.currentTarget.value });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Stack direction="row" spacing={1} mb={2}>
                    <img width="60px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" />
                    <img width="60px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" />
                </Stack>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        error={formError.email.error}
                        helperText={formError.email.message}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formData.password}
                        error={formError.password.error}
                        helperText={formError.password.message}
                        onChange={(e) => handleChange(e)}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Access
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}