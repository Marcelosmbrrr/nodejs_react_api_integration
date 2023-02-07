import * as React from 'react';
// Mui
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
// Axios
import { api as axios } from '../../services/api';

interface IProps {
    selection: string,
    error: boolean,
    errorMessage: string,
    option: {
        [key: string]: string
    },
    fetch_from: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FetchedDataSelection = React.memo((props: IProps) => {

    const [roles, setRoles] = React.useState([]);
    const [selection, setSelection] = React.useState(props.selection);
    const [loading, setLoading] = React.useState(true);

    const optionKeys = {
        key: props.option.key,
        value: props.option.value,
        label: props.option.label
    }

    React.useEffect(() => {

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/${props.fetch_from}`)
            .then((response) => {
                setRoles(response.data.roles);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [])

    if (loading) {
        return <TextField label="Role" variant="outlined" placeholder='Loading...' disabled />
    }

    if (!loading && roles.length === 0) {
        return <TextField label="Role" variant="outlined" placeholder='No role found' disabled />
    }

    if (!loading && roles.length > 0) {
        return (
            <TextField
                name="role_id"
                select
                label="Role"
                value={selection}
                helperText="Please select your currency"
            >
                <MenuItem key={"0"} value={"0"}>
                    Choose
                </MenuItem>
                {roles.map((option) => (
                    <MenuItem key={option[optionKeys.key]} value={option[optionKeys.value]}>
                        {option[optionKeys.label]}
                    </MenuItem>
                ))}
            </TextField>
        )
    }

});

