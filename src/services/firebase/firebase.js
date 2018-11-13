import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { CONFIG_DEV, CONFIG_PROD } from './constants';

// const config = process.env.NODE_ENV === 'production' ? CONFIG_PROD : CONFIG_DEV;
const config = CONFIG_PROD;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export { db, auth };
