// Store user name and email in local
const setCredentials = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

// Clear user info in local after logging out
const clearCredentials = () => {
  localStorage.removeItem('userInfo');
};

// Get user info from local storage
const isLocalStorageSupported = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};
const getUserInfo = () => {
  if (isLocalStorageSupported() && localStorage.getItem('userInfo')) {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  return null;
};

export { setCredentials, clearCredentials, getUserInfo };
