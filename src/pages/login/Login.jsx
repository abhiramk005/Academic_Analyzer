import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("role", role); // Store role in localStorage

    if (role === "student") {
      navigate("/studlogin");
    } else {
      navigate("/adminlogin");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        {/* Role selection buttons */}
        <div className="role-toggle">
          <button className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>
            Student
          </button>
          <button className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <label>UserID</label>
          <input
            type="text"
            placeholder="Enter UserID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="register-text">Forgot password?</p>
      </div>
    </div>
  );
}

export default Login;
