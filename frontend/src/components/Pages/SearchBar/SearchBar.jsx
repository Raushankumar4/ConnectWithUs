// components/SearchBar.js
import React, { useState } from "react";

const SearchBar = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="border rounded-full py-2 px-4 text-gray-700"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-black text-white rounded-full"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
