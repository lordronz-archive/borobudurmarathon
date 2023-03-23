import {IGroup} from '../types/registerEvent.type';

export const REGISTER_EVENT_CONDITIONS: IGroup = {
  evpaCovidVaksin: {
    Yes: {show: ['evpaSudahVaksin']},
    '1': {show: ['evpaSudahVaksin']},
    No: {hide: ['evpaSudahVaksin']},
    '2': {hide: ['evpaSudahVaksin']},
  },
  evpaMedicalTreatment: {
    Yes: {show: ['evpaLongTreatment', 'evpaMentionTreatment']},
    '1': {show: ['evpaLongTreatment', 'evpaMentionTreatment']},
    No: {hide: ['evpaLongTreatment', 'evpaMentionTreatment']},
    '2': {hide: ['evpaLongTreatment', 'evpaMentionTreatment']},
  },
  evpa10KFinished: {
    Yes: {show: ['evpa10KYear', 'evpa10KRace']},
    '1': {show: ['evpa10KYear', 'evpa10KRace']},
    No: {hide: ['evpa10KYear', 'evpa10KRace']},
    '2': {hide: ['evpa10KYear', 'evpa10KRace']},
  },
  evpaHalfMarathonFinished: {
    Yes: {
      show: ['evpaHMRace', 'evpaHalfMarathonYear'],
    },
    '1': {
      show: ['evpaHMRace', 'evpaHalfMarathonYear'],
    },
    No: {
      hide: ['evpaHMRace', 'evpaHalfMarathonYear'],
    },
    '2': {
      hide: ['evpaHMRace', 'evpaHalfMarathonYear'],
    },
  },
  evpaMarathonFinished: {
    Yes: {
      show: ['evpaMarathonYear', 'evpaMarathonRace'],
    },
    '1': {
      show: ['evpaMarathonYear', 'evpaMarathonRace'],
    },
    No: {
      hide: ['evpaMarathonYear', 'evpaMarathonRace'],
    },
    '2': {
      hide: ['evpaMarathonYear', 'evpaMarathonRace'],
    },
  },
};

// export function isShowRegisterEventFormInput(
//   currentField: EvhfName,
//   fieldsData: {[key: string]: string},
//   // parentSelectedValue: string,
// ) {
//   console.info('================================== START');
//   console.info('parentSelectedValue -----> ', parentSelectedValue);
//   let isShow = false;
//   for (const gfield in REGISTER_EVENT_CONDITIONS) {
//     console.info('--------------------------------');
//     console.info('gfield --> ', gfield);
//     console.info(
//       '(REGISTER_EVENT_CONDITIONS as any)[gfield] -->',
//       (REGISTER_EVENT_CONDITIONS as any)[gfield],
//     );

//     if ((REGISTER_EVENT_CONDITIONS as any)[gfield][parentSelectedValue]) {
//       console.info(
//         '(REGISTER_EVENT_CONDITIONS as any)[gfield][parentSelectedValue]',
//         (REGISTER_EVENT_CONDITIONS as any)[gfield][parentSelectedValue],
//       );
//       if (
//         (REGISTER_EVENT_CONDITIONS as any)[gfield][parentSelectedValue].show &&
//         (REGISTER_EVENT_CONDITIONS as any)[gfield][
//           parentSelectedValue
//         ].show.includes(currentField)
//       ) {
//         return true;
//       }
//     }
//   }
//   console.info('================================== END');
//   return isShow;
// }

// export function getLabelValue(arr: any[], val: string | number | undefined) {
//   console.info('val -->', val);
//   const res = arr.find(
//     item =>
//       String(item.value) === String(val) || String(item.id) === String(val),
//   );
//   console.info('res -->', res);
//   return res;
// }

export function isSubField(field: string) {
  // console.info('================================== START');
  for (const gfield in REGISTER_EVENT_CONDITIONS) {
    // gfield = evpaNationality
    // console.info('--------------------------------');
    // console.info('gfield --> ', gfield);
    // console.info(
    //   '(REGISTER_EVENT_CONDITIONS as any)[gfield] -->',
    //   (REGISTER_EVENT_CONDITIONS as any)[gfield],
    // );

    if ((REGISTER_EVENT_CONDITIONS as any)[gfield]) {
      for (const objCondition of Object.values(
        (REGISTER_EVENT_CONDITIONS as any)[gfield],
      )) {
        // objCondition = {show: []}
        // console.info('objCondition --', objCondition);
        if (objCondition) {
          for (const subfields of Object.values(objCondition)) {
            // subfields = ['evpaNationality]
            // console.info('subfields --', subfields);
            if (subfields.includes(field)) {
              return true;
            }
          }
        }
      }
      // console.info(
      //   '(REGISTER_EVENT_CONDITIONS as any)[gfield]',
      //   (REGISTER_EVENT_CONDITIONS as any)[gfield],
      // );
    }
  }
  // console.info('================================== END');
  return false;
}
