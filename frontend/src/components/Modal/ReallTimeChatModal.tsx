import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Tooltip from '@mui/material/Tooltip';
import ChatIcon from '@mui/icons-material/Chat';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PersonIcon from '@mui/icons-material/Person';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, Divider, Typography } from '@mui/material';
// Other
import styled from 'styled-components';
import moment from 'moment';
import { api as axios } from '../../services/api';
import { useAuth } from '../../context/Auth';
// Types
import { IFormValidation } from '../../types';
import { IChatMessage } from '../../types';
import { IfieldError } from '../../types';

const ChatRow = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

const ChatRowAvatar = styled.div`
    flex-basis: 'fit-content';
    margin-right: 5px;
`;

const ChatRowPersonName = styled.div`
    flex-grow: 1;
    margin-right: 5px;
`;

const ChatRowMessage = styled.div`
    flex-grow: 1;
`;

const validation: IFormValidation = {
    message: {
        test: (message) => (message == null || message.length == 0),
        message: 'Type your message'
    }
}

export function RealTimeChatModal() {

    const { user } = useAuth();

    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>("");
    const [messageError, setMessageError] = React.useState<IfieldError>({ error: false, message: '' });
    const [messages, setMessages] = React.useState<IChatMessage[]>([]);
    const [connected, setConnected] = React.useState<boolean>(false);

    // Subscribe channel 
    // Listen channel changes

    const handleOpen = () => {
        setOpen(true);

        if (connected) return '';

        setTimeout(() => {
            setConnected(true);
            setMessages([
                { username: 'You', avatar: { color: 'success' }, time: moment().format("LT"), message: 'You are online now!' }
            ]);
        }, 2000);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleSubmit() {

        const is_invalid = validation.message.test(message);
        const error_message = is_invalid ? validation.message.message : '';

        setMessageError({ error: is_invalid, message: error_message });

        if (is_invalid) return '';

        requestServer();

    }

    async function requestServer() {

        const formData = new FormData();
        formData.append('message', message);

        try {

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/message`, formData);
            setMessage('');

        } catch (error) {
            console.log(error)
            setMessageError({ error: true, message: error.message });
        }

    }

    function renderMessages() {

        // Not connected
        if (!connected) {

            return <Typography>Connecting...</Typography>

        } else if (connected) {
            return (
                <>
                    {messages.map((message, index) =>
                        <>
                            <ChatRow key={index}>
                                <Box sx={{ display: 'flex' }}>
                                    <ChatRowAvatar>
                                        <PersonIcon color={message.avatar.color} />
                                    </ChatRowAvatar>
                                    <ChatRowPersonName>
                                        {message.username}
                                    </ChatRowPersonName>
                                </Box>
                                <ChatRowMessage>
                                    <Typography fontSize={'15px'}>{message.message}</Typography>
                                    <Typography fontSize={'10px'}>{message.time}</Typography>
                                </ChatRowMessage>
                            </ChatRow>
                        </>
                    )}

                </>
            )
        }
    }

    return (
        <>
            <Tooltip title="Chat">
                <Badge color={connected ? "success" : "error"} variant="dot">
                    <IconButton onClick={handleOpen}>
                        <ChatIcon />
                    </IconButton>
                </Badge>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />

                <DialogContent>
                    <DialogContentText>

                        <Stack spacing={3} sx={{ overflow: 'auto' }}>
                            {renderMessages()}
                        </Stack>

                    </DialogContentText>
                </DialogContent>

                <Divider />
                <DialogActions sx={{ padding: '20px' }}>
                    <TextField
                        label="Type your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        error={messageError.error}
                        helperText={messageError.message}
                        fullWidth
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSubmit} disabled={!connected}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>,
                        }}
                    />
                </DialogActions>
            </Dialog>
        </>
    );
}
