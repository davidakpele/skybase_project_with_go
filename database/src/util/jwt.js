import { Component } from 'react';

export default new class jwt extends Component{
    
    GetTokenFromLocalStorage() {
        return localStorage.getItem('jwtToken');
    }

    GetTokenFromSessionStorage() {
        return sessionStorage.getItem('jwtToken');
    }

    GetTokenFromCookie() {
        const match = document.cookie.match(new RegExp('(^| )jwtToken=([^;]+)'));
        if (match) {
            return match[2];
        }
        return null;
    }
    
    GetUserToken=() =>{
        const userToken = localStorage.getItem('data');
        const appData = JSON.parse(userToken);
        if (appData && Object.prototype.hasOwnProperty.call(appData, 'user')) {
            const AuthorizationToken = appData.user._jwt_.jwt;
            return AuthorizationToken; 
        }
    }

    GetSubscribedPackageId = () => {
        // const userToken = localStorage.getItem('data');
        // const appData = JSON.parse(userToken);
        // if (appData && Object.prototype.hasOwnProperty.call(appData, 'user')) {
        //     const package = appData.user.package.plan.Id;
        //     return package; 
        // }

        const packageId = "603";
        return packageId;
    }
}