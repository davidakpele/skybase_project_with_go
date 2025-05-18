
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import ResetPassword from './../views/auth/ResetPassword';
// import ForgetPassword from './../views/auth/ForgetPassword';
// import Register from './../views/auth/Register';
import Login from '../auth/Login';
// import AccountVerification from './../views/auth/AccountVerification';
// import NotFound from './../views/404/NotFound';
import Logout from '../auth/Logout';
import Page from '../views/Page';
import PublicRoute from '../middleware/PublicRoute';
import PrivateRoute from './../middleware/PrivateRoute';
import Library from '../views/Library';
import Journal from '../views/Journal';



function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/auth/login" element={<PublicRoute><Login/> </PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Page /></PrivateRoute>}/>
          <Route path="*" element={<PrivateRoute><Page /></PrivateRoute>} />
          <Route path="/library/:packageId/subjects/:subjectId/*" element={<PrivateRoute><Library /></PrivateRoute>} />
          <Route path="/library/:packageId/journals/:journalId/*" element={<PrivateRoute><Journal /></PrivateRoute>} />
           <Route path="/auth/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
          { /*<Route path="/auth/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/auth/forget-password" element={<PublicRoute><ForgetPassword /> </PublicRoute>} />
          <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          <Route path="/auth/account-verification" element={<PublicRoute><AccountVerification /> </PublicRoute>} />
          <Route path="/404" element={<PublicRoute><NotFound /> </PublicRoute>} /> */}
        </Routes>
      </div>
      </Router>
  )
}

export default App

