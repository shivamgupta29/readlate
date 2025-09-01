import React from "react";

// Define the types for the component's props
// interface is used for better type-checking and readability
interface InputProps {
  label: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}
// A reusable input component
// This component can be used for various input fields like text, email, and password
// this is a functional component that accepts props defined in InputProps interface
const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: "300px", padding: "0.5rem", fontSize: "1rem" }}
      />
    </div>
  );
};

export default Input;
