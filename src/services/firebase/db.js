import { db } from './firebase';
import auth from './auth';
import viewarApi from 'viewar-api';

const getAppId = () => {
  return viewarApi.appConfig.appId.replace(/\./g, '_');
};

export const write = (path, value) => {
  if (path.startsWith('/public')) {
    return db.ref(path).set(value);
  } else {
    return db.ref(`/users/${auth.userId}/${getAppId()}/${path}`).set(value);
  }
};

export const read = async path => {
  let refPath;
  if (path.startsWith('/public')) {
    refPath = path;
  } else {
    refPath = `/users/${auth.userId}/${getAppId()}/${path}`;
  }

  try {
    const data = await db.ref(refPath).once('value');
    return data.val();
  } catch (e) {
    console.log(e.message);
  }
};
