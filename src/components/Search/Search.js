import React from "react";
import Card from "../Card/Card";
import { Header, PageAlign, PageCardAlign } from "../../styles/styled";
import { AuthUserContext, withAuthorization } from "../Session";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";

//dummy data
import User from "../../toy-data/food-data";

//search bar
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      recipeList: [],
      userMap: {},
      search: null,
    };
  }

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
  };

  // componentWillUnmount() {
  //   console.log("current Search", this.state.search)
   
  // }

  componentDidMount() {

    let { search } = this.props.location;
    console.log("search 2", search.substring(1));
     search = search.substring(1);
    if (search != "") {
      this.setState({search: search})
    }

    const userMap = {};
    const users = this.props.firebase.users();
    users.get().then((querySnapshot) => {
      querySnapshot.forEach((userDoc) => {
        let data = userDoc.data();
        userMap[userDoc.id] = {
          cookbook: data.cookbook,
          email: data.email,
          name: data.name,
          friends: data.friends,
        };
      });
      this.setState({ userMap: userMap });
    });
    let recipeList = [];
    const recipes = this.props.firebase.recipes();
    recipes.get().then((querySnapshot) => {
      querySnapshot.forEach((userDoc) => {
        let recipe = {};
        var data = userDoc.data();
        recipe.id = userDoc.id;
        recipe.creatorId = data.creator;
        recipe.creatorName = this.state.userMap[data.creator].name;
        recipe.difficulty = data.difficulty;
        recipe.ingredients = data.ingredients;
        recipe.instructions = data.instructions;
        recipe.time = data.time;
        recipe.title = data.title;
        recipe.image = data.image;
        recipeList.push(recipe);
      });
      recipeList = recipeList.reverse();
      this.setState({ recipeList: recipeList });
    });
  }

  render() {
    
    console.log("recipe LIST", this.state.recipeList)

    return (
      <AuthUserContext.Consumer>
        {(authUser) => {
          const allRecipeCards = this.state.recipeList
            .filter((recipe) => {
              console.log("inidiv recipe", recipe);
              console.log("this.state.search", this.state.search);
              if (this.state.search == null)
                // if nothing is currently in searchbar, return everything
                return recipe;
              else if (
                recipe.title
                  .toLowerCase()
                  .includes(this.state.search.toLowerCase()) || //search for dish title
                recipe.creatorName
                  .toLowerCase()
                  .includes(this.state.search.toLowerCase()) //search for dish creator
              ) {
                return recipe;
              } else {
                // console.log("ingredients", recipe.ingredients)
                for (const ingredient of Object.values(recipe.ingredients)) {
                  if (ingredient != "undefined") {
                    if (
                      ingredient.ingredient.food
                        .toLowerCase()
                        .includes(this.state.search.toLowerCase())
                    ) {
                      //search for dish ingredient
                      return recipe;
                    }
                  }
                }
              }
            })
            .map((recipe) => <Card search={this.state.search} recipe={recipe} key={`${recipe.id}`} />);

          return (
            <div>
              <Header> Search </Header>

              <PageAlign>
                <TextField
                  placeholder={"Search dish, creator, ingredient..."}
                  onChange={(e) => this.searchSpace(e)}
                  value={this.state.search}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <PageCardAlign>{allRecipeCards}</PageCardAlign>
              </PageAlign>
            </div>
          );
        }}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Search);
