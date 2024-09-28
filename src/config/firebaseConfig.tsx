import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAaDka56qIYCXIUeSVCLNJLpIlswZgSD7g",
    authDomain: "bibliotecaalejandria-c1f89.firebaseapp.com",
    projectId: "bibliotecaalejandria-c1f89",
    storageBucket: "bibliotecaalejandria-c1f89.appspot.com",
    messagingSenderId: "991370917771",
    appId: "1:991370917771:web:7993e751df40618dbb618e"
};

const firebase = initializeApp(firebaseConfig);
export const auth = initializeAuth(firebase, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});