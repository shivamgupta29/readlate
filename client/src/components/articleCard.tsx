import React from "react";
import { type Article } from "../services/apiServices";

interface ArticleCardProps {
  article: Article;
  onDelete: (id: number) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onDelete }) => {
  return (
    <li className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold mb-1">{article.title}</h3>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Read Original
        </a>
      </div>
      <button
        onClick={() => onDelete(article.id)}
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
      >
        Delete
      </button>
    </li>
  );
};

export default ArticleCard;
