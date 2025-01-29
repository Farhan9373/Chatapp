import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Setting";
import Navbar from "./component/Navbar";
// import { axiosInstance } from "./lib/axios";
import { useAuth } from "./store/StoreAuth";
import { Loader } from "lucide-react";
import { useThemeStore } from "./store/useThemeStore";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuth();
  const { theme } = useThemeStore();
  console.log("onlineUsers", onlineUsers);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("authUSer", authUser);
  if (isCheckingAuth && !authUser)
    return (
      <div className=" flex items-center justify-center h-screen">
        <Loader className=" size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
