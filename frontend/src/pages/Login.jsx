import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const accessToken = response.access_token;
        if (!accessToken) {
          throw new Error("Google access token is missing");
        }

        const res = await fetch(`${backendUrl}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: accessToken }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error logging in with Google");
        }

        localStorage.setItem("token", data.token);

        navigate("/dashboard");
      } catch (err) {
        console.error("Google login failed:", err.message);
        alert(err.message);
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      alert("Google login failed. Please try again.");
    },
    scope: "openid profile email", // Request user profile and email
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send login request to the backend
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error logging in");
      }

      // Store the token in localStorage
      localStorage.setItem("token", data.token);

      // Redirect to a protected route or dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.message);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen pt-20 pb-16 px-4">
        <div className="w-full max-w-md relative">
          {/* Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>

          {/* Login Form */}
          <div className="relative bg-gray-900/80 p-8 rounded-lg backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 font-sans mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400 font-sans">
                Sign in to continue your journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="group">
                <label
                  className="block text-gray-300 text-sm font-sans mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200 font-sans transition-all duration-300"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label
                  className="block text-gray-300 text-sm font-sans mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200 font-sans transition-all duration-300"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-700 bg-gray-800/50"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-sans">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 font-sans"
                >
                  Forgot Password?
                </a>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold transform hover:translate-y-[-1px] transition-all duration-300 font-sans ${
                  isLoading
                    ? "opacity-75 cursor-wait"
                    : "hover:from-purple-600 hover:to-blue-600"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-gray-400 font-sans">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </form>

            {/* Social Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400 font-sans">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-all duration-300 font-sans"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
