export function getErrorMessage(err: any) {
  let errMessage = 'Failed. Please try again.';
  console.info('err', err);

  if (err && typeof err === 'string') {
    errMessage = err;
  } else if (err && err.response) {
    if (err.response.data && err.response.data.message) {
      errMessage = err.response.data.message;
    } else if (err.response.message) {
      errMessage = err.response.message;
    } else {
      errMessage = JSON.stringify(err);
    }
  } else if (err && err.data) {
    if (err.data && err.data.message) {
      errMessage = err.data.message;
    } else if (err.data && err.data.status && err.data.status?.error?.message) {
      errMessage = err.data.status?.error?.message;
    } else {
      errMessage = JSON.stringify(err);
    }
  } else if (err.message) {
    errMessage = err.message;
  } else if (err.statusText) {
    errMessage = err.statusText;
  } else if (err.error) {
    errMessage = err.error;
  } else {
    errMessage = JSON.stringify(err);
  }
  return errMessage;
}
