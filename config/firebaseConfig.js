import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZz8RXRjep4TGmTh3QZbD3x7wCn4XeadA",
  authDomain: "oceanic-event-management.firebaseapp.com",
  projectId: "oceanic-event-management",
  storageBucket: "oceanic-event-management.appspot.com",
  messagingSenderId: "358380377213",
  appId: "1:358380377213:web:2460846ae036820e128d14",
  measurementId: "G-9CD7EPRZPM",
};

export const firebaseApp = initializeApp(firebaseConfig);

// Upload document to firebase
export const uploadDocumentToFirebase = (storagePath, file) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, storagePath);

    const metadata = {
      contentType: file?.mimetype,
    };

    const uploadTask = uploadBytesResumable(storageRef, file?.buffer, metadata);

    // Register observers
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress observer
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Error observer
        console.error("Upload error:", error);
        reject(error);
      },
      () => {
        // Completion observer
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve({
              docUrl: downloadURL,
              docPath: storagePath,
              docType: file.mimetype,
            });
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

export const deleteDocumentFromFirebase = async (path) => {
  const storage = getStorage();
  const desertRef = ref(storage, path);
  return new Promise((resolve, reject) =>
    deleteObject(desertRef)
      .then(() => {
        resolve("File deleted successfully");
      })
      .catch((e) => {
        reject(e?.message);
      })
  );
};
