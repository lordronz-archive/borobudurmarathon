export const GENDER_OPTIONS = [
  {
    id: 1,
    label: 'Male',
    value: '1',
  },
  {
    id: 2,
    label: 'Female',
    value: '2',
  },
];

export function showGenderName(val: string | number | undefined) {
  return GENDER_OPTIONS.find(item => String(item.value) === String(val))?.label;
}
