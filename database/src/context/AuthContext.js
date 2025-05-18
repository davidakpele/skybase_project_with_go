import { createContext, useContext, useReducer, useState } from "react";
// import { authenticationService } from "../api/axios";
import { Search } from "@mui/icons-material";

const AuthContext = createContext({});

const initialState = {
    isAuthenticated: false,
    User: {
        name: "",
        email: "",
        password: "",
        is_user: false,
        is_active: false,
        last_login: "",
        date_joined: "",
        id: "",
        token: "",
    },
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isAuthenticated: true };
        case 'LOGOUT':
            return { ...state, isAuthenticated: false };
        default:
            return state;
    }
};

const SetUserDetailsAuthentication =(token, name, userId, email)=>{
    const data = {
        "settings": {
            "alignment": "right",
            "color": "#000"
        },
        "user": {
            "hasConversations": false,
            "locale": location,
            "username": name,
            "email":email,
            "userId": userId,
            "_jwt_": {
                "jwt": token,
            }
        },
    }
    const secret_data = JSON.stringify(data);
    localStorage.setItem('data', secret_data);
    sessionStorage.setItem('data', secret_data);
    document.cookie = `data=${secret_data}; path=/; secure; samesite=strict`;
}

const monitorStation =(station, id, rows, page)=>{
    const data = {
        "active_station": {
            "active_page":station,
            "id": id,
            "page": (page != "" && page != null ? page : ''),
            "rows": (rows != "" && rows != null ? rows : '')
        },
        
    }
    const stationStation = JSON.stringify(data);
    localStorage.setItem('jstation', stationStation);
    sessionStorage.setItem('jstation', stationStation);
    document.cookie = `jstation=${stationStation}; path=/; secure; samesite=strict`;
}

const monitorIssueLogs =(current, id, rows, year, volume, page)=>{
    const data = {
        "issueLogs": {
            "current":current,
            "id": id,
            "year": year,
            "volume": (volume != "" && volume != null ? volume : ''),
            "page": (page != "" && page != null ? page : ''),
            "rows": (rows != "" && rows != null ? rows : '')
        },
        
    }
    const issueLogs = JSON.stringify(data);
    localStorage.setItem('data', issueLogs);
    sessionStorage.setItem('data', issueLogs);
    document.cookie = `data=${issueLogs}; path=/; secure; samesite=strict`;
}

const getStation = () => {
    const data = localStorage.getItem('jstation');
    const appData = JSON.parse(data);

    const station = appData?.active_station;

    if (station) {
        const { rows, active_page, id, page } = station;
        return [rows, active_page, id, page];
    }

    return [];
};

const getIssueData = () => {
    const data = localStorage.getItem('jstation');
    const appData = JSON.parse(data);

    const issue = appData?.issueLogs;

    if (issue) {
        const { rows, current, id, year, volume, page } = issue;
        return [rows, current, id, year, volume, page];
    }

    return [];
};

const monitorSearchResultCount =(active_log, action, input_search, page, rows)=>{
    const data = {
        "track_search_data": {
            "active": active_log,
            "action":action,
            "search": input_search,
            "page": (page != "" && page != null ? page : ''),
            "rows": (rows != "" && rows != null ? rows : '')
        },
        
    }
    const stationStation = JSON.stringify(data);
    localStorage.setItem('systemRequet', stationStation);
    sessionStorage.setItem('systemRequet', stationStation);
    document.cookie = `systemRequet=${stationStation}; path=/; secure; samesite=strict`;
}

const deleteMonitorSearchResult = () => {
    localStorage.removeItem('jstation');
    sessionStorage.removeItem('jstation');
    document.cookie = 'jstation=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict';

    localStorage.removeItem('systemRequet');
    sessionStorage.removeItem('systemRequet');
    document.cookie = 'systemRequet=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict';
}

  
const getSearchResultCount = () => {
    const data = localStorage.getItem('systemRequet');
    const appData = JSON.parse(data);

    const search_data = appData?.track_search_data;

    if (search_data) {
        const { active, action, search, page, rows } = search_data;
        return [active, action, search, page, rows];
    }

    return [];
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [authenticated, setAuthenticated] = useState(false);

    const login = () => {
        // Your login logic here, e.g., setting authenticated state
        setAuthenticated(true);
        dispatch({ type: 'LOGIN' });
    };

    const logout = async () => {
        try {
            setAuthenticated(false);
            dispatch({ type: 'LOGOUT' });
            SetUserDetailsAuthentication("", "", "", "");
            localStorage.removeItem('data');
            sessionStorage.removeItem('data');
            document.cookie = `data=; path=/; secure; samesite=strict`;
            localStorage.removeItem('jstation');
            sessionStorage.removeItem('jstation');
            document.cookie = `jstation=; path=/; secure; samesite=strict`;
            // Redirect to the home page
            window.location.replace('/');
            // Send logout request to the backend
            // const response = await authenticationService.get('/auth/logout');
            // // Check if the response indicates success (status code 200)
            // if (response.status == 200) {
            //     // Clear user data
               
            // } 
            // Update authentication state and dispatch logout action
            setAuthenticated(false);
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Error during logout:', error);
        }
      
    };

    const getUsername = () => {
        const data = localStorage.getItem('data'); 
        const appData = JSON.parse(data);
        if (appData && Object.prototype.hasOwnProperty.call(appData, 'settings')){
            return appData.user?.username || null;
        }
        return null;
    };

    const getUserId = () => {
        const data = localStorage.getItem('data'); 
        const appData = JSON.parse(data);
        if (appData && Object.prototype.hasOwnProperty.call(appData, 'settings')){
            return appData.user?.userId || null;
        }
        return null;
    };

    return (
        <AuthContext.Provider value={{ ...state, authenticated, SetUserDetailsAuthentication, getUsername, getIssueData, deleteMonitorSearchResult, getSearchResultCount, monitorSearchResultCount, monitorIssueLogs, getStation, getUserId, logout, login, monitorStation }}>
            {children}
        </AuthContext.Provider>
    );
};
