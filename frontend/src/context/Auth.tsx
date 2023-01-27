import * as React from 'react';
import { api as axios } from '../services/api';
import { redirect } from "react-router-dom";
// Types
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { IUserContext } from '../types';

export const AuthContext = React.createContext({});

export function AuthProvider({ children }: { children: ReactJSXElement }) {

    const [user, setUser] = React.useState<null | IUserContext>(null);

    // !! = short way to cast a variable to be a boolean
    const isAuthenticated: Boolean = !!user;

    // This wil be call when user refreh the page
    React.useEffect(() => {

        const token = localStorage.getItem('authtoken');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        if (!!token) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth-data`, { headers })
                .then((response) => {
                    setUser(response.data.user);
                })

        }

    }, []);

    async function signIn(formData: FormData): Promise<void> {

        try {


            const response = await axios({
                url: `${import.meta.env.VITE_BACKEND_URL}/login`,
                method: 'POST',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(formData)
            });

            console.log(response);

            /*            
            localStorage.setItem("authtoken", response.data.token)

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            setUser(response.data.user);

            redirect("internal/dashboard");
            */

        } catch (error) {

            throw error;

        }
    }

    async function signOut(): Promise<void> {

        // Get token
        const token = localStorage.getItem('authtoken');

        try {

            const response = await axios({
                url: `${import.meta.env.VITE_BACKEND_URL}/logout`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            localStorage.removeItem('authtoken');

            setUser(null);

            redirect("/login");

        } catch (error) {

            console.log(error);

        }

    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )

}

// Hook
export function useAuth() {
    return React.useContext(AuthContext);
}

