import React from 'react';
import Toast from 'react-native-toast-message';
import ToastFailed from './ToastFailed';
import ToastSuccess from './ToastSuccess';

const toastConfig = {
  success: ({ text1 }: any) => <ToastSuccess text1={text1} />,
  error: ({ text1 }: any) => <ToastFailed text1={text1} />
};

export default function ToastInit(): ReactComponent {
  return <Toast config={toastConfig} />;
}
