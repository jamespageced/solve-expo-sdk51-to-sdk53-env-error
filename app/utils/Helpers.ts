import type { ToastShowParams } from 'react-native-toast-message';

const toastTopOffset = 40; // toast props
export const toastSuccessVisibilityTime = 1000; // toast props
export const toastFailedVisibilityTime = 4000; // toast props
export const toastSuccessDefaultMsg = 'Success';

export function sleep(delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

export function toastSuccessProps(msg?: string): ToastShowParams {
  return {
    topOffset: toastTopOffset,
    type: 'success',
    text1: !msg ? toastSuccessDefaultMsg : msg,
    visibilityTime: toastSuccessVisibilityTime
  };
}

export function toastFailedProps(error: string): ToastShowParams {
  return {
    topOffset: toastTopOffset,
    type: 'error',
    text1: error,
    visibilityTime: toastFailedVisibilityTime
  };
}
