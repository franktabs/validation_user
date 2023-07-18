// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseApp | FirebaseOptions = {
    apiKey: "AIzaSyBgt7VYMvYxir1E6AU5Rt1AW6Fq3qvbzH8",
    authDomain: "analog-antler-380217.firebaseapp.com",
    databaseURL: "https://analog-antler-380217-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "analog-antler-380217",
    storageBucket: "analog-antler-380217.appspot.com",
    messagingSenderId: "629446563532",
    appId: "1:629446563532:web:a938b67314952e416b9469",
    measurementId: "G-G706M9B1H3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app,"gs://analog-antler-380217.appspot.com/");


