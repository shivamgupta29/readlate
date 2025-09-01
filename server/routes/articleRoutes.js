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

// @route GET /api/articles
// @desc  Get all articles for the authenticated user
// @access Private
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const articles = await db.query(
      "SELECT * FROM articles WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(articles.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/articles/:id
// @desc  Get a specific article by ID
// @access Private
router.get("/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const articleId = req.params.id;
  try {
    const article = await db.query(
      "SELECT * FROM articles WHERE id = $1 AND user_id = $2",
      [articleId, userId]
    );
    if (article.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/articles/:id
// @desc  Delete a specific article by ID
// @access Private
router.delete("/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const articleId = req.params.id;
  try {
    const article = await db.query(
      "SELECT * FROM articles WHERE id = $1 AND user_id = $2",
      [articleId, userId]
    );
    if (article.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    await db.query("DELETE FROM articles WHERE id = $1 AND user_id = $2", [
      articleId,
      userId,
    ]);

    res.json({ message: "Article deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
