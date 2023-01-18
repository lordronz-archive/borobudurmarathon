import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ArrowBackIcon,
  Box,
  Heading,
  HStack,
  IconButton,
  useTheme,
} from 'native-base';
import React from 'react';
import {RootStackParamList} from '../../navigation/RootNavigator';

type Props = {
  title: string;
  left?: 'back' | JSX.Element;
  right?: JSX.Element;
};

export default function Header(props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      paddingX={1}
      paddingY={2}>
      {props.left === 'back' && (
        <IconButton
          onPress={() => {
            navigation.goBack();
          }}
          icon={<ArrowBackIcon />}
          borderRadius="full"
          _icon={{
            color: colors.black,
            size: 'md',
          }}
          _hover={{
            bg: colors.primary[900] + ':alpha.20',
          }}
          _pressed={{
            bg: colors.primary[900] + ':alpha.20',
            _icon: {
              name: 'emoji-flirt',
            },
          }}
        />
      )}
      <Heading size="sm">{props.title}</Heading>
      {props.right ? props.right : <Box paddingX={3} />}
    </HStack>
  );
}
