import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase/config";

const PrivateRoute = () => {
  const user = auth.currentUser;
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
