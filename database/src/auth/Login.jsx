import './Login.css'
import { useEffect, useState, useRef   } from 'react'; 
import AuthenticationServices from '../service/AuthenticationServices';
import { useAuth } from "../context/AuthContext"
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer, toast } from 'react-toastify';
import Header from './../components/Header';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [progressext, setProgressext] = useState(false)  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({email: '',password: '',});
  const [focusedFields, setFocusedFields] = useState({ email: false,password: false})
  const { SetUserDetailsAuthentication  } = useAuth()
  
  useEffect(() => {
    document.title = 'Login Account';
  }, []);

  const handleChange = (e) => {
    setFormData({
     ...formData,
     [e.target.name]: e.target.value,
   });
   
   setErrors({
     ...errors,
     [e.target.name]: '',
   });
 };

  const handleFocus = (field) => {
      setFocusedFields((prev) => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: false }))
  }

  const validate = () => {
    setProgressext(false);
    let tempErrors = { email: '', password: '' };
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
      emailRef.current.focus();
      setErrors(tempErrors);
      return false;
    }
  
    if (!emailRegex.test(formData.email.trim())) {
      tempErrors.email = 'Invalid email format';
      emailRef.current.focus();
      setErrors(tempErrors);
      return false;
    }
  
    if (!formData.password.trim()) {
      tempErrors.password = 'Password is required';
      passwordRef.current.focus();
      setErrors(tempErrors);
      return false;
    }
  
    return true;
  };
  


  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validate()) {
      setProgressext(true);
       AuthenticationServices.login(formData)
         .then((result) => {
        if (result.status ==200) {
          SetUserDetailsAuthentication(result.data.token, result.data.fullname, result.data.id, result.data.email);
          window.location.href = "/";
        } else {
          toast.error(result.data.message,{
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
        }
      })
      .catch((e) => {
        if (e.response != null && e.response.status == 400) {
           toast.error(e.message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
        }
      })
        .finally(() => {
          // $(".error").show();
          // $(".error").show().text("Our service is currently down at the moment, Try again later.");
        // Reset loading states regardless of success or failure
        setProgressext(false);
      });
  
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }
  
  return (
    <>
      <Header />
      <ToastContainer />
      <div className="login-container">
        <div className="login-form">
          <div className="form-wrapper">
            <h2>Log in to Skybase eLibrary</h2>
            <div className="success success-ico"></div>
            <form  method="POST" autoComplete="off" onSubmit={handleSubmit}>
              <label htmlFor='Email' className="form-label required">Email</label>
              <div className=" input-container">
              <input
                type="email"
                ref={emailRef}
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className={`form-control form-inputs email-input ${
                  errors.email || focusedFields.email ? 'is-invalid' : ''
                }`}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              <label htmlFor='password' className="form-label required">Password</label>
              <div className="input-container password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    ref={passwordRef}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    className={`form-control form-inputs ${focusedFields.password ? 'is-invalid' : ''}`}
                  />
                  
                  <span className="toggle-password" onClick={togglePassword}>
                    {showPassword ? '🙈' : '👁️'}
                </span>
                
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
              <div className="input-container">
                <button type="submit" onClick={handleSubmit}>{progressext?"Processing...":"Sign In"}</button>
              </div>
            </form>
             
          </div>
        </div>
      <div className="login-image" /></div>
     
     </>
 )
}

export default Login
