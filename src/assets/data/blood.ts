export const BLOOD_OPTIONS = [
  {
    label: 'O',
    value: '0',
  },
  {
    label: 'O+',
    value: '1',
  },
  {
    label: 'O-',
    value: '2',
  },
  {
    label: 'A',
    value: '3',
  },
  {
    label: 'A+',
    value: '4',
  },
  {
    label: 'A-',
    value: '5',
  },
  {
    label: 'B',
    value: '6',
  },
  {
    label: 'B+',
    value: '7',
  },
  {
    label: 'B-',
    value: '8',
  },
  {
    label: 'AB',
    value: '9',
  },
  {
    label: 'AB+',
    value: '10',
  },
  {
    label: 'AB-',
    value: '11',
  },
];

export function showBloodName(val: string | number | undefined) {
  return (
    BLOOD_OPTIONS.find(item => String(item.value) === String(val))?.label || val
  );
}
