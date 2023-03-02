import {useNavigation} from '@react-navigation/native';
import {Box, Button, Text, Toast, useToast, VStack} from 'native-base';
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
import {ProfileService} from '../../api/profile.service';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailValidation'>;

export default function EmailValidationScreen({route}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {email} = route.params as {email?: string};
  const {onSuccess} = route.params as {onSuccess?: any};

  const toast = useToast();
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

  const getProfile = () => {
    ProfileService.getMemberDetail()
      .then(resProfile => {
        console.info('resProfile', resProfile);
        console.info('###resProfile###', JSON.stringify(resProfile));
        if (resProfile.data && resProfile.data.length > 0) {
          if (resProfile.linked.zmemAuusId[0].auusConsent) {
            // profile has been completed
            // if (payload.data.linked.mbsdZmemId[0].mbsdStatus > 0) {
            //   state.readyToRegister = true;
            // }
            navigation.navigate('Welcome');
          } else if (!resProfile.linked.zmemAuusId[0].auusConsent) {
            navigation.navigate('DataConfirmation');
          }
        }
      })
      .catch(err => {
        console.info('### error resProfile', err);
        console.info('### error resProfile --- ', JSON.stringify(err));
        if (err && err.errorCode === 409) {
          navigation.navigate('Logout');
          // setIsNotRegistered(true);
        } else {
          toast.show({
            title: 'Failed to get profile',
            variant: 'subtle',
            description: getErrorMessage(err),
          });
          navigation.navigate('Initial');
        }
      });
  };

  const validatePhoneNumber = async () => {
    setIsLoading(true);
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
      const res = await AuthService.inputVerificationEmail(otpCode as string);
      if (res) {
        await onSuccess();
      }
      console.info('Confirm OTP result: ', res);
      getProfile();
      setIsLoading(false);
    } catch (err) {
      Toast.show({
        // title: 'Failed to confirm OTP',
        description: getErrorMessage(err),
      });

      if (config.bypassPhoneVerification) {
        Toast.show({
          description: 'BYPASS EMAIL Verification',
        });
        await onSuccess();
      }
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setSeconds(30);
    try {
      setIsLoading(true);
      const sendOtpRes = await AuthService.sendOTP({phoneNumber: email});
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
          <Heading>Email Validation</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            We need to validate your email
          </Text>
        </VStack>
        <Box mt={26} mb="3">
          <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
            Enter 8 digit code that we send to this email{' '}
            <Text bold>{`"${email}"`}</Text>
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
