import { auth } from './firebase';

const createAuth = () => {
  let user = null;

  const createUser = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

  const signIn = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

  const signOut = () => auth.signOut();

  const resetPassword = email => auth.sendPasswordResetEmail(email);

  const changePassword = password => auth.currentUser.updatePassword(password);

  auth.onAuthStateChanged(newUser => {
    user = newUser;
  });

  return {
    createUser,
    signIn,
    signOut,
    resetPassword,
    changePassword,

    get signedIn() {
      return !!user;
    },
    get userId() {
      return user && user.uid;
    },
  };
};

export default createAuth();
