// Firebase config placeholder. Replace with your own config from Firebase Console.
const firebaseConfig = {
	apiKey: "AIzaSyA21RsfIPSgkmdULpoqFyimKBXfzx4G3_Y",
	authDomain: "testapp1-a1eba.firebaseapp.com",
	projectId: "testapp1-a1eba",
	storageBucket: "testapp1-a1eba.firebasestorage.app",
	messagingSenderId: "711086274272",
	appId: "1:711086274272:web:df6d8974c03a5caae50285",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
