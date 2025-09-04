import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext"; // <-- FIX: Capitalized path
import Input from "../components/input"; // <-- FIX: Capitalized path
import {
  fetchArticles,
  saveArticle,
  deleteArticle,
  type Article,
} from "../services/apiServices"; // <-- FIX: Corrected path and capitalized 'Article' type

const DashboardPage: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    try {
      const newArticle = await saveArticle(url);
      setArticles((prevArticles) => [newArticle, ...prevArticles]);
      setUrl("");
    } catch (error) {
      console.error("Failed to save article:", error);
    }
    setUrl("");
  };

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }
    try {
      await deleteArticle(id);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Your Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
          Logout
        </button>
      </header>

      {/* Save Article Form */}
      <section style={{ margin: "2rem 0" }}>
        <h2>Save a New Article</h2>
        <form
          onSubmit={handleSaveArticle}
          style={{ display: "flex", gap: "1rem" }}
        >
          <Input
            label=""
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
          />
          <button type="submit" style={{ padding: "0.5rem 1.5rem" }}>
            Save
          </button>
        </form>
      </section>

      {/* Articles List */}
      <section>
        <h2>Your Articles</h2>
        <div>
          {loading ? (
            <p>Loading articles...</p>
          ) : articles.length === 0 ? (
            <p>You haven't saved any articles yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {articles.map((article) => (
                <li
                  key={article.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{article.title}</h3>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read Original
                  </a>
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    style={{
                      background: "#ff4d4d",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
