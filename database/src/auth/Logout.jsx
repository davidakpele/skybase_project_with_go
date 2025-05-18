/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import {useAuth} from "../context/AuthContext"

const Logout = () => {

  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);

  return null; 
}

export default Logout
