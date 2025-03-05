import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPAtFwspVleCkprA7_8Ie2FLZpTuep-Lc",
  authDomain: "minutriciondiaria.firebaseapp.com",
  projectId: "minutriciondiaria",
  storageBucket: "minutriciondiaria.firebasestorage.app",
  messagingSenderId: "1071829435897",
  appId: "1:1071829435897:web:07a903c1b1bcb3351d2928",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
