import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
import { serverEnv } from "./src/env/schema.mjs";

const firebaseConfig = {
  apiKey: serverEnv.FIREBASE_API_KEY,
  authDomain: "rails-65094.firebaseapp.com",
  projectId: "rails-65094",
  storageBucket: "rails-65094.appspot.com",
  messagingSenderId: "326804228463",
  appId: "1:326804228463:web:cf04404675e5518b48009a",
  measurementId: "G-K9NZRT21DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);