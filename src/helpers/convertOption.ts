import {t} from 'i18next';
import {showBloodName} from '../assets/data/blood';

export function convertOption(val: string | number, field: string) {
  if (field === 'evpaGender') {
    if (val === 1 || val === '1') {
      return t('male');
    } else {
      return t('female');
    }
  } else if (field === 'evpaIDNumberType') {
    if (val === 1) {
      return 'KTP';
    } else if (val === 3) {
      return 'Passport';
    }
  } else if (field === 'evpaBloodType') {
    return showBloodName(String(val));
  }
  return val;
}
