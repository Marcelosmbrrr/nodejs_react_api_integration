import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import Stack from '@mui/material/Stack';
import moment from 'moment';
// Axios
import { api as axios } from '../../services/api';
// Context
import { useRefreshTable } from '../../context/RefreshTable';
// Custom components
import { UpdateUserModal } from '../Modal/UpdateUserModal';
import { DeleteUserModal } from '../Modal/DeleteUserModal';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'username',
        headerName: 'Nome',
        flex: 1,
        minWidth: 200,
        sortable: true,
        editable: false,
    },
    {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 200,
        sortable: true,
        editable: false,
    },
    {
        field: 'role',
        headerName: 'Role',
        flex: 1,
        minWidth: 200,
        sortable: true,
        editable: false,
        valueGetter: (data) => {
            return data.row.role.name;
        }
    },
    {
        field: 'created_at',
        headerName: 'Created at',
        flex: 1,
        minWidth: 200,
        sortable: true,
        editable: false,
        valueGetter: (data) => {
            return moment(data.row.created_at).format("YYYY/MM/DD");
        }
    },
    {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        minWidth: 200,
        sortable: true,
        editable: false,
        renderCell: (data) => {

            return (
                <Stack spacing={1} direction="row">
                    <UpdateUserModal formData={{ id: data.row.id, name: data.row.name, email: data.row.email }} />
                    <DeleteUserModal formData={{ id: data.row.id }} />
                </Stack>
            )

        }
    }
]

export function UsersTable() {

    // Contexts
    const { refresh } = useRefreshTable();
    const { enqueueSnackbar } = useSnackbar();
    // Local states
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {

        let is_mounted = true;
        if (!is_mounted) return '';

        const token = localStorage.getItem('authtoken');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
            headers: headers
        })
            .then((response) => {
                setData(response.data.users);
                enqueueSnackbar("Usuários encontrados.", { variant: "success" });
            })
            .catch((error) => {
                setData([]);
                console.log(error)
                enqueueSnackbar(error.response.data.message, { variant: "error" });
            })
            .finally(() => {
                setLoading(false);
            });

        return () => {
            is_mounted = false;
        }

    }, [refresh]);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection={false}
                loading={loading}
            />
        </div>
    )
}