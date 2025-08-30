const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { scrapeArticle } = require("../scrapper");
const db = require("../db");

// @route   POST /api/articles
// @desc    Save a new article
// @access  Private
router.post("/", auth, async (req, res) => {
  const { url } = req.body;
  const userId = req.user.id;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const articleData = await scrapeArticle(url);

    if (!articleData || !articleData.content) {
      return res.status(500).json({ message: "Failed to scrape the article." });
    }

    // Save the scraped article to the database
    const { title, content } = articleData;
    const newArticle = await db.query(
      "INSERT INTO articles (user_id, url, title, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, url, title, content]
    );

    res.status(201).json(newArticle.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
