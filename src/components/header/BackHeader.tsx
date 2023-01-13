import React from 'react';
import {Box, Button, ArrowBackIcon} from 'native-base';
import {type GestureResponderEvent} from 'react-native';

export type BackHeaderProps = {
  onPress: (event: GestureResponderEvent) => void;
};

export default function BackHeader({onPress}: BackHeaderProps) {
  return (
    <Box py="2" ml={-2.5}>
      <Button onPress={onPress} variant="ghost" size="sm" w={10} h={10}>
        <ArrowBackIcon size="md" color="text.900" />
      </Button>
    </Box>
  );
}
