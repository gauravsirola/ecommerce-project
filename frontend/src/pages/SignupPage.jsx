import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isLoggedIn } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    dob: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Redirect if logged in
  useEffect(() => {
    if (isLoggedIn) navigate("/categories");
  }, [isLoggedIn, navigate]);

  // Minimum DOB = user must be 14 years old
  const today = new Date();
  const minDob = new Date(
    today.getFullYear() - 14,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{10,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setValidationError(
        "Password must be at least 10 characters long, include one uppercase, one lowercase, one number, and one special character."
      );
      return;
    }

    if (new Date(formData.dob) > new Date(minDob)) {
      setValidationError("You must be at least 14 years old to sign up.");
      return;
    }

    try {
      const resultAction = await dispatch(signup(formData));
      if (signup.fulfilled.match(resultAction)) navigate("/categories");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Create Your Account
      </h2>

      {(error || validationError) && (
        <p className="text-red-500 text-center mb-3 text-sm font-medium">
          {error || validationError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name (optional)"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none"
        />

        <select
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none bg-white text-gray-700"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          pattern="[0-9]{10}"
          title="Enter a 10-digit phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none"
        />

        {/* Date of Birth Label above input */}
        <div>
          <label
            htmlFor="dob"
            className="block text-gray-600 text-xs font-medium mb-1"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            required
            max={minDob}
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none text-gray-700"
          />
        </div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full mt-3 py-2 text-white text-sm font-medium rounded-lg transition-all duration-300 ${
            status === "loading"
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-blue-700 active:bg-blue-800 shadow"
          }`}
        >
          {status === "loading" ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-600 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-indigo-600 font-medium hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
};

export default SignupPage;
