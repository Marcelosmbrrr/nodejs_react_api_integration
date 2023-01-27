import * as React from 'react';
import { api as axios } from '../services/api';
// Types
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

export const RefreshTableContext = React.createContext({});

export function RefreshTableProvider({ children }: { children: ReactJSXElement }) {

    const [refresh, setRefresh] = React.useState<Boolean>(false);

    function refreshTable() {
        setRefresh((old) => !old);
    }

    return (
        <RefreshTableContext.Provider value={{ refreshTable, refresh }}>
            {children}
        </RefreshTableContext.Provider>
    )

}

// Hook
export function useRefreshTable() {
    return React.useContext(RefreshTableContext);
}

