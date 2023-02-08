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
import ErrorIcon from '@mui/icons-material/Error';
import { DialogTitle, Divider, Typography } from '@mui/material';
// Other
import styled from 'styled-components';
import moment from 'moment';
import { useAuth } from '../../context/Auth';
// Types
import { IFormValidation } from '../../types';
import { IChatMessage } from '../../types';
// Socket io
import { io } from "socket.io-client";

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

// Create a socket server to use socket io functionalities
const socket = io(import.meta.env.VITE_BACKEND_URL);

export function RealTimeChatModal() {

    const { user } = useAuth();

    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>("");
    const [messageError, setMessageError] = React.useState({ error: false, message: '' });
    const [messages, setMessages] = React.useState<IChatMessage[]>([]);
    const [connected, setConnected] = React.useState<boolean>(false);

    socket.on("successful-authentication", (response) => {
        setConnected(true);
        socket.username = user.username;
        setMessages([
            { username: socket.username, time: moment().format("LT"), message: 'You are online now!', verification: true }
        ]);
    });

    socket.on("new-message-verified", (response) => {

        setMessages((previously) => {
            previously.push(response);
            return previously;
        });
    });

    const handleOpen = () => {
        setOpen(true);

        if (socket.connected) return;

        socket.on("connect", () => {
            // Send username in first connection - to create "username" attribute in client and server side
            socket.emit("authenticate", user.username);
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleSubmit() {

        const is_invalid = validation.message.test(message);
        const error_message = is_invalid ? validation.message.message : '';

        setMessageError({ error: is_invalid, message: error_message });

        if (is_invalid) return '';

        sendMessageToServer();

    }

    async function sendMessageToServer() {

        socket.emit("new-message", message);
        setMessage('');

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
                                        {message.verification && <PersonIcon color={message.username === user.username ? "success" : "inherit"} />}
                                        {!message.verification && <ErrorIcon color="error" />}
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
