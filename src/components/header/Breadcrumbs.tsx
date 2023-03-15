import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Box, Divider, HStack, Text, useTheme, VStack} from 'native-base';
import React from 'react';
import {RootStackParamList} from '../../navigation/RootNavigator';

type Props = {
  titles: string[];
  step?: number;
};

export default function Breadcrumbs(props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();

  return (
    <HStack paddingY={'12px'}>
      {props.titles.map((title, i) => (
        <VStack
          flex="1"
          alignItems={'center'}
          justifyContent={'center'}
          key={i}>
          <HStack>
            <Box
              rounded={'full'}
              zIndex={1}
              height="24px"
              width="24px"
              backgroundColor={
                props.step && props.step > i + 1 ? 'primary.900' : '#E8ECF3'
              }
              textAlign={'center'}
              justifyContent="center"
              alignItems="center"
              _text={{
                color: props.step && props.step > i + 1 ? 'white' : '#9FACBF',
                fontWeight: 600,
                fontSize: 12,
              }}>
              {i + 1}
            </Box>
            {i < props.titles.length - 1 && (
              <Divider
                position={'absolute'}
                my="3"
                _light={{
                  bg: '#E8ECF3',
                  height: '2px',
                }}
                _dark={{
                  bg: 'muted.50',
                }}
              />
            )}
          </HStack>
          <Text fontWeight={400} fontSize={12} textAlign="center">
            {title}
          </Text>
        </VStack>
      ))}
    </HStack>
  );
}
