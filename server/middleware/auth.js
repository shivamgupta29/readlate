const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const actualToken = token.split(" ")[1];

  if (!actualToken) {
    return res.status(401).json({ message: "Token format is invalid" });
  }

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
