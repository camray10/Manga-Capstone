import React, { useState, useEffect } from "react";
import MangaApi from "../API/api";
import { Link } from "react-router-dom";
import "../Styles/MangaTitles.css";
import Spinner from "../Hooks/Spinner";

function MangaTitles() {
  const [mangaList, setMangaTitles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderBy, setOrderBy] = useState({ rating: "desc" });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const limit = 100;

  useEffect(() => {
    const fetchMangaTitles = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching page ${currentPage}...`);
        const result = await MangaApi.getAllTitles(currentPage, limit, orderBy, searchQuery);
        setMangaTitles(result.data);
        setTotalPages(result.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching manga titles:", error);
        setIsLoading(false);
      }
    };

    fetchMangaTitles();
  }, [currentPage, orderBy, searchQuery, limit]);

  const handleOrderByChange = (event) => {
    const value = event.target.value;
    const parts = value.split(":");
    setOrderBy({ [parts[0]]: parts[1] });
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
  };

  return (
    <div className="manga-titles-container">
      {isLoading && <Spinner />}
      <div className="manga-titles-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous Page
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next Page
        </button>
      </div>
      <div className="manga-titles-order">
        <select
          id="mangaTitlesOrderBy"
          value={`${Object.keys(orderBy)[0]}:${orderBy[Object.keys(orderBy)[0]]}`}
          onChange={handleOrderByChange}
        >
  <option value="title:asc">Title A-Z</option>
  <option value="title:desc">Title Z-A</option>
  <option value="latestUploadedChapter:desc">Latest Chapter</option>
  <option value="rating:desc">Rating</option>
</select>

      </div>
      <div className="manga-titles-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search manga titles"
        />
        <button onClick={handleSearch}>Search</button>
      </div>


      <h1>Manga List</h1>
      <ul className="manga-titles-list">
  {mangaList.map((manga) => (
    <li key={manga.id} className="manga-titles-item">
     <Link to={`/manga/${manga.id}`} className="link">
  <img src={manga.coverArt} alt={manga.title} />
  <div className="title">{manga.title ? manga.title : ""}</div>
</Link>
    </li>
  ))}
</ul>
      <div className="manga-titles-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous Page
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default MangaTitles;