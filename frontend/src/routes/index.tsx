import * as React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from '../pages/Login';
// Context
import { RefreshTableProvider } from '../context/RefreshTable';

export function AppRoutes() {

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )

}