import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"


var firebaseConfig = {
    apiKey: "AIzaSyCMo9oMypwSdTzIwWqAIRGvSb9tjBlsdGI",
    authDomain: "test-cf74b.firebaseapp.com",
    databaseURL: "https://test-cf74b.firebaseio.com",
    projectId: "test-cf74b",
    storageBucket: "test-cf74b.appspot.com",
    messagingSenderId: "971087808714",
    appId: "1:971087808714:web:3d75fdbefc923bd5400c33"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase;