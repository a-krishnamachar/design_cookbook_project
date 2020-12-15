import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyBzIJuKQbc6kssGhM6153KwEcdIG7SxNnk",
  authDomain: "thecookbook-b1469.firebaseapp.com",
  projectId: "thecookbook-b1469",
  storageBucket: "thecookbook-b1469.appspot.com",
  messagingSenderId: "1056794751543",
  appId: "1:1056794751543:web:7213fc50b8f2d5c54e85b2",
  measurementId: "G-5PCJGKGJML",
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIS */

    this.auth = app.auth();
    this.db = app.firestore();
  }

  /* Auth API */
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then((snapshot) => {
            const dbUser = snapshot.data();

            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  /* User API */

  user = (uid) => this.db.doc(`userdata/${uid}`);

  users = () => this.db.collection("userdata");

  /* Recipe API */

  recipe = (rid) => this.db.doc(`recipes/${rid}`);

  recipes = () => this.db.collection("recipes");

  addRecipe(fields){
    //Create the empty recipe document
    var newRecipe = this.db.collection("recipes").doc();
    //Add data that was prepared beforehand
    newRecipe.set(fields);

    //Add the new recipe's id to the userdata cookbook field
    this.db.collection("userdata").doc(`userdata/${fields.creator}`).update({
      cookbook: Firebase.firestore.FieldValue.arrayUnion(newRecipe.getId())
    });
  }

  updateRecipe = (rid,fields) => this.recipe(rid).set(fields);

  addFriend(uid1,uid2){
    this.user(uid1).update({
      friends: Firebase.firestore.FieldValue.arrayUnion(uid2)
    });
    this.user(uid2).update({
      friends: Firebase.firestore.FieldValue.arrayUnion(uid1)
    });
  }

  removeFriend(uid1,uid2){
    this.user(uid1).update({
      friends: Firebase.firestore.FieldValue.arrayRemove(uid2)
    });
    this.user(uid2).update({
      friends: Firebase.firestore.FieldValue.arrayRemove(uid1)
    });
  }

  removeRecipe(rid){
    var uid;
    this.recipe(rid).get()
      .then(doc=>{
        uid = doc.data().creator;
      });
    this.recipe(rid).delete()
    this.user(uid).update({
      cookbook: Firebase.firestore.FieldValue.arrayRemove(rid)
    });
  }
}

export default Firebase;
