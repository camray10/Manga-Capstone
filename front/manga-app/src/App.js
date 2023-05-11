import Routes from './Routes';
import { BrowserRouter as Router} from "react-router-dom";
import React, { useState, useEffect } from "react";
import NavBar from './NavBar/NavBar';
import jwtDecode from "jwt-decode";
import useLocalStorage from './Hooks/useLocalStorage';
import UserContext from './Hooks/UserContext';
import MangaApi from './API/api';

export const TOKEN_ID = "manga-token";

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_ID);
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);

  console.debug(
      "App",
      "infoLoaded=", infoLoaded,
      "currentUser=", currentUser,
      "token=", token,
  );

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);
    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwtDecode(token);
          MangaApi.token = token;
          let currentUser = await MangaApi.getCurrentUser(username);
          setCurrentUser({ ...currentUser, token });
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  /** Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

    /** Handles site-wide signup. */
    async function signup(signupData) {
      try {
        const { token, user } = await MangaApi.signup(signupData);
        setToken(token);
        setCurrentUser(user); // Set the currentUser with the returned user object
        return { success: true };
      } catch (errors) {
        console.error("signup failed", errors);
        return { success: false, errors };
      }
    }
  
    /** Handles site-wide login. */
    async function login(loginData) {
      try {
        const { token, user } = await MangaApi.login(loginData);
        setToken(token);
        setCurrentUser(user); // Set the currentUser with the returned user object
        return { success: true };
      } catch (errors) {
        console.error("login failed", errors);
        return { success: false, errors };
      }
    }

  return (
    <div className="App">
      <Router>
      <UserContext.Provider value={{currentUser, setCurrentUser}}>
            <NavBar logout={logout} />
            <Routes signup={signup} login={login} token={token} />
      </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
