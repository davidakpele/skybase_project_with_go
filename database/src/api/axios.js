import axios from "axios";

// Create a function to generate an Axios instance
const createAxiosInstance = (baseURL) => {
    return axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
        },
    });
};

// Create Axios instances for different service endpoints
const authenticationService = createAxiosInstance("http://localhost:7099");
const UserService = createAxiosInstance("http://localhost:8080");

export { authenticationService, UserService };
 