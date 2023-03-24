import {useNavigation} from '@react-navigation/native';
import {Box, Button, Text, useToast, VStack} from 'native-base';
import React, {useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';
import {handleErrorMessage} from '../../helpers/apiErrors';

export default function ForgotPasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const {t} = useTranslation();

  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState(false);

  const forgotPassword = async () => {
    try {
      setLoading(true);
      const body = {
        email,
      };
      const result = await AuthService.resetPass(body);
      console.info('forgotPassword result', result);
      navigation.goBack();
      toast.show({
        title: 'Success',
        description: t('message.forgotPasswordSuccess'),
        placement: 'top',
      });
    } catch (err) {
      handleErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <VStack px="4" flex="1">
        <Box flex="10">
          <BackHeader onPress={() => navigation.goBack()} />
          <VStack space="1.5">
            <Heading>{t('auth.forgotPasswordTitle')}</Heading>
            <Text fontWeight={400} color="#768499" fontSize={11} mb="3">
              {t('auth.forgotPasswordSubtitle')}
            </Text>
          </VStack>
          <VStack space="2.5">
            <VStack space="1.5">
              <TextInput
                placeholder={t('auth.placeholderEmail') || ''}
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
              />
            </VStack>
          </VStack>
          {/* <HStack space="1" mt={22} justifyContent="center">
          <Text
            fontWeight={600}
            color="#EB1C23"
            fontSize={12}
            textAlign="center"
            underline
            onPress={() => navigation.navigate('SignInEmail')}>
            {t('auth.signinViaEmail')}
          </Text>
        </HStack> */}
        </Box>
        <Button
          h="12"
          mb="3"
          onPress={() => forgotPassword()}
          isLoading={loading}>
          {/* {t('profile.sendOtp')} */}
          {t('auth.resetPassword')}
        </Button>
      </VStack>
    </AppContainer>
  );
}
