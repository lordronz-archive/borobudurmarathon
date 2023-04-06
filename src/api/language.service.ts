import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'latest_language';

const LanguageService = {
  getLanguage() {
    return AsyncStorage.getItem(LANGUAGE_KEY);
  },

  setLanguage(language: 'en' | 'id') {
    AsyncStorage.setItem(LANGUAGE_KEY, language.toString());
  },
};

export {LanguageService};
