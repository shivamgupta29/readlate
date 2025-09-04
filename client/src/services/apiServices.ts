import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // backend API URL
});
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
// Define the shape of the user registration data
interface AuthData {
  email?: string;
  password?: string;
}
export interface Article {
  id: number;
  user_id: number;
  url: string;
  title: string;
  summary: string;
  created_at: string;
}
export const fetchArticles = async (): Promise<Article[]> => {
  const response = await api.get("/articles");
  return response.data;
};
export const saveArticle = async (url: string): Promise<Article> => {
  const response = await api.post("/articles", { url });
  return response.data;
};
export const deleteArticle = async (id: number): Promise<void> => {
  await api.delete(`/articles/${id}`);
};
export const registerUser = (userData: AuthData) => {
  return api.post("/auth/register", userData);
};

export const loginUser = async (userData: AuthData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export default api;
