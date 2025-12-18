
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkDLHM07-sm6KUSLBwaItJoq8zLdQ-yc4",
  authDomain: "gen-lang-client-0187343939.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0187343939-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0187343939",
  storageBucket: "gen-lang-client-0187343939.firebasestorage.app",
  messagingSenderId: "641856678180",
  appId: "1:641856678180:web:ef8ba3cded91b7eeacabb1",
  measurementId: "G-T6R5SLD8SC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
