
import { Component } from 'react';
import { authenticationService } from "../api/axios";
import xhrClient from "../api/xhrClient";
import $ from 'jquery'
import jwtService from "../util/jwt"

var api_url = "http://localhost:7099";

export default new class AuthenticationServices extends Component {
    constructor() {
        super();
        this.token = jwtService.GetUserToken();
        
    }

    register = async ({ ...data }) => {
        try {
            await authenticationService.post("/auth/register", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
            }).then((result) => {
                if (result.status == 201) { 
                    $(".error").hide().text('');
                    $(".error").hide().text('');
                    $(".success").show();
                    $(".success").show().html(result.data);
                    $(".text").text("Sign Up");
                }
            }).catch((e) => {
                $(".text").text("Sign Up");
                $(".error").show().text(e.response.data.message);
            });
        } catch (e) {
            $(".text").text("Sign Up");
            $(".error").show().html('<b>Network Error:</b> Connect to a strong internet.');
            console.error(e);
        }
    }

    login = async ({ ...data }) => {
        try {
          const response = await xhrClient(`${api_url}/auth/login`, 'POST', {
            'Content-Type': 'application/json',
          }, data);
          // Successful login
          return response;
        } catch (error) {
          // Return error with structure
          return {
            success: false,
            error: typeof error === 'string' ? error : 'Something went wrong'
          };
        }
      };
      
     
    resetForget = async ({...data})=>{
        try {
            const request = await authenticationService.post("/auth/forget-password", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

    verifyRestToken= async(token)=>{
        try {
            const request = await authenticationService.get("/auth/reset-password?token="+token, {
                headers: { 'Content-Type': 'application/json' },
            });
            return request;
        } catch (error) { 
            $(".text").text("Submit");
            $(".error").show().html('<b>Network Error:</b> Please check your network connetion.');
            return error;
        }
    }

    saveChangePassword= async(data)=>{
        try {
            const request = await authenticationService.post("/auth/create-new-password", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
            });
            return request;
        } catch (error) { 
            $(".text").text("Submit");
            $(".error").show().html('<b>Network Error:</b> Please check your network connetion.');
            return error;
        }
    }

    verifyOtpToken = async (token) => {
         try {
            const request = await authenticationService.get("/auth/verify-otp-token?token="+token, {
                headers: { 'Content-Type': 'application/json' },
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

    submitOtp = async ({ ...otp }) => {
        try {
            const request = await authenticationService.post("/auth/verify-otp", JSON.stringify(otp), {
                headers: { 'Content-Type': 'application/json' },
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

}
