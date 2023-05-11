import React, { useState, useEffect, useContext } from 'react';
import MangaApi from '../API/api';
import UserContext from '../Hooks/UserContext';
import { Link } from 'react-router-dom';
import '../Styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [favoriteMangas, setFavoriteMangas] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await MangaApi.getCurrentUser(currentUser.username);
        setUser(userData);
        fetchFavorites(currentUser.id);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    async function fetchFavorites(userId) {
      try {
        const favoritesData = await MangaApi.getFavoritesForUser(userId);
        console.log('Favorites Data:', favoritesData);

        if (favoritesData.length === 0) {
          // No favorites found for the user
          setFavoriteMangas([]);
        } else {
          const favoriteMangaPromises = favoritesData.map((favorite) =>
            MangaApi.getMangaById(favorite.mangaId)
          );
          const favoriteMangaData = await Promise.all(favoriteMangaPromises);

          setFavoriteMangas(favoriteMangaData);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }

    fetchUser();
  }, [currentUser.username, currentUser.id]);

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="Profile">
      <h1>{user.username}'s Profile</h1>
      <p>
        Hello, {user.firstName} {user.lastName}
      </p>
      <p>Member since: {new Date(user.registrationDate).toLocaleDateString()}</p>
      <div className="profile-actions">
        <Link to="/profile/edit" className="edit-profile-button">
          Edit Profile
        </Link>
      </div>
      {favoriteMangas.length > 0 ? (
        <div className="favorites-section">
          <h2>Your Favorites</h2>
          <ul className="favorite-list">
            {favoriteMangas.map((manga) => (
              <li key={manga.id}>
                <Link to={`/manga/${manga.id}`} className="favorite-link">
                  <img className="favorite-cover" src={manga.coverArt} alt={`${manga.title.en} cover art`} />
                  <div className="favorite-title">{manga.title.en}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You have no favorites yet.</p>
      )}
    </div>
  );
}

export default Profile;
