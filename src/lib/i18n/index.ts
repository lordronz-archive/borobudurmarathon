import I18n, {getLanguages} from 'react-native-i18n';
import en from './en';
import id from './id';

I18n.fallbacks = true;

I18n.translations = {
  en,
  id,
};

getLanguages().then((languages: any) => {
  console.log('languages', languages); // ['en-US', 'en']
});

export default I18n;
