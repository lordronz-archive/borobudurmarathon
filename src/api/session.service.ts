import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'session_available';

const SessionService = {
  getSession() {
    return AsyncStorage.getItem(SESSION_KEY);
  },

  saveSession() {
    AsyncStorage.setItem(SESSION_KEY, 'TRUE');
  },

  removeSession() {
    AsyncStorage.removeItem(SESSION_KEY);
  },
};

export {SessionService};
