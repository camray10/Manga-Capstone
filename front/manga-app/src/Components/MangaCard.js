import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MangaApi from '../API/api';
import moment from 'moment'
import "../Styles/MangaCard.css";

function MangaCard() {
  const [manga, setManga] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { mangaId } = useParams();

  useEffect(() => {
    const fetchMangaById = async () => {
      try {
        const mangaData = await MangaApi.getMangaById(mangaId);
        console.log('API Response:', mangaData); // Log the response
        setManga(mangaData);
      } catch (error) {
        console.error('Error fetching manga data:', error);
      }
    };

    const fetchRatings = async () => {
      try {
        const ratingsData = await MangaApi.getRatingsForManga(mangaId);
        console.log('Ratings:', ratingsData); // Log the response
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching ratings data:', error);
      }
    };

    fetchMangaById();
    fetchRatings();
  }, [mangaId]);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleRatingSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await MangaApi.getCurrentUser(); // get the current user
      const newRating = await MangaApi.addRating(
        user.token, // pass the user's token as the first argument
        mangaId,
        rating
      );
      console.log('New rating:', newRating);
      setRatings([...ratings, newRating]);
      setRating(0);
    } catch (error) {
      console.error('Error adding rating:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleRatingDelete = async (id) => {
    setLoading(true);
    try {
      await MangaApi.removeRating(id);
      console.log('Rating deleted:', id);
      setRatings(ratings.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-container">
      {manga && (
        <>
          <h1 className="title">{manga.title.en}</h1>
          <img className="cover" src={manga.coverArt} alt={manga.title.en} />
          <p className="description">{manga.description.en}</p>
          <p className="authors">Authors: {manga.authors.join(', ')}</p>
          <p className="artists">Artists: {manga.artists.join(', ')}</p>
          <p className="genres">Genres: {manga.genres.join(', ')}</p>
          <p className="tags">Tags: {manga.tags.join(', ')}</p>
          <p className="status">Status: {manga.status}</p>
          <p className="content-rating">Content Rating: {manga.contentRating}</p>
          <p className="last-updated">Updated: {moment(manga.lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}</p>

          <h2>Ratings</h2>
          <form onSubmit={handleRatingSubmit}>
            <label>
              Rate this manga:
              <select value={rating} onChange={handleRatingChange} disabled={!manga}>
              <option value={0}>--</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </label>
        <button type="submit" disabled={loading || !manga}>
          Submit
        </button>
      </form>
      {ratings.length === 0 ? (
        <p>No ratings yet.</p>
      ) : (
        <ul>
          {ratings.map((r) => (
            <li key={r.id}>
              {r.score} by User {r.userId}{' '}
              {loading ? (
                <span>Loading...</span>
              ) : (
                <button onClick={() => handleRatingDelete(r.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )}
</div>
);
}

export default MangaCard;