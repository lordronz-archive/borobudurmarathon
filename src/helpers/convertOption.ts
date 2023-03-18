import {t} from 'i18next';
import {showBloodName} from '../assets/data/blood';
import {showGenderName} from '../assets/data/gender';
import {showIDNumberTypeName} from '../assets/data/ktpPassport';

export function convertOption(val: string | number, field: string) {
  if (field === 'evpaGender' || field === 'mbsdGender') {
    return showGenderName(val);
  } else if (field === 'evpaIDNumberType' || 'mbsdIDNumberType') {
    return showIDNumberTypeName(val);
  } else if (field === 'evpaBloodType' || field === 'mbsdBloodType') {
    return showBloodName(val);
  }
  return val;
}
