import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Components/Home';
import LoginForm from './LoginSignup/Login';
import SignupForm from './LoginSignup/Signup';
import ProfileForm from './Profile/ProfileEdit';
import PrivateRoute from './Hooks/PrivateRoute';
import MangaTitles from './Components/MangaTitles';
import MangaCard from './Components/MangaCard';
import Profile from './Profile/Profile';

function Routes({ signup, login}) {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <LoginForm login={login} />
      </Route>
      <Route exact path="/signup">
        <SignupForm signup={signup} />
      </Route>
      <Route exact path="/manga">
        <MangaTitles />
      </Route>
      <Route exact path="/manga/:mangaId">
        <MangaCard />
      </Route>
      <PrivateRoute exact path="/profile">
        <Profile />
      </PrivateRoute>
      <PrivateRoute exact path="/profile/edit">
        <ProfileForm />
      </PrivateRoute>
    </Switch>
  );
}

export default Routes;
