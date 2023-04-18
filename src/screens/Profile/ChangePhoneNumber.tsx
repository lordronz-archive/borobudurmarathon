import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Text,
  VStack,
  ScrollView,
  View,
  useTheme,
  Toast,
  Button,
} from 'native-base';
import React, {useState} from 'react';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from '../../components/header/Header';
import {useAuthUser} from '../../context/auth.context';
import {getErrorMessage} from '../../helpers/errorHandler';
import {useTranslation} from 'react-i18next';
import {cleanPhoneNumber} from '../../helpers/phoneNumber';
import useInit from '../../hooks/useInit';
import AppContainer from '../../layout/AppContainer';
import { handleErrorMessage } from '../../helpers/apiErrors';

export default function ChangePhoneNumberScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {user} = useAuthUser();
  const {getProfile} = useInit();

  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const sendPhoneOTP = async () => {
    setIsLoading(true);
    let valid = true;
    if (!phoneNumber) {
      valid = false;
    }

    if (!valid) {
      Toast.show({
        description: 'Please insert your new phone number',
      });
      setIsLoading(false);
      return;
    }
    if (
      cleanPhoneNumber(user?.linked?.zmemAuusId?.[0]?.auusPhone) !==
      cleanPhoneNumber(phoneNumber)
    ) {
      AuthService.sendOTP({phoneNumber})
        .then(sendOtpRes => {
          console.info('SendOTP result: ', sendOtpRes);
          navigation.navigate('PhoneNumberValidation', {
            phoneNumber,
            onSuccess: async () => {
              try {
                setIsLoading(true);
                Toast.show({
                  description: 'Success',
                });
                setIsLoading(false);
                getProfile();
                navigation.goBack();
              } catch (err) {
                handleErrorMessage(err, t('error.failedToSendOTP'));
                setIsLoading(false);
              }
            },
          });
        })
        .catch(err => {
          setIsLoading(false);
          handleErrorMessage(err, t('error.failedToSendOTP'));
        });
    } else {
      Toast.show({
        title: "It's your current phone number",
        description: 'Please insert different phone number to change',
      });
      setIsLoading(false);
    }
  };

  return (
    <AppContainer>
      <Header title={t('profile.changePhoneNumber')} left="back" />
      <ScrollView>
        <VStack space="4" mb="5">
          <VStack space="2.5" px="4">
            {/* <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
              {t('label.accountInformation')}
            </Text> */}
            <VStack space="1.5">
              <TextInput
                placeholder={t('auth.placeholderPhone') || ''}
                label={t('phoneNumber') || ''}
                helperText={t('auth.willSendToPhone')}
                onChangeText={setPhoneNumber}
                value={phoneNumber}
              />
            </VStack>
          </VStack>
        </VStack>
        <Box px="4">
          <Button h="12" onPress={sendPhoneOTP} isLoading={isLoading}>
            {t('profile.sendOtp')}
          </Button>
        </Box>
        <Box pb={100} />
      </ScrollView>
    </AppContainer>
  );
}
