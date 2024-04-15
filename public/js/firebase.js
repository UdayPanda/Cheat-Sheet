let firebaseConfig = {
    apiKey: "AIzaSyBPBhNGtxOkz1cv1n8CueVT7C_BXEv7mfk",
    authDomain: "cheatsheet-45473.firebaseapp.com",
    projectId: "cheatsheet-45473",
    storageBucket: "cheatsheet-45473.appspot.com",
    messagingSenderId: "364968396253",
    appId: "1:364968396253:web:2f2536bcdd9bedfd8c6234",
    measurementId: "G-VC8NNMTBFH"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  let db = firebase.firestore();

  db.settings({ timestampsInSnapshots: true });