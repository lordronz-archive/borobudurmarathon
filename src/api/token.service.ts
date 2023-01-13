import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const TokenService = {
  getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  saveToken(accessToken: string) {
    AsyncStorage.setItem(TOKEN_KEY, accessToken);
  },

  removeToken() {
    AsyncStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken() {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  saveRefreshToken(refreshToken: string) {
    AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  removeRefreshToken() {
    AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export {TokenService};
