import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

import App from "./App";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/signup";
import DashboardPage from "./pages/dashboard";
import "./index.css";

// Define the routes for the application
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
