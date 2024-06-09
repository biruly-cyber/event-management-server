import admin from "firebase-admin";
import { JWT } from "google-auth-library";

// import serviceAccount from "../config/portfolio-33d8d-firebase-adminsdk-qqsjk-88979ca2ee.json";//  assert { type: "json" };
// import key from "../config/portfolio-33d8d-firebase-adminsdk-qqsjk-88979ca2ee.json";//  assert { type: "json" };
import axios from "axios";

let key = {
  type: "service_account",
  project_id: "portfolio-33d8d",
  private_key_id: "88979ca2ee089bf02bd93acaa72ff8074c71277c",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDY8sYOBlrL8qff\nrLArcjMlYeXDK0ezkMA6+pYp+i+QTDcDM6vnidnwgT1mvjUGI1QunRYtcQk9lBXm\nPGzbQ07nWPCDwqyR6Hu7RtLBNEwlADU9hRl2CVkIw7r1FQzm4J14DhhRxn+HhV7M\nFdOkgo605WP2Kn4EgkBI8mX+SHmlier4DCqCHykWR57qy5zPXzqhRTiLtuhP4uIC\n4o6gZOHN7HYMSZKERbxla7BPy8irxXcAzMrKScf9mK2050NX2JgvMD9CeC3mg1qh\nOwDB5q3fAOIfJ386DKnaSsnhAioVNVnNkCQ7zLMh6UE3J/EInwXqjTJLlyLPnmgg\ngK024U5nAgMBAAECgf8poztw7RyiKiOFhhawHdR/8dKeoq/b+f0vMoKOetxh1XIO\n1e0GLeZh7Ra5oWF6zBnTgx96Q+I93j8iirqeBSrsbyV14BpP5qQc+BRp70pHi21X\nHRJfhBZwU+1atfPVBpxlkHEac/5sWYHpQxP1OrMX4syzC9sjzzEyAiCiNa0jOhyB\naq6h1XFJzTXTKv6nFpqPpG4RHtRFm+/rPXZeJWi90JvSQs/vM4djyDr8eaxsieCr\nOpmyEoDr0YOMysDLq+KKVqgUHjiurAdEzSedfOby8kRK3lmTFP4+je14U5lg8aBh\npon9iwBW8bGTikN1bNmWqzK2jKWtfBS93Gf98FkCgYEA/8B/H41/klaMG+gDct3O\nkAsEoTVvzoW37XvW0+CO8YOA+8RGavMYGd+iVFaz6fWmDj7O2uyzhnxB+rMgqCfY\n7vlaBFi8K+hvj+yQ9HdccoYv3q95gW4gUnZ4P/Zf9Cc2pRblliGL16VPaarmAsdZ\nReN2aGBbxDcQI82crB2WueUCgYEA2SikYTEnXMyztDJ7pMypCM9TZRi1Dw/JTSFj\ntSabtBbi4UG+jQTG1fpEN6pjSCMg9sltE7BmU0EjG7mrUqe1QUo1a80JS0hFlNPF\nXdVCabM5IzDMVn6k9G4rQpTm+Un+VOK559qbj1VJbgT1//nzNVydSMw+Wvs2QQ91\neFAcslsCgYEAq4q8Obe5F7jBZX5rwcIQ6QDa7B5hjg6W3c2wvJDkkA36l+SArv+6\n7K/Zu+Qj7Qt9hBSQvrsBd3Uk9Djt8Jw5n6DUxhGWtYTEP68XU0I0WgSzWxQr1aq+\nN1GLOqvQlH0w4+7Fs7twhwY0i9W7TaXUtVHqe/wV0Th1tO4W5kM6dBkCgYBW6sx4\nVksx+oDG1BnnCT9y1kDDyxLVF3Vz2LRm0jAp8asXi8/v84R+KrBZM2qPeff8rvxo\nkAc0tXKO606mQ5fprQEax7M7nY60Fdr+RphRZDmvWx2+VOxDJUFNYfnct4ADi8fr\nA/WVdgZw8a1gqjNtHUea1pzyn2/EtKJI6I/D1wKBgDW+LCKBIbzmPE3yolXq2pOJ\nqgoVQkDQUJCCkH+C7//e9qvmMCFamORu7MgXnWingRbOkz7tCnl64TgCvWlEmTTq\nKBb/eWhH7w4M0ah9hHxdv34o7aFq80v4TiLNJxm6pjJYaCF+XbtXwZ3nM2gGBLZx\nzuE6bWDGmUH1onyitVQt\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-qqsjk@portfolio-33d8d.iam.gserviceaccount.com",
  client_id: "108090007841310536660",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qqsjk%40portfolio-33d8d.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Check if Firebase app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL: "https://bkb-transport-default-rtdb.firebaseio.com",
  });
}

const SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];

function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

const sendFcmNotification = async (
  token,
  deviceToken,
  title,
  body,
  imageUrl
) => {
  const url =
    "https://fcm.googleapis.com/v1/projects/portfolio-33d8d/messages:send";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "Application/json; UTF-8",
  };

  const fcmBody = {
    message: {
      token: deviceToken,
      data: {},
      notification: {
        title: title,
        body: body,
        image: imageUrl,
      },
    },
  };

  try {
    const { data } = await axios.post(url, fcmBody, { headers });
    console.log("Status: ", data);
  } catch (e) {
    console.log(e?.message);
  }
};

// Call the function

export const pushFcmNotification = (deviceToken, title, body, imageUrl) => {
  getAccessToken()
    .then((token) => {
      sendFcmNotification(token, deviceToken, title, body, imageUrl);
    })
    .catch((err) => {
      console.error("Error fetching access token:", err);
    });
};
