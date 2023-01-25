import {useNavigation} from '@react-navigation/native';
import {Box, Button, Text, Toast, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {getErrorMessage} from '../../helpers/errorHandler';
import config from '../../config';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PhoneNumberValidation'
>;

export default function PhoneNumberValidationScreen({route}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {phoneNumber} = route.params as {phoneNumber?: string};

  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState<string>();
  const [seconds, setSeconds] = useState(30);
  const [errMessage, setErrMessage] = useState<string>();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const validatePhoneNumber = async () => {
    setIsLoading(true);
    const payload = {
      otpCode,
    };
    let valid = true;

    if (!otpCode) {
      setErrMessage('Enter the verification code');
      valid = false;
    }

    if (!valid) {
      setIsValid(false);
      Toast.show({
        description: 'Enter the verification code',
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await AuthService.confirmOTP(payload);
      console.info('Confirm OTP result: ', res);
      navigation.navigate('Welcome');
      setIsLoading(false);
    } catch (err) {
      Toast.show({
        // title: 'Failed to confirm OTP',
        description: getErrorMessage(err),
      });

      if (config.bypassPhoneVerification) {
        Toast.show({
          description: 'BYPASS Phone Verification',
        });
        navigation.navigate('Welcome');
      }
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setSeconds(30);
    try {
      setIsLoading(true);
      const sendOtpRes = await AuthService.sendOTP({phoneNumber});
      console.info('SendOTP result: ', sendOtpRes);
      Toast.show({
        description: 'OTP has been sent successfully',
      });
      setIsLoading(false);
    } catch (err) {
      Toast.show({
        description: getErrorMessage(err),
      });
      setIsLoading(false);
    }
  };

  return (
    <VStack px="4" flex="1">
      <Box flex="10">
        <BackHeader onPress={() => navigation.goBack()} />
        <VStack space="1.5">
          <Heading>Phone Number Validation</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            We need to validate your phone number
          </Text>
        </VStack>
        <Box mt={26} mb="3">
          <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
            Enter 8 digit code that we send to this number{' '}
            <Text bold>{phoneNumber}</Text>
          </Text>
        </Box>
        <VStack space="2.5">
          <VStack space="1.5">
            <TextInput
              placeholder="Enter verification code here"
              label="Verification Code"
              onChangeText={setOtpCode}
              isInvalid={!isValid}
              errorMessage={errMessage}
            />
          </VStack>
        </VStack>
        <VStack space="1" mt={22.64}>
          <Text
            fontWeight={400}
            color="#1E1E1E"
            fontSize={12}
            textAlign="center">
            Didn{"'"}t receive verification code?
          </Text>
          {seconds > 0 ? (
            <Text
              fontWeight={400}
              color="#1E1E1E"
              fontSize={12}
              textAlign="center">
              Please wait{' '}
              <Text
                fontWeight={600}
                color="#EB1C23"
                fontSize={12}
                textAlign="center">
                {seconds}
              </Text>{' '}
              seconds before resend code
            </Text>
          ) : (
            <Button variant={'ghost'} onPress={resendOTP}>
              <Text
                fontWeight={600}
                color="#EB1C23"
                fontSize={12}
                textAlign="center">
                Resend Code
              </Text>
            </Button>
          )}
        </VStack>
      </Box>
      <Button h="12" mb="3" onPress={validatePhoneNumber} isLoading={isLoading}>
        Confirm
      </Button>
    </VStack>
  );
}
