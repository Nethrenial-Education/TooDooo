import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyCsLmBm5reEtk3WTob8IraAgJkjN5vueEw',
  authDomain: 'remembrall-nethrenial.firebaseapp.com',
  databaseURL: 'https://remembrall-nethrenial-default-rtdb.firebaseio.com',
  projectId: 'remembrall-nethrenial',
  storageBucket: 'remembrall-nethrenial.appspot.com',
  messagingSenderId: '1096308468522',
  appId: '1:1096308468522:web:c84a1fa5c790b6c276cc53',
  measurementId: 'G-HKVNB78TRG',
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
  firebase.analytics()
}

export const auth = firebase.auth()
export const google = new firebase.auth.GoogleAuthProvider()
export const db = firebase.firestore()
export const fb = firebase
