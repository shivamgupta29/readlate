import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // backend API URL
});

// Define the shape of the user registration data
interface AuthData {
  email?: string;
  password?: string;
}

export const registerUser = (userData: AuthData) => {
  return api.post("/auth/register", userData);
};

export const loginUser = async (userData: AuthData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export default api;
