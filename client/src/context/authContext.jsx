import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshTokenAPI,
  googleLoginAPI,
} from "../services/AuthService";
import { updateUserAPI, deleteUserAPI } from "../services/UserService";
import { auth, provider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null,
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  // 🔹 LOGIN
  const login = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      console.log("AUTH LOGIN:", res.data);
      const userData = res.data.data.user;
      const token = res.data.data.accessToken;
      if (!userData || !token) {
        throw new Error("Invalid response structure");
      }
      setUser(userData);
      setAccessToken(token);
      console.log("AUTH LOGIN - USER SET TO:", res.data.data.user);

      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("accessToken", res.data.data.accessToken);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 REGISTER
  const register = async (data) => {
    try {
      setLoading(true);
      const res = await registerUser(data);

      setUser(res.data.data.user);
      setAccessToken(res.data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.data.user)); // ✅ ADD
      localStorage.setItem("accessToken", res.data.data.accessToken);
    } catch (err) {
      console.log(err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("user"); // ✅ ADD
      localStorage.removeItem("accessToken");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 REFRESH TOKEN
  const refreshAccessToken = async () => {
    try {
      const res = await refreshTokenAPI();
      setAccessToken(res.data.accessToken);
      localStorage.setItem("accessToken", res.data.accessToken);
      return res.data.accessToken;
    } catch (err) {
      console.log(err);

      // logout();
      // ❌ DON'T treat as error
      if (err.response?.status === 401) {
        console.log("No session, user not logged in"); // ✅ normal
        return null;
      }

      console.log("Refresh error:", err);
    }
  };

  // 🔹 GOOGLE LOGIN
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await googleLoginAPI({
        email: user.email,
        username: user.displayName,
        profilePicture: user.photoURL,
      });

      setUser(res.data.data.user);
      setAccessToken(res.data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("accessToken", res.data.data.accessToken);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 AUTO REFRESH
  useEffect(() => {
    const init = async () => {
      // 🔥 Only try refresh if token existed before
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        console.log("No token → skip refresh"); // ✅
        return;
      }

      await refreshAccessToken();
    };

    init();
  }, []);

  // 🔹 AXIOS INTERCEPTOR
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalReq = err.config;

        if (err.response?.status === 401 && !originalReq._retry) {
          originalReq._retry = true;

          const newToken = await refreshAccessToken();

          if (newToken) {
            originalReq.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalReq);
          }
        }

        return Promise.reject(err);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const updateUser = async (data) => {
    try {
      console.log("UPDATING USER ID:", user?._id);
      const res = await updateUserAPI(user._id, data);
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const deleteUser = async () => {
    try {
      await deleteUserAPI(user._id);
      setUser(null);
      setAccessToken(null);

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      // logout();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        googleLogin,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
