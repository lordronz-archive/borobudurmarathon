import AsyncStorage from '@react-native-async-storage/async-storage';

const WELCOME_KEY = 'welcome_page_last_view';

const WelcomeService = {
  getLatestView(userId: string | number) {
    return AsyncStorage.getItem(WELCOME_KEY + '_' + userId);
  },

  updateLatestView(userId: string | number) {
    AsyncStorage.setItem(WELCOME_KEY + '_' + userId, new Date().toISOString());
  },

  removeToken(userId: string | number) {
    AsyncStorage.removeItem(WELCOME_KEY + '_' + userId);
  },

};

export {WelcomeService};
