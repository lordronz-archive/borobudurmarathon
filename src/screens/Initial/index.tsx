import React, {useEffect, useState} from 'react';
import {Box, Center, Spinner, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';

export default function InitialScreen() {
  const {navigate} = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    navigate('Auth');
  }, []);

  return (
    <Box>
      <Center>{isLoading ? <Spinner /> : <Text>Initial Screen</Text>}</Center>
    </Box>
  );
}
