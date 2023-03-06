export type IField = {
  label: string;
  name: string;
  size: number;
  type: 'integer' | 'string' | 'datetime';
};
export type IStatus = {page: number; totalRecords: number};
