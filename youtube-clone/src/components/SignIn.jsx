import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import SnackBar from "./snackbar";
import { ChannelContext } from "../Context/ChannelContext";
import { useContext } from "react";
const SignIn = () => {
  const { state } = useLocation();
  const [emailId, setEmailId] = useState(state?.email || "");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { fetchChannels } = useContext(ChannelContext);
  //snackbar
  const [snackBar, setSnackBar] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showSnackBar = (message, type = "info") => {
    setSnackBar({ show: true, message, type });
  };

  const [isValidEmail, setIsValidEmail] = useState(true);
  //email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.co(m)?$/;
    setIsValidEmail(emailRegex.test(email));
  };
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmailId(email);

    if (email.trim() === "") {
      setIsValidEmail(true);
      return;
    }
    validateEmail(email);
  };
  
  //handle login method
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailId || !password) {
      showSnackBar("Please enter email and password.", "warning");
      return;
    }
    try {
      const response = await fetch("http://localhost:5555/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error:", errorData);
        showSnackBar(errorData.message || "Unable to login.", "error");
        throw new Error(errorData.message || "Unable to login");
      }

      const responseData = await response.json();

      if (!responseData.TOKEN) {
        throw new Error("Token not found");
      }

      localStorage.setItem("token", responseData.TOKEN);
      showSnackBar("Logged in successfully", "success");
      await fetchChannels();

      navigate("/");
    } catch (error) {
      if (error.message === "User not found") {
        showSnackBar("No such user exist", "info");
      } else if (error.message === "Invalid password") {
        showSnackBar("Please check your credentials.", "info");
      } else {
        showSnackBar("An error occurred Please try again.", "error");
        console.error("Login error:", error.message);
      }
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 mt-10">
      <div className="bg-whit border-2 shadow-gray-400 p-10 rounded-lg shadow-lg max-w-md w-full bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In <i class="fas fa-shield-alt"></i>
        </h2>
        <p className="text-lg text-gray-500 text-center mt-2">
          Please login in to your account
        </p>

        <form className="mt-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={emailId}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {!isValidEmail && (
              <span className="text-sm text-red-400 ml-2">
                Please enter a valid email
              </span>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-purple-800 text-white font-bold text-lg rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          >
            login
          </button>
        </form>

        {/* signup Link */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Dont have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-bold text-lg hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* snackBar */}
      {snackBar.show && (
        <SnackBar
          className="bottom-5 left-1/2 transform -translate-x-1/2"
          message={snackBar.message}
          type={snackBar.type}
          onClose={() => setSnackBar((prev) => ({ ...prev, show: false }))}
        />
      )}
    </section>
  );
};

export default SignIn;
