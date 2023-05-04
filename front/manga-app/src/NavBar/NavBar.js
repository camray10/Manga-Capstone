import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import UserContext from "../Hooks/UserContext"
import "../Styles/NavBar.css";

function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext) || {};
  console.debug("NavBar", "currentUser=", currentUser);

  function loggedInNav() {
    return (
      <ul className="navbar-login">
        <li className="nav-item">
          <NavLink className="nav-link" to="/manga">
            MangaList
          </NavLink>
        </li>
        {currentUser && (
          <li className="nav-item">
            <NavLink className="nav-link" to="/profile">
              Profile
            </NavLink>
          </li>
        )}
        <li className="nav-item">
          <Link className="nav-link" to="/" onClick={logout}>
            Log out {currentUser?.first_name || currentUser?.username}
          </Link>
        </li>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul className="navbar-logout">
        <li className="nav-item">
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/manga">
            MangaList
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav className="Navigation-bar">
      <NavLink className="navbar-brand" to="/">
        Manga🍊
      </NavLink>
      {currentUser ? loggedInNav() : loggedOutNav()}
    </nav>
  );
}

export default NavBar;
