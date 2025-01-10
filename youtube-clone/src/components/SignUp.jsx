import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SnackBar from "./snackbar";

const SignUp = () => {
  // initialize navigation hook
  const navigate = useNavigate();

  // state to manage snackbar visibility and message
  const [snackBar, setSnackBar] = useState({
    show: false,
    message: "",
    type: "info",
  });

  //  function to display the snackbar with a message and type
  const showSnackBar = (message, type = "info") => {
    setSnackBar({ show: true, message, type });
  };

  // state to hold form input values
  const [formData, setFormData] = useState({
    userName: "",
    emailId: "",
    password: "",
  });

  // state to validate password input
  const [isValidPassword, setIsValidPassword] = useState(true);

  // validate if password contains at least one number and one special character
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    setIsValidPassword(passwordRegex.test(password));
  };

  // state to validate email input
  const [isValidEmail, setIsValidEmail] = useState(true);

  // validate if email is in correct format and ends with @gmail.com
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.co(m)?$/;
    setIsValidEmail(emailRegex.test(email));
  };

  // handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // validate email when user changes the email input
    if (name === "emailId") {
      if (value.trim() === "") {
        setIsValidEmail(true);
      } else {
        validateEmail(value);
      }
    }

    // validate password when user changes the password input
    if (name === "password") {
      validatePassword(value);
    }

    // update form data state
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission behavior

    try {
      // send signup request to the server
      const res = await fetch("http://localhost:5555/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        // show success message and redirect to signin page
        showSnackBar("successfully registered, please login now", "success");
        setTimeout(() => {
          navigate("/signin", { state: { email: formData.emailId } });
        }, 1000);
      } else {
        // show error message if server responds with an error
        showSnackBar(result.message, "error");
      }
    } catch (err) {
      // handle unexpected errors
      showSnackBar(err.message, "warning");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full shadow-gray-400">
        {/* heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register <i className="fas fa-user"></i>
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Create a new account
        </p>

        {/* signup form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* username input */}
          <input
            type="text"
            name="userName"
            onChange={handleChange}
            placeholder="enter your username"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* email input */}
          <input
            type="email"
            name="emailId"
            onChange={handleChange}
            placeholder="enter your email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* show validation message if email is invalid */}
          {!isValidEmail && (
            <span className="text-sm text-red-400 ml-2">
              please enter a valid email
            </span>
          )}

          {/* password input */}
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder=" enter your password"
            required
            minLength={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* show validation message if password is invalid */}
          {!isValidPassword && (
            <span className="text-sm text-red-400 ml-2">
              please use at least 1 number and 1 special character
            </span>
          )}

          {/* submit button */}
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </form>

        {/* link to signin page */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-500 hover:underline font-bold text-lg"
          >
            Sign in
          </Link>
        </p>
      </div>
      {/* snackbar for notifications */}
      {snackBar.show && (
        <SnackBar
          className="bottom-5 left-1/2 transform -translate-x-1/2"
          message={snackBar.message}
          type={snackBar.type}
          onClose={() => setSnackBar((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default SignUp;
