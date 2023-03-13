import {useNavigation} from '@react-navigation/native';
import {Box, Button, HStack, Text, VStack} from 'native-base';
import React, {useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import I18n from '../../lib/i18n';

export default function SignInEmailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);

  const signin = async () => {
    try {
      setLoading(true);
      const result = await AuthService.signIn({
        username: email,
        password: password,
      });
      console.info(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack px="4" flex="1">
      <Box flex="10">
        <BackHeader onPress={() => navigation.goBack()} />
        <VStack space="1.5">
          <Heading>Sign In via Email</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11} mb="3">
            Sign in with the email you registered here
          </Text>
        </VStack>
        <VStack space="2.5">
          <VStack space="1.5">
            <TextInput
              placeholder="Enter your email here"
              label="Email"
              value={email}
              onChangeText={t => setEmail(t)}
            />
            <TextInput
              placeholder="Enter your password here"
              label="Password"
              type="password"
              value={password}
              onChangeText={t => setPassword(t)}
            />
          </VStack>
        </VStack>
        <HStack space="1" mt={22} justifyContent="center">
          <Text
            fontWeight={400}
            color="#1E1E1E"
            fontSize={12}
            textAlign="center">
            Didn{"'"}t have an Account?
          </Text>
          <Text
            fontWeight={600}
            color="#EB1C23"
            fontSize={12}
            textAlign="center"
            underline
            onPress={() => navigation.navigate('RegisterEmail')}>
            Register via Email
          </Text>
        </HStack>
      </Box>
      <Button h="12" mb="3" onPress={() => signin()} isLoading={loading}>
        {I18n.t('confirm')}
      </Button>
    </VStack>
  );
}
