require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Use the authentication routes with the prefix /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
