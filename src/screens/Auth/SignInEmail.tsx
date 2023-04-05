import {useNavigation} from '@react-navigation/native';
import {Box, HStack, Text, useToast, VStack} from 'native-base';
import React, {useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import useInit from '../../hooks/useInit';
import WebView from 'react-native-webview';
import config from '../../config';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {IAuthResponseData} from '../../types/auth.type';
import {useAuthUser} from '../../context/auth.context';
import {useTranslation} from 'react-i18next';
import Button from '../../components/buttons/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppContainer from '../../layout/AppContainer';
import {handleErrorMessage} from '../../helpers/apiErrors';
import {validateEmail} from '../../helpers/validate';

export default function SignInEmailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {init} = useInit();
  const {setLoginType} = useAuthUser();
  const {t} = useTranslation();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [loggingInData, setLoggingInData] = useState<IAuthResponseData>();

  const signin = async () => {
    setLoginType('Email');
    try {
      setLoading(true);
      setEmail(email?.toLowerCase());
      const body = {
        username: email?.toLowerCase(),
        password: password,
      };
      const result = await AuthService.signIn(body);
      console.info('login result', result);

      setLoggingInData(result.data);
    } catch (err) {
      handleErrorMessage(err, t('error.failedToLogin'));
    } finally {
      setLoading(false);
    }
  };

  if (loggingInData) {
    // get cookies
    return (
      <Box flex={1}>
        <WebView
          source={{
            uri: config.apiUrl.href.href + config.apiUrl.apis.member.login.path,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data: {email, password}}),
            method: 'POST',
          }}
          style={{marginTop: 20}}
          onLoadEnd={() => {
            setTimeout(() => {
              init();
            }, 500);
          }}
          contentMode="mobile"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
        />
        <LoadingBlock text={t('message.authenticating')} />
      </Box>
    );
  }

  const isDisabledButton = !email || !password || !validateEmail(email);

  return (
    <AppContainer>
      <VStack px="4" flex="1">
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <BackHeader onPress={() => navigation.goBack()} />
          <VStack space="1.5">
            <Heading>{t('auth.signinViaEmail')}</Heading>
            <Text fontWeight={400} color="#768499" fontSize={11} mb="3">
              {t('auth.signInWithRegistered')}
            </Text>
          </VStack>
          <VStack space="2.5">
            <VStack space="1.5">
              <TextInput
                placeholder={t('auth.placeholderEmail') || ''}
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                _inputProps={{
                  textContentType: 'emailAddress',
                }}
              />
              <TextInput
                placeholder={t('auth.placeholderPassword') || ''}
                label={t('auth.password') || ''}
                type="password"
                value={password}
                onChangeText={text => setPassword(text)}
              />
            </VStack>
          </VStack>
          <HStack space="1" mt={22} justifyContent="center">
            <Text
              fontWeight={400}
              color="#1E1E1E"
              fontSize={12}
              textAlign="center">
              {t('auth.dontHaveAccount')}
            </Text>
            <Text
              fontWeight={600}
              color="#EB1C23"
              fontSize={12}
              textAlign="center"
              underline
              onPress={() => navigation.navigate('RegisterEmail')}>
              {t('auth.registerViaEmail')}
            </Text>
          </HStack>
          <HStack space="1" mt={15} justifyContent="center">
            <Text
              fontWeight={600}
              color="#EB1C23"
              fontSize={12}
              textAlign="center"
              underline
              onPress={() => navigation.navigate('ForgotPassword')}>
              {t('auth.forgotPassword')}
            </Text>
          </HStack>
        </KeyboardAwareScrollView>
        <HStack my={3}>
          <Button
            onPress={() => signin()}
            isLoading={loading}
            disabled={isDisabledButton}>
            {t('auth.signin')}
          </Button>
        </HStack>
      </VStack>
    </AppContainer>
  );
}
