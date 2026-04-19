import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
const Navbar = ({ children }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-gray-200">
        <h1 className="font-bold text-lg">Auth App</h1>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="px-2 py-1 rounded hover:bg-gray-400 transition"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="px-2 py-1 rounded hover:bg-gray-400 transition"
          >
            About
          </Link>

          {!user ? (
            <Link to="/login">Sign-In</Link>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              {/* <button className="font-semibold">{user.username}</button> */}
              <button className="flex items-center gap-2">
                <img
                  src={user.profilePicture}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover"
                />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 bg-white shadow rounded w-52 p-3">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>

                  <hr className="my-2" />

                  <Link
                    to="/profile"
                    className="block py-1 hover:text-blue-500"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="block w-full text-left py-1 hover:text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div>{children}</div>
    </>
  );
};

export default Navbar;
