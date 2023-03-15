import {useNavigation} from '@react-navigation/native';
import {Box, Button, HStack, Text, Toast, useToast, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import SelectInput from '../../components/form/SelectInput';
import {getErrorMessage} from '../../helpers/errorHandler';
import {useDebounce} from 'use-debounce';
import {useTranslation} from 'react-i18next';

export default function RegisterEmailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const {t} = useTranslation();

  const [fullname, setFullname] = useState<string>();
  const [gender, setGender] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [emailWillBeCheck] = useDebounce(email, 1000);

  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkEmail();
  }, []);

  const checkEmail = () => {
    if (!email || (email && email.length <= 5)) {
      return false;
    }
    AuthService.checkEmail(emailWillBeCheck)
      .then(res => {
        toast.show({
          title: 'Success',
        });
      })
      .catch(err => {
        toast.show({
          title: 'Failed',
          description: getErrorMessage(err),
        });
      });
  };

  const signup = async () => {
    try {
      setLoading(true);
      const result = await AuthService.signup({
        ptmmFullname: fullname,
        ptmmGender: gender,
        ptmmPassword: password,
        ptmmEmail: email,
      });
      console.info('register result', result);

      // navigation.navigate('Initial');
    } catch (e) {
      console.error(e);
      toast.show({
        title: 'Failed to register',
        description: getErrorMessage(e),
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack px="4" flex="1">
      <Box flex="10">
        <BackHeader onPress={() => navigation.goBack()} />
        <VStack space="1.5">
          <Heading>Register via Email</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11} mb="3">
            Register your new account here
          </Text>
        </VStack>
        <VStack space="2.5">
          <VStack space="1.5">
            <TextInput
              placeholder="Enter your full name here"
              label="Full Name"
              value={fullname}
              onChangeText={setFullname}
            />
            <SelectInput
              items={[
                {label: 'Male', value: '0'},
                {label: 'Female', value: '1'},
              ]}
              placeholder="Choose gender"
              label="Gender"
              onValueChange={setGender}
              value={gender}
              hideSearch
            />
            <TextInput
              placeholder="Enter your email here"
              label="Email"
              helperText="We will send verification code to this email for validation"
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              placeholder="Enter your password here"
              label="Password"
              type="password"
              onChangeText={setPassword}
              value={password}
            />
            <TextInput
              placeholder="Enter your password to confirm"
              label="Confirm Password"
              type="password"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
          </VStack>
        </VStack>
        <HStack space="1" mt={22} justifyContent="center">
          <Text
            fontWeight={400}
            color="#1E1E1E"
            fontSize={12}
            textAlign="center">
            Already have an Account?
          </Text>
          <Text
            fontWeight={600}
            color="#EB1C23"
            fontSize={12}
            textAlign="center"
            underline
            onPress={() => navigation.navigate('SignInEmail')}>
            {t('auth.signinViaEmail')}
          </Text>
        </HStack>
      </Box>
      <Button h="12" mb="3" onPress={() => signup()} isLoading={loading}>
        {t('auth.register')}
      </Button>
    </VStack>
  );
}