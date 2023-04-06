import React, {useEffect, useState} from 'react';
import {Box, Center, Spinner, Text} from 'native-base';

type Props = {
  text?: string;
  style?: any;
  maxCount?: number;
  onRemainingZero?: () => void;
};
export default function LoadingBlock(props: Props) {
  const [remainingTime, setRemainingTime] = useState(props.maxCount || 10);

  useEffect(() => {
    const start = new Date();
    const interval = setInterval(() => {
      const now = new Date();
      const newCount =
        10 - Math.floor((now.getTime() - start.getTime()) / 1000);
      setRemainingTime(newCount);

      console.info('newCount', newCount);

      if (newCount <= 0) {
        clearInterval(interval);

        if (props.onRemainingZero) {
          console.info('props.onRemainingZero');
          props.onRemainingZero();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      flex={1}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        ...(props.style || {}),
      }}>
      <Center>
        <Spinner size="lg" />
        {!!props.text && <Text color="gray.400">{props.text}</Text>}
      </Center>
    </Box>
  );
}
