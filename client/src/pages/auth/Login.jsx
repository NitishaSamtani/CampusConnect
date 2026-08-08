import "./Auth.css";
import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { GoogleLogin, } from "@react-oauth/google";
import { googleLogin, } from "../../services/authService";

const Login = () => {
    const navigate = useNavigate();
    const { loadUser } = useAuth();

    const [formData, setFormData] =
        useState({
            email: "",
            password: "",
        });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await loginUser(formData);

    console.log("Login successful:", response);

    await loadUser();

    navigate("/dashboard");
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    console.error("Error request:", error.request);

    alert(
      error.response?.data?.message ||
      error.message ||
      "Login failed. Check the browser console."
    );
  }
};
    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1 className="logo">
                    CampusConnect
                </h1>

                <p className="subtitle">
                    Welcome Back
                </p>

                <form
                    onSubmit={handleSubmit}
                >
                    <input
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                    />

                    <input
                        className="auth-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    <button
                        className="primary-btn"
                    >
                        Login
                    </button>
                </form>

                <div className="divider">
                    OR
                </div>

                <GoogleLogin
                    onSuccess={async (
                        credentialResponse
                    ) => {

                        try {

                            await googleLogin(
                                credentialResponse.credential
                            );

                            await loadUser();

                            navigate(
                                "/dashboard"
                            );

                        } catch (error) {

                            console.log(error);

                        }

                    }}
                    onError={() => {
                        console.log(
                            "Google Login Failed"
                        );
                    }}
                />

                <div className="bottom-link">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="auth-link"
                    >
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;