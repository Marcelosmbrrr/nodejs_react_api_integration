import * as React from 'react';
// Mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
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
    const { signOut, user, isAuthenticated, verifyAuthentication } = useAuth();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        verifyAuthentication();
        setLoading(false);
    }, []);

    async function handleLogout() {
        await signOut();
    }

    if (!isAuthenticated && loading) {
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
                <Box component="form" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <CreateUserModal />
                        <MyProfileModal />
                        <Tooltip title="Refresh">
                            <IconButton onClick={() => refreshTable()}>
                                <RestartAltIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Logout">
                            <IconButton onClick={() => handleLogout()}>
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