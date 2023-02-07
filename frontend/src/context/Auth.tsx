import * as React from 'react';
import { api as axios } from '../services/api';
// Types
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { IUserContext } from '../types';

export const AuthContext = React.createContext({});

export function AuthProvider({ children }: { children: ReactJSXElement }) {

    const [user, setUser] = React.useState<null | IUserContext>(null);

    // !! = short way to cast a variable to a boolean
    const isAuthenticated: Boolean = !!user;

    async function signIn(formData: FormData): Promise<void> {

        try {

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, JSON.stringify(formData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const access_token = response.data.access_token_jwt;
            const refresh_token = response.data.refresh_token_jwt;

            if (!access_token || !refresh_token) {
                throw new Error("Token invalid");
            }

            localStorage.setItem("authtoken", access_token);
            localStorage.setItem("refreshtoken", refresh_token);

            setUser(response.data.user);

            window.location.assign("/dashboard");

        } catch (error) {

            throw error;

        }
    }

    async function signOut(): Promise<void> {

        // Get token
        const access_token = localStorage.getItem('authtoken');

        if (!access_token) {
            localStorage.removeItem('authtoken');
            localStorage.removeItem('refreshtoken');
            window.location.assign("/login");
        }

        try {

            await axios({
                url: `${import.meta.env.VITE_BACKEND_URL}/logout`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });

            localStorage.removeItem('authtoken');
            localStorage.removeItem('refreshtoken');
            setUser(null);

            window.location.assign("/login");

        } catch (error) {
            console.log(error);
            localStorage.removeItem('authtoken');
            localStorage.removeItem('refreshtoken');
            window.location.assign("/login");
        }

    }

    async function verifyAuthentication() {

        if (Boolean(localStorage.getItem("authtoken"))) {

            // Get authenticated user data
            // Send access token to authorize
            const access_token = localStorage.getItem("authtoken");

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }

            try {

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth-data`, { headers });
                setUser(response.data.user);

            } catch (error) {
                console.log(error)
                // Logout or call refreshAccessToken()
                //localStorage.clear();
                //window.location.assign("/login");
            }

        } else if (Boolean(localStorage.getItem("refreshtoken"))) {

            refreshAccessToken();

        } else {

            // User session expired - clear browser and redirect to /login
            localStorage.removeItem('authtoken');
            localStorage.removeItem('refreshtoken');
            window.location.assign("/login");
        }

    }

    async function refreshAccessToken() {

        // Get authenticated user data and a new access and refresh token
        // Send refresh token to authorize
        const refresh_token = localStorage.getItem("refreshtoken");

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refresh_token}`
        }

        try {

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/refresh-access-token`, { headers });

            const access_token = response.data.access_token_jwt;
            const refresh_token = response.data.refresh_token_jwt;

            if (!access_token || !refresh_token) {
                throw new Error("Unauthorized");
            }

            localStorage.setItem("authtoken", response.data.access_token_jwt);
            localStorage.setItem("refreshtoken", response.data.refresh_token_jwt);
            setUser(response.data.user);

        } catch (error) {
            console.log(error)
            // Clear browser and logout
            //localStorage.clear();
            //window.location.assign("/login");
        }

    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated, verifyAuthentication }}>
            {children}
        </AuthContext.Provider>
    )

}

// Hook
export function useAuth() {
    return React.useContext(AuthContext);
}

