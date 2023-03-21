import {t} from 'i18next';
import {showBloodName} from '../assets/data/blood';
import {showGenderName} from '../assets/data/gender';
import {showIDNumberTypeName} from '../assets/data/ktpPassport';

export function convertOption(val: string | number, field: string) {
  console.info('convertOption val ---> ', JSON.stringify(val));
  console.info('convertOption field ---> ', JSON.stringify(field));
  if (field === 'evpaBloodType' || field === 'mbsdBloodType') {
    console.info('showBloodName -->> ', val);
    return showBloodName(val);
  }
  if (field === 'evpaGender' || field === 'mbsdGender') {
    console.info('showGenderName -->> ', val);
    return showGenderName(val);
  }
  if (field === 'evpaIDNumberType' || field === 'mbsdIDNumberType') {
    console.info('showIDNumberTypeName -->> ', val);
    return showIDNumberTypeName(val);
  }
  return val;
}
