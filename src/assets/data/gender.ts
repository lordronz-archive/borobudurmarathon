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

export const getGenderOptions = (
  male?: string | null,
  female?: string | null,
) => {
  return [
    {
      id: 1,
      label: male || 'Male',
      value: '1',
    },
    {
      id: 2,
      label: female || 'Female',
      value: '2',
    },
  ];
};

export function showGenderName(val: string | number | undefined) {
  return (
    GENDER_OPTIONS.find(
      item =>
        String(item.value) === String(val) || String(item.id) === String(val),
    )?.label || val
  );
}
