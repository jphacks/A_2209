import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc } from "firebase/firestore";
import firebaseConfig from '../apis';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function userInfoRegistration(user:any) {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  if(!(docSnap.exists())){
    const friends = {
      blocked: [],
      friends: [],
      receivedRequests: [],
      sentRequests: [],
    }
    const signal = {
      initialBearing: 0,
      initialLatitude: 0,
      initialLongitude: 0,
      mode: '',
      offset: 0,
      playing: false,
      routing: false
    }
    const attributes = {
      email: user.email,
      uid: user.uid,
    }
    try {
      setDoc(doc(db, "users", user.uid, "friends", "friends"), friends);
      setDoc(doc(db, "users", user.uid, "signal", "signal"), signal);
      setDoc(doc(db, "users", user.uid, "userdata", "attributes"), attributes);

      console.log("Document written successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

export default userInfoRegistration;
