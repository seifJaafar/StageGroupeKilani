import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Spinner from "../components/Spinner";
import Login from "../view/login/Login";
import ResetPassword from "../view/ResetPassword";
import Dashboard from "../view/Dashboard";
import Users from "../view/users/Users";
import Laboratoires from "../view/laboratoires/Laboratoires"
import Produits from "../view/produits/Produits";
import References from "../view/references/References";
import ProduitsByRefrence from "../view/references/ProduitsByRefrence";
import Profile from "../view/Profile"
import Logs from "../view/logs/Logs"
import { GetUserByToken } from "../actions/user.action";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";



function MainRoutesComponent() {
  const [user, setUser] = useState({});
  const [is_connected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true);
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
        {is_connected && user && user.role === "admin" && <AdminRoutes />}

      </BrowserRouter>
    </div>
  );

}

const NotSignedRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );
};
const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Dashboard />} >
        <Route path="/users" element={<Users />} />
        <Route path="/laboratoires" element={<Laboratoires />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/references" element={<References />} />
        <Route path="/reference/:refid" element={<ProduitsByRefrence />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/*" element={<Navigate to="/users" />} />
      </Route>
    </Routes>
  );
};

export default MainRoutesComponent;;