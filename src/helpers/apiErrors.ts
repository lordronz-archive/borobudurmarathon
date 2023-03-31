import i18next from 'i18next';
import {Toast} from 'native-base';
import {getErrorMessage} from './errorHandler';

export function getApiErrors(err: any): {[key: string]: string} | null {
  if (err?.data?.status?.error?.errors) {
    let objErrors = {};
    if (Array.isArray(err?.data?.status?.error?.errors)) {
      for (const errItem of err?.data?.status?.error?.errors || []) {
        if (errItem.length > 0) {
          objErrors = {
            ...objErrors,
            [errItem[0].field]: errItem[0].message,
          };
        }
      }
    } else {
      objErrors = {
        errorMessage: err?.data?.status?.error?.errors.message,
      };
    }
    console.info('objErrors', objErrors);

    if (Object.keys(objErrors).length > 0) {
      return objErrors;
    } else {
      return null;
    }
  } else if (err?.data?.status?.error?.message) {
    let objErrors = {errorMessage: err?.data?.status?.error?.message};

    console.info('objErrors', objErrors);

    return objErrors;
  }
  return null;
}

export function handleErrorMessage(
  err: any,
  title?: string | null,
  options?: {
    ignore404?: boolean;
    on404?: () => void;
    on409?: () => void;
  },
) {
  if (options && options.ignore404) {
    if (err.status === 404) {
      return null;
    }
  }
  if (options && options.on409) {
    options.on409();

    if (!Toast.isActive('session-expired')) {
      Toast.show({
        id: 'session-expired',
        description: 'Session expired',
      });
    }
    return;
  }
  const objErrors = getApiErrors(err);
  console.info('objErrors', objErrors);
  if (objErrors && objErrors.errorMessage) {
    try {
      const objMessage = JSON.parse(objErrors.errorMessage);

      objErrors.errorMessage = objMessage[i18next.language];
    } catch (error) {
      // nothing
    } finally {
      Toast.show({
        title: title || 'Failed',
        description: objErrors.errorMessage,
        placement: 'top',
      });
    }
  } else if (objErrors) {
    Toast.show({
      title: title || 'Failed',
      description: Object.keys(objErrors)
        .map(
          field =>
            `${objErrors[field]} ${
              field === 'errorMessage' ? '' : '[' + field + ']'
            }`,
        )
        .join('. '),
      placement: 'top',
    });
  } else {
    Toast.show({
      title: (title || 'Failed') + '.',
      description: getErrorMessage(err),
      placement: 'top',
    });
  }
  if (options && options.on404) {
    options.on404();
    return;
  }
  return objErrors;
}
