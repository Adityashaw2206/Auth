import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
const Login = () => {
  const { login, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  // const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full mb-4 p-3 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-black text-white p-3 rounded">
            Log In
          </button>
        </form>

        {/* 🔥 GOOGLE LOGIN */}
        <button
          onClick={googleLogin}
          className="w-full mt-4 bg-red-500 text-white p-2 rounded"
        >
          Login with Google
        </button>

        {/* 🔥 SIGN UP LINK (IMPORTANT) */}
        <p className="text-center mt-5 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
