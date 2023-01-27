import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// Routes
import { AppRoutes } from './routes';
// Context
import { AuthProvider } from './context/Auth';
import { SnackbarProvider } from 'notistack';
// Socket


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider maxSnack={3}>
          <AppRoutes />
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
