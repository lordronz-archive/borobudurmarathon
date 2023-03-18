export function getIDNumberType(iam: 'WNA' | 'WNI' | undefined | null) {
  if (iam === 'WNA') {
    return {
      id: 2,
      label: 'KTP',
      value: 2,
    };
  } else if (iam === 'WNI') {
    return {
      id: 1,
      label: 'Passport',
      value: 1,
    };
  } else {
    return {
      id: 0,
      label: null,
      value: 0,
    };
  }
}

export const ID_NUMBER_TYPE_OPTIONS = [
  {
    id: 1,
    label: 'KTP',
    value: '1',
  },
  {
    id: 2,
    label: 'Passport',
    value: '2',
  },
];

export function showIDNumberTypeName(val: string | number | undefined) {
  return ID_NUMBER_TYPE_OPTIONS.find(item => String(item.value) === String(val))
    ?.label;
}
