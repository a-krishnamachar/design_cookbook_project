import React, { Component } from "react";

import { Link, withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import Button from "@material-ui/core/Button";
import EmailIcon from "@material-ui/icons/Email";
import { withFirebase } from "../Firebase";

import { compose } from "recompose";

const INITIAL_STATE = {
  email: "",
  name: "",
  password: "",
  error: {
    isError: false,
    message: "",
  },
};

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
  }

  onSubmit = (event) => {
    event.preventDefault();

    const { email, password, name } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        //When signed up successfully create a user object and add it to userdata collection in Firestore
        const friends = [];
        const cookbook = [];
        return (
          this.props.firebase.user(authUser.user.uid).set({
            name,
            email,
            friends,
            cookbook,
          }),
          { merge: true }
        );
      })
      .then(() => {
        //When signed up successfully reroute the user to the home page.
        this.props.history.push(ROUTES.HOME);
        this.setState({
          ...INITIAL_STATE,
        });
      })
      .catch((err) => {
        this.setState({
          error: {
            isError: true,
            message: err.message,
          },
        });
      });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, name, error } = this.state;
    return (
      <div id="signup">
        <h2> Sign Up </h2>

        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <AccountCircle />
          </Grid>
          <Grid item>
            <TextField
              id="name"
              name="name"
              label="Name"
              onChange={this.onChange}
              value={name}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <EmailIcon />
          </Grid>
          <Grid item>
            <TextField
              id="email"
              name="email"
              label="Email"
              onChange={this.onChange}
              value={email}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <LockIcon />
          </Grid>
          <Grid item>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={this.onChange}
              value={password}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
          <Button
            onClick={this.onSubmit}
            disabled={!email || !password || !name}
            variant="contained"
            color="primary"
          >
            Sign Up
          </Button>
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
          Already have an account?
          <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </Grid>

        {error.isError && <p>{error.message}</p>}
      </div>
    );
  }
}

export default compose(withFirebase, withRouter)(SignUp);
