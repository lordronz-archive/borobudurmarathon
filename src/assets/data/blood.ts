export const BLOOD_OPTIONS = [
  {
    id: '0',
    label: 'O',
    value: '0',
  },
  {
    id: '1',
    label: 'O+',
    value: '1',
  },
  {
    id: '2',
    label: 'O-',
    value: '2',
  },
  {
    id: '3',
    label: 'A',
    value: '3',
  },
  {
    id: '4',
    label: 'A+',
    value: '4',
  },
  {
    id: '5',
    label: 'A-',
    value: '5',
  },
  {
    id: '6',
    label: 'B',
    value: '6',
  },
  {
    id: '7',
    label: 'B+',
    value: '7',
  },
  {
    id: '8',
    label: 'B-',
    value: '8',
  },
  {
    id: '9',
    label: 'AB',
    value: '9',
  },
  {
    id: '10',
    label: 'AB+',
    value: '10',
  },
  {
    id: '11',
    label: 'AB-',
    value: '11',
  },
];

export function showBloodName(val: string | number | undefined) {
  console.info('val -->', val);
  const res =
    BLOOD_OPTIONS.find(
      item =>
        String(item.value) === String(val) || String(item.id) === String(val),
    )?.label || val;
  console.info('res -->', res);
  return res;
}
