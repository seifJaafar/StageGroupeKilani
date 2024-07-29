import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Spinner from "../components/Spinner";
import Login from "../view/login/Login";
import ResetPassword from "../view/ResetPassword";
import SignUp from "../view/signup/SignUp";
import EmployeeDashboard from "../view/Dashboards/EmployeeDashboard";
import AddData from "../view/AddData";
import LaboDashboard from "../view/Dashboards/LaboDashboard";
import Profile from "../view/Profile";
import References from "../view/Reference/References";
import ProduitsByRefrence from "../view/Reference/ProduitsByRefrence";
import Visualisation from "../view/charts/visualisation";
import { GetUserByToken } from "../actions/user.action";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";



function MainRoutesComponent() {
  const [user, setUser] = useState({});
  const [is_connected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true);
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser({});
    setIsConnected(false);
    setLoading(true);
    fetchData();
  };

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token)
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token || token === 'null') {
        console.log("no token")
        setIsConnected(false);
      } else {
        const decodedToken = decodeToken(token);
        if (decodedToken.exp < Date.now() / 1000) {
          console.log("token expired")
          localStorage.removeItem('accessToken');
          setIsConnected(false);
          setUser({});
        }
        const { Backuser, is_connected } = await GetUserByToken();
        setUser(Backuser);
        setIsConnected(is_connected);

      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

    fetchData();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  return (
    <div style={{ position: "relative" }}>
      <BrowserRouter>
        {!is_connected && <NotSignedRoutes />}
        {is_connected && user && user.role == "laboratoire" && <LaboRoutes user={user} />}
        {is_connected && user && user.role == "employee" && <EmployeeRoutes user={user} />}
      </BrowserRouter>
    </div>
  );

}

const NotSignedRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );
};
const LaboRoutes = (props) => {
  const { user } = props;

  return (
    <Routes>
      <Route element={<LaboDashboard />} >
        <Route path="/references" element={<References
          role={user.role} Laboratoire={user.laboratoire?._id} />} />
        <Route path="/visualisation" element={<Visualisation laboratoire={user.laboratoire?._id} />} />
        <Route path="/reference/:refid" element={<ProduitsByRefrence />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Navigate to="/visualisation" />} />
      </Route>

    </Routes>
  );
};
const EmployeeRoutes = (props) => {
  const { user } = props;
  return (
    <Routes>
      <Route element={<EmployeeDashboard />} >
        <Route path="/UploadData" element={<AddData />} />
        <Route path="/references" element={<References role={user.role} Laboratoire={null} />} />
        <Route path="/reference/:refid" element={<ProduitsByRefrence />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Navigate to="/UploadData" />} />
      </Route>
    </Routes>
  );
};
export default MainRoutesComponent;;