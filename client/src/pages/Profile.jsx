import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateUser, deleteUser } = useAuth();
  const navigate = useNavigate();

  // 🔥 Upload to Cloudinary
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mern_profile");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/cloudy-aditya/image/upload",
      {
        method: "POST",
        body: data,
      },
    );

    const result = await res.json();

    // 🔥 VERY IMPORTANT
    if (!res.ok) {
      console.log("CLOUDINARY ERROR:", result);
      throw new Error(result.error?.message || "Upload failed");
    }

    console.log("CLOUDINARY SUCCESS:", result);

    return result.secure_url;
  };

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      profilePicture: user.profilePicture || "",
    });

    setPreviewImage(user.profilePicture || "");
  }, [user, navigate]);

  // 🔥 HANDLE IMAGE UPLOAD
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      console.log("Uploading image...");

      const imageUrl = await uploadImage(file);

      console.log("IMAGE URL:", imageUrl);

      setPreviewImage(imageUrl);

      setForm({
        ...form,
        profilePicture: imageUrl,
      });
    } catch (err) {
      console.log("UPLOAD ERROR:", err.message);
      alert(err.message); // 🔥 SHOW REAL ERROR
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {};

      if (form.username.trim() && form.username !== user.username) {
        updatedData.username = form.username;
      }

      if (form.email.trim() && form.email !== user.email) {
        updatedData.email = form.email;
      }

      if (form.password.trim()) {
        updatedData.password = form.password;
      }

      if (form.profilePicture) {
        updatedData.profilePicture = form.profilePicture;
      }

      console.log("UPDATING DATA:", updatedData);

      await updateUser(updatedData);

      alert("Profile updated successfully");
      navigate("/");
    } catch (err) {
      alert("Failed to update user");
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Your Profile</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={
            previewImage ||
            user?.profilePicture ||
            "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border mb-3"
        />

        <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300">
          Upload from browser
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={form.username}
          placeholder="Username"
          className="w-full mb-3 p-2 border"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="email"
          value={form.email}
          placeholder="Email"
          className="w-full mb-3 p-2 border"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          value={form.password}
          placeholder="New Password"
          className="w-full mb-3 p-2 border"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Update Profile
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="w-full mt-4 bg-red-500 text-white p-2 rounded"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
