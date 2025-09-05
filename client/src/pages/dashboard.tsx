import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import Input from "../components/input";
import ArticleCard from "../components/articleCard"; // <-- Import the new component
import {
  fetchArticles,
  saveArticle,
  deleteArticle,
  type Article,
} from "../services/apiServices";

const DashboardPage: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        setError("Could not load your articles.");
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setError("");
    try {
      const newArticle = await saveArticle(url);
      setArticles([newArticle, ...articles]);
      setUrl("");
    } catch (error) {
      setError("Could not save the article.");
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    try {
      await deleteArticle(id);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      setError("Could not delete the article.");
    }
  };

  const handleLogout = () => {
    if (authContext) authContext.logout();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Logout
        </button>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Save a New Article</h2>
        <form onSubmit={handleSaveArticle} className="flex items-center gap-4">
          <div className="flex-grow">
            <Input
              label=""
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 self-end"
          >
            Save
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Articles</h2>
        <div>
          {loading ? (
            <p>Loading articles...</p>
          ) : articles.length === 0 ? (
            <p className="text-gray-500">You haven't saved any articles yet.</p>
          ) : (
            <ul className="space-y-4">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
