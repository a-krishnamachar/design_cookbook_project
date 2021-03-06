import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import HomePage from "../Home/Home.js";
import SearchPage from "../Search/Search.js";
import MyCookbookPage from "../MyCookbook/Cookbook.js";
import FriendsPage from "../Friends/Friends.js";
import SignIn from "../SignIn/SignIn.js";
import SignUp from "../SignUp/SignUp.js";
import AddPage from "../AddRecipe/AddPage.js";
import EditPage from "../EditRecipe/EditPage.js";
import Success from "../EditRecipe/Success.js";
import DetailedRecipeView from "../DetailedRecipeView/DetailedRecipeView";
import FriendsCookbook from "../FriendsCookbook/FriendsCookbook";

import * as ROUTES from "../../constants/routes";
import Navigation from "../Navigation";

import { withAuthentication, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase/index.js";
import { AuthUserContext } from "../Session";

const Nav = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) => (authUser ? <Navigation /> : null)}
    </AuthUserContext.Consumer>
  </div>
);

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Nav />

          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.SEARCH} component={SearchPage} />
          <Route path={ROUTES.MYCOOKBOOK} component={MyCookbookPage} />
          <Route path={ROUTES.FRIENDS} component={FriendsPage} />
          <Route path={ROUTES.SIGN_IN} component={SignIn} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.ADD_PAGE} component={AddPage} />
          <Route path={ROUTES.EDIT_PAGE} component={EditPage} />
          <Route path={ROUTES.SUCCESS} component={Success} />
          <Route
            path={ROUTES.DETAILED_RECIPE_VIEW}
            component={DetailedRecipeView}
          />
          <Route path={ROUTES.FRIENDS_COOKBOOK} component={FriendsCookbook} />
        </div>
      </Router>
    );
  }
}

export default withAuthentication(App);
