import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_AUTH_TOKEN = 'APP_AUTH_TOKEN';
const APP_AUTH_USER = 'APP_AUTH_USER';

export async function saveToken(token: string) {
  await AsyncStorage.setItem(APP_AUTH_TOKEN, token);
  return true;
}

export async function getToken() {
  return (await AsyncStorage.getItem(APP_AUTH_TOKEN)) || undefined;
}

export async function saveUser(userData: any) {
  await AsyncStorage.setItem(APP_AUTH_USER, JSON.stringify(userData));
  return true;
}

export async function getUser() {
  const res = await AsyncStorage.getItem(APP_AUTH_USER);

  if (res) {
    return JSON.parse(res);
  } else {
    return undefined;
  }
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([APP_AUTH_USER, APP_AUTH_TOKEN]);
}
