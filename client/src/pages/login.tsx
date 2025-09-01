import React from "react";
import Input from "../components/input";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/apiServices";
import { AuthContext } from "../context/authContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const authContext = React.useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "AuthContext is undefined, make sure you are using AuthProvider"
    );
  }
  const { login } = authContext;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="*********"
        />
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
