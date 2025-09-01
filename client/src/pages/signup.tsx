import React from "react";
import Input from "../components/input";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/apiServices";
const SignupPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await registerUser({ email, password });
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
    console.log("Registered with:", { email, password });
  };
  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h1>Signup Page</h1>
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
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          placeholder="Enter the same password"
        />
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
