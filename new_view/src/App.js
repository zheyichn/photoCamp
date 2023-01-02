// eslint-disable react/react-in-jsx-scope
import "./App.css";
import CreatePostPage from "./components/Pages/CreatePostPage";
import FriendsSuggestionsPage from "./components/Pages/FriendsSuggestionPage";
import ShowAllUserPage from "./components/Pages/ShowAllUserPage";
import HomePage from "./components/Pages/HomePage";
import LandingPage from "./components/Pages/LandingPage";
import ProfilePage from "./components/Pages/ProfilePage";
import FollowerPage from "./components/Pages/FollowerPage";
import FollowingPage from "./components/Pages/FollowingPage";
// import Header from "./components/Activity/Header";
import CreateNewAccountPage from "./components/Pages/CreateNewAccountPage";
import ForgotPasswordPage from "./components/Pages/ForgotPasswordPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { Redirect } from "react-router-dom";
import { createContext } from "react";

export const Context = createContext();
// require("dotenv").config();

function App() {
  const loggedInUser = {
    userName: "admin",
    profile:
      "https://user-images.githubusercontent.com/93358071/191072941-5fc4a59a-49d0-4b18-80f9-573e38984fa8.jpeg",
    userId: 1,
  };

  return (
    <Context.Provider value={loggedInUser}>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/createnewaccount"
              element={<CreateNewAccountPage />}
            />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            {sessionStorage.getItem("app-token") !== null ? (
              <>
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/post" element={<CreatePostPage />} />
                <Route
                  path="/suggestion"
                  element={<FriendsSuggestionsPage />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/display" element={<ShowAllUserPage />} />
                <Route path="/following" element={<FollowingPage />} />
                <Route path="/follower" element={<FollowerPage />} />
              </>
            ) : null}
            {/* catch all: back to root page if not logged in */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </Context.Provider>
  );
}

export default App;
