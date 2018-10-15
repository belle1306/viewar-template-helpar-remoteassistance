import viewarApi from 'viewar-api';

const createAuthManager = () => {
  let token;
  let user = null;
  let username = null;

  const persistLogin = async () => {
    const { storage } = viewarApi;
    await storage.local.write('settings.json', {
      token,
      name: user.name,
    });
  };

  const readPersisted = async () => {
    const { storage } = viewarApi;
    const settings = (await storage.local.read('settings.json')) || {};

    token = settings.token;
    username = name.username;
  };

  const login = async password => {
    token = password;
    username = username || generateUserName();

    user = {
      name: username,
    };

    await persistLogin();
    return true;
  };

  const generateUserName = () => {
    return `Support Agent ${generateRandomNumber(1, 1000)}`;
  }

  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return {
    login,
    readPersisted,
    get token() {
      return token;
    },
    get user() {
      return user;
    },
  };
};

export default createAuthManager();
