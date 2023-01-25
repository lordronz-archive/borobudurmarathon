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
import I18n from '../../lib/i18n';
import {useAuthUser} from '../../context/auth.context';
import {getErrorMessage} from '../../helpers/errorHandler';

export default function ChangePhoneNumberScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {user} = useAuthUser();

  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const setProfile = async () => {
    setIsLoading(true);
    let valid = true;
    if (!phoneNumber) {
      valid = false;
    }

    if (!valid) {
      Toast.show({
        title: 'Not Complete',
        description: 'Please complete the data',
      });
      setIsLoading(false);
      return;
    }
    if (user?.linked.zmemAuusId[0].auusPhone !== phoneNumber) {
      const sendOtpRes = await AuthService.sendOTP({phoneNumber});
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
            navigation.goBack();
          } catch (err) {
            Toast.show({
              title: 'Failed to update',
              description: getErrorMessage(err),
            });
            setIsLoading(false);
          }
        },
      });
    } else {
      Toast.show({
        description: 'Success',
      });
      navigation.goBack();
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Header title={I18n.t('profile.editProfile')} left="back" />
      <ScrollView>
        <VStack space="4" mb="5">
          <VStack space="2.5" px="4">
            <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
              {I18n.t('label.accountInformation')}
            </Text>
            <VStack space="1.5">
              <TextInput
                placeholder="Enter your phone number"
                label="Phone number"
                helperText="We will send verification code to this number for validation"
                onChangeText={setPhoneNumber}
                value={phoneNumber}
              />
            </VStack>
          </VStack>
        </VStack>
        <Box px="4">
          <Button h="12" onPress={setProfile} isLoading={isLoading}>
            {I18n.t('profile.sendOtp')}
          </Button>
        </Box>
        <Box pb={100} />
      </ScrollView>
    </View>
  );
}
