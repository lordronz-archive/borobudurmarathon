import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Box,
  Text,
  VStack,
  Divider,
  Image,
  HStack,
  CheckIcon,
} from 'native-base';
import React, {useEffect} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';
import TextInput from '../../components/form/TextInput';
import Button from '../../components/buttons/Button';
import useInvitation from '../../hooks/useInvitation';

export default function ListInvitationScreen() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const {fetchList, invitations} = useInvitation();

  useEffect(() => {
    if (isFocused) {
      fetchList();
    }
  }, [isFocused]);

  return (
    <AppContainer>
      <Box px="4">
        <BackHeader onPress={() => navigation.goBack()} />
        <VStack space="1.5">
          <Heading>ListInvitation</Heading>
        </VStack>
      </Box>
    </AppContainer>
  );
}
