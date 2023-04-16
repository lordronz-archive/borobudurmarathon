import AsyncStorage from '@react-native-async-storage/async-storage';

const VERSION_SKIP_KEY = 'version_skip';

const VersionService = {
  getLatestSkip() {
    return AsyncStorage.getItem(VERSION_SKIP_KEY);
  },

  updateLatestSkip(version: string) {
    AsyncStorage.setItem(VERSION_SKIP_KEY, version);
  },

  removeSkip() {
    AsyncStorage.removeItem(VERSION_SKIP_KEY);
  },
};

export {VersionService};
