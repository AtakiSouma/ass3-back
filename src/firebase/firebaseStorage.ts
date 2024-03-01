import admin, { ServiceAccount } from "firebase-admin";

import { getStorage } from "firebase-admin/storage";

import serviceAccount from "../firebase/asignment2.json";

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: "gs://asignment2-62c55.appspot.com",
});
const storage = getStorage().bucket();
export default storage;
