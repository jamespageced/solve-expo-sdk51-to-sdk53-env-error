import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { toastFailedVisibilityTime, toastSuccessVisibilityTime } from '@app/utils';

interface Props {
  isSuccess: boolean;
}

export default function ProgressBar({ isSuccess }: Props): ReactComponent {
  const progress = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: isSuccess ? toastSuccessVisibilityTime : toastFailedVisibilityTime,
      useNativeDriver: false
    }).start();
  }, [progress]);

  // render
  return (
    <Animated.View
      style={{
        height: 4,
        width: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['100%', '0%']
        }),
        backgroundColor: '#ffffff',
        position: 'absolute',
        left: 0,
        bottom: 0
      }}
    />
  );
}
