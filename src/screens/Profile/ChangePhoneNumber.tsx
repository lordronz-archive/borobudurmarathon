import {useNavigation} from '@react-navigation/native';
import {Box, VStack, ScrollView, Toast, Button, HStack} from 'native-base';
import React, {useState} from 'react';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from '../../components/header/Header';
import {useAuthUser} from '../../context/auth.context';
import {useTranslation} from 'react-i18next';
import {cleanPhoneNumber, countryPhoneCodes} from '../../helpers/phoneNumber';
import useInit from '../../hooks/useInit';
import AppContainer from '../../layout/AppContainer';
import {handleErrorMessage} from '../../helpers/apiErrors';
import crashlytics from '@react-native-firebase/crashlytics';
import SelectInput from '../../components/form/SelectInput';
import OtpWhatsapp from '../../components/modal/OtpWhatsapp';

export default function ChangePhoneNumberScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const {user} = useAuthUser();
  const {getProfile} = useInit();

  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [countryCode, setCountryCode] = useState<string>();
  const [openOtpWhatsapp, setOpenOtpWhatsapp] = useState(false);
  const cancelRef = React.useRef(null);

  const sendPhoneOTP = async () => {
    crashlytics().log(
      'will sendPhoneOTP [ChangePhoneNumber] user: ' + JSON.stringify(user),
    );
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
    let existingPhoneNumber;
    if (user?.linked?.zmemAuusId?.[0]?.auusPhone) {
      existingPhoneNumber = user?.linked?.zmemAuusId?.[0]?.auusPhone;
    } else if (user?.linked?.mbsdZmemId?.[0]?.mbsdPhone) {
      existingPhoneNumber = user?.linked?.mbsdZmemId?.[0]?.mbsdPhone;
    }
    if (existingPhoneNumber !== cleanPhoneNumber(phoneNumber)) {
      AuthService.sendOTP({
        phoneNumber,
        countryCode: countryCode ? +countryCode : 62,
      })
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
            <HStack space="1.5" width="100%">
              <SelectInput
                label={t('countryCode') || ''}
                placeholder="62"
                items={countryPhoneCodes.map(v => ({
                  label: v.code,
                  value: v.code,
                }))}
                width={'30%'}
                onValueChange={v => setCountryCode(v)}
              />
              <TextInput
                placeholder={t('auth.placeholderPhone') || ''}
                label={t('phoneNumber') || ''}
                helperText={t('auth.willSendToPhone')}
                onChangeText={setPhoneNumber}
                value={phoneNumber}
                width={'70%'}
              />
            </HStack>
          </VStack>
        </VStack>
        <Box px="4">
          <Button
            h="12"
            onPress={() => {
              if (countryCode && countryCode !== '62') {
                setOpenOtpWhatsapp(true);
                return;
              }
              sendPhoneOTP();
            }}
            isLoading={isLoading}>
            {t('profile.sendOtp')}
          </Button>
        </Box>
        <OtpWhatsapp
          cancelRef={cancelRef}
          isOpen={openOtpWhatsapp}
          onClose={setOpenOtpWhatsapp}
          onPress={() => {
            setOpenOtpWhatsapp(false);
            sendPhoneOTP();
          }}
          title={'WhatsApp OTP'}
          content={t('auth.otpWhatsappDesc')}
          buttonContent={t('next')}
        />
        <Box pb={100} />
      </ScrollView>
    </AppContainer>
  );
}
