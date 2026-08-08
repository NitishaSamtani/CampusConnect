import "./Auth.css";
import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Register = () => {

    const navigate =
        useNavigate();

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: "",
            college: "",
            branch: "",
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
    const response = await registerUser(formData);

    console.log("Registration successful:", response);

    navigate("/login");
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);

    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    console.error("Error request:", error.request);

    alert(
      error.response?.data?.message ||
      error.message ||
      "Registration failed. Check the browser console."
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
                    Create Account
                </p>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >
                    <input
                        className="auth-input"
                        name="name"
                        placeholder="Name"
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        className="auth-input"
                        name="email"
                        placeholder="Email"
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        className="auth-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        className="auth-input"
                        name="college"
                        placeholder="College"
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        className="auth-input"
                        name="branch"
                        placeholder="Branch"
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        className="auth-input"
                        name="graduationYear"
                        placeholder="Graduation Year"
                        onChange={
                            handleChange
                        }
                    />

                    <button className="primary-btn">
                        Register
                    </button>
                </form>

                <div className="divider">
                    OR
                </div>

                <button className="google-btn">
                    <FcGoogle />
                    Continue with Google
                </button>

                <div className="bottom-link">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="auth-link"
                    >
                        Login
                    </Link>
                </div>

            </div>

        </div>
    );
};

export default Register;