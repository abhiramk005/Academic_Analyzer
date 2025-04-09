import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios"

function Login() {
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    localStorage.setItem("role", role); // Store role in localStorage

    console.log(userId, password)
    try {
      const response = await fetch("http://localhost:3001/api/auth/signin", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ role, userId, password })  // Ensure the field names match the backend
      });

      if (!response.ok) {
          throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("userId", userId);
      if (response.ok) {
        if (role === "student") {
          navigate("/studlogin");
        } else {
          navigate("/adminlogin");
        }
      }
      console.log("Login successful:", data);

    } catch (error) {
      setError(error.message);
        console.error("Error:", error);
    }finally {
      setLoading(false);
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

          <button type="submit" className="login-btn">{loading ? "Loading.." : "Login"}</button>
        </form>
        
        {/* <p className="register-text">Forgot password?</p> */}
        <div>
          {error && <p className="error-msg">{error}</p>}
        </div>
        
      </div>
      
    </div>
    
  );
}

export default Login;
