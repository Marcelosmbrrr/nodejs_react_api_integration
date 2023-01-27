import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
// Custom
import { useAuth } from '../context/Auth';
import { UsersTable } from '../components/Table/UsersTable';
import { CreateUserModal } from '../components/Modal/CreateUserModal';
import { MyProfileModal } from '../components/Modal/MyProfileModal';
import { RealTimeChatModal } from '../components/Modal/ReallTimeChatModal';
// Context
import { useRefreshTable } from '../context/RefreshTable';

export function Dashboard() {

    // Contexts
    const { refreshTable } = useRefreshTable();
    const { signOut, user, isAuthenticated } = useAuth();

    async function handleLogout() {
        await signOut();
    }

    React.useEffect(() => {

        if (isAuthenticated) {
            //
        }

    })

    if (!isAuthenticated) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Box spacing={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <CreateUserModal />
                        <MyProfileModal />
                        <Tooltip title="Refresh">
                            <IconButton variant="contained" onClick={() => refreshTable()}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Logout">
                            <IconButton variant="contained" onClick={() => handleLogout()}>
                                <ExitToAppIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box>
                        <RealTimeChatModal />
                    </Box>
                </Box>
            </Container>
            <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                        <Grid container>
                            <Grid item xs={12} textAlign={'center'}>
                                <UsersTable />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Container>
        </Box>
    );
}