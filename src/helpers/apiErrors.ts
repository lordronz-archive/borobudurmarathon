export function getApiErrors(err: any): {[key: string]: string} | null {
  if (err?.data?.status?.error?.errors) {
    let objErrors = {};
    for (const errItem of err?.data?.status?.error?.errors || []) {
      if (errItem.length > 0) {
        objErrors = {
          ...objErrors,
          [errItem[0].field]: errItem[0].message,
        };
      }
    }
    console.info('objErrors', objErrors);

    return objErrors;
  }
  return null;
}
