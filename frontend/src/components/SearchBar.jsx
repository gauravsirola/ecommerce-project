import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() === "") return;
    // Navigate to a global search results page (or categories filtered page)
    navigate(`/categories?search=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex items-center border rounded-lg overflow-hidden w-full max-w-md">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow px-4 py-2 focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
