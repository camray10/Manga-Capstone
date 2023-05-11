import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import MangaApi from '../API/api';
import { useContext } from 'react';
import UserContext from "../Hooks/UserContext";
import moment from 'moment'
import "../Styles/MangaCard.css";

function MangaCard() {
  const [manga, setManga] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentErrorMessage, setCommentErrorMessage] = useState('');
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { mangaId } = useParams();
  const { currentUser } = useContext(UserContext);


  useEffect(() => {
    const fetchMangaById = async () => {
      try {
        const mangaData = await MangaApi.getMangaById(mangaId);
        console.log('API Response:', mangaData); 
        setManga(mangaData);
      } catch (error) {
        console.error('Error fetching manga data:', error);
      }
    };

    const fetchRatings = async () => {
      try {
        const ratingsData = await MangaApi.getRatingsForManga(mangaId);
        console.log('Ratings:', ratingsData); 
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching ratings data:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await MangaApi.getCommentsForManga(mangaId);
        console.log('Comments:', commentsData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments data:', error);
      }
    };

    const fetchFavorites = async () => {
      if (currentUser) {
        try {
          const favoritesData = await MangaApi.getFavoritesForUser(currentUser.id);
          const isFav = favoritesData.some((favorite) => favorite.mangaId === mangaId);
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Error fetching favorites data:", error);
        }
      }
    };
    
    fetchMangaById();
    fetchRatings();
    fetchComments();
    fetchFavorites();
  }, [mangaId, currentUser]);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleRatingSubmit = async (event) => {
    event.preventDefault();
  
    if (!currentUser) {
      setErrorMessage('You must log in to rate a manga.');
      return;
    }
    const userRating = ratings.find((r) => r.userId === currentUser.id);
    if (userRating) {
      console.log("userRating:", userRating); // Log the userRating
      setErrorMessage('You have already rated this manga.');
      return;
    }
  
    setLoading(true);
    try {
      const newRating = await MangaApi.addRating(
        currentUser.token,
        currentUser.id,
        mangaId,
        rating
      );

      newRating.username = currentUser.username;
  
      setRatings([...ratings, newRating]);
      setRating(0);
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding rating:', error);
      setErrorMessage('Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };  

  const handleRatingDelete = async (userId) => {
    setLoading(true);
    try {
      await MangaApi.removeRating(userId, mangaId);
      console.log('Rating deleted:', mangaId);
      setRatings(ratings.filter((r) => r.userId !== userId));
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting rating:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star empty" />);
      }
    }
    return stars;
  };
  
  const handleCommentTextChange = (event) => {
    setNewCommentText(event.target.value);
  };
  
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
  
    if (!currentUser) {
      setCommentErrorMessage('You must log in to leave a comment.');
      return;
    }
  
    try {
      const newComment = await MangaApi.createComment(
        currentUser.token,
        currentUser.id,
        mangaId,
        newCommentText
      );
      newComment.username = currentUser.username;
      setComments([...comments, newComment]);
      setNewCommentText('');
      setCommentErrorMessage('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentErrorMessage('Failed to submit comment.');
    }
  };
  
  const handleCommentUpdate = async (commentId) => {
    try {
      const updatedComment = await MangaApi.updateComment(
        currentUser.token,
        commentId,
        currentUser.id,
        editedCommentText
      );
      setComments(
        comments.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setEditedCommentId(null);
      setEditedCommentText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  
  const handleEditedCommentTextChange = (event) => {
    setEditedCommentText(event.target.value);
  };
  
  const handleCommentDelete = async (commentId) => {
    try {
      await MangaApi.deleteComment(currentUser.token, commentId, currentUser.id);
      setComments(comments.filter((c) => c.id !== commentId));
      setCommentErrorMessage('');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  const toggleFavorite = async () => {
    if (!currentUser) {
      setErrorMessage("You must log in to add to favorites.");
      return;
    }
  
    try {
      if (isFavorite) {
        await MangaApi.removeFavorite(currentUser.token, currentUser.id, mangaId);
        setIsFavorite(false);
      } else {
        await MangaApi.addFavorite(currentUser.id, mangaId);
        setIsFavorite(true);
      }
      setErrorMessage("");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setErrorMessage("Failed to toggle favorite.");
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
          {isFavorite ? (
  <button className="favorite-button-remove" onClick={toggleFavorite}>
    Remove from Favorites
  </button>
) : (
  <button className="favorite-button-add" onClick={toggleFavorite}>
    Add to Favorites
  </button>
)}
{errorMessage === 'You must log in to add to favorites.' && (
  <div>
    <p>{errorMessage}</p>
    <p>
      <Link to="/login">Log in</Link> or{' '}
      <Link to="/signup">sign up</Link> to add to favorites.
    </p>
  </div>
)}

<div className="section-header">
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
    <button className="rating-button" type="submit" disabled={loading || !manga}>
    Submit
    </button>
  </form>
</div>
{errorMessage === 'You must log in to rate a manga.' && (
  <div>
    <p>{errorMessage}</p>
    <p>
      <Link to="/login">Log in</Link> or{' '}
      <Link to="/signup">sign up</Link> to rate a manga.
    </p>
  </div>
)}
{ratings.length === 0 ? (
  <p>No ratings yet.</p>
) : (
  <ul>
{ratings.map((r) => (
  <li key={r.id} className="rating-item">
    {renderStars(r.score)} - {r.username}{' '}
    {loading ? (
      <span>Loading...</span>
    ) : (
      currentUser && r.userId === currentUser.id && (
        <button
          className="delete-button"
          onClick={() => handleRatingDelete(r.userId, manga)}
        >
          X
        </button>
      )
    )}
  </li>
))}
  </ul>
)}

<div className="section-header">
      <h2>Comments</h2>
  <form onSubmit={handleCommentSubmit}>
    <label>
      Leave a comment:
    <input
      type="text"
      value={newCommentText}
      onChange={handleCommentTextChange}
      disabled={!manga}
    />
    </label>
    <button className="comment-button" type="submit" disabled={!manga}>
     Submit
    </button>
  </form>
</div>
{commentErrorMessage === 'You must log in to leave a comment.' && (
  <div>
    <p>{commentErrorMessage}</p>
    <p>
      <Link to="/login">Log in</Link> or{' '}
      <Link to="/signup">sign up</Link> to leave a comment.
    </p>
  </div>
)}

{comments.length === 0 ? (
  <p>No comments yet.</p>
) : (
  <ul>
    {comments.map((c) => (
      <li key={c.id} className="comment-item">
        {editedCommentId === c.id ? (
          <>
            <input
              type="text"
              value={editedCommentText}
              onChange={handleEditedCommentTextChange}
            />
            <button
              className="save-button"
              onClick={() => handleCommentUpdate(c.id)}
            >
              Save
            </button>
          </>
        ) : (
          <>
            {c.text} - {c.username}{' '}
            {currentUser && c.userId === currentUser.id && (
              <>
                <button
                  className="edit-button"
                  onClick={() => {
                    setEditedCommentId(c.id);
                    setEditedCommentText(c.text);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleCommentDelete(c.id)}
                >
                  X
                </button>
              </>
            )}
          </>
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

