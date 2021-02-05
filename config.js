import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyC7VQYUcOhFMyhKRmv9DIM_9wbudtYt1xg",
    authDomain: "booksanta-565c1.firebaseapp.com",
    projectId: "booksanta-565c1",
    storageBucket: "booksanta-565c1.appspot.com",
    messagingSenderId: "238960567296",
    appId: "1:238960567296:web:0121fbb8d9f73c18af64e5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()
