import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {
            setLoading(true);

            const response = await login({
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);

            window.dispatchEvent(new Event("authchange"));

            navigate("/");

        } catch (error) {

            alert("Invalid Email or Password");
            console.error(error);

        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Login to continue shopping</p>

                <form onSubmit={handleLogin} className="auth-form">

                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;