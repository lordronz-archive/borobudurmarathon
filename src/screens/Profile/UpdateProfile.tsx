import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Text,
  VStack,
  ScrollView,
  View,
  HStack,
  Avatar,
  useTheme,
  Toast,
  Button,
} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import DateInput from '../../components/form/DateInput';
import countries from '../../helpers/countries';
import {AuthService} from '../../api/auth.service';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from '../../components/header/Header';
import I18n from '../../lib/i18n';
import {getShortCodeName} from '../../helpers/name';
import {useAuthUser} from '../../context/auth.context';
import {getErrorMessage} from '../../helpers/errorHandler';

export default function UpdateProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {user} = useAuthUser();

  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState<string>(
    user?.data[0].zmemFullName || '',
  );
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    user?.linked.mbsdZmemId?.[0]?.mbsdBirthDate
      ? new Date(user?.linked?.mbsdZmemId?.[0]?.mbsdBirthDate)
      : undefined,
  );
  const [email] = useState<string>(user?.linked.zmemAuusId[0].auusEmail || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(
    user?.linked?.zmemAuusId?.[0]?.auusPhone || '',
  );
  const [mbsdIDNumberType, setIDNumberType] = useState<string>();
  const [mbsdIDNumber, setIDNumber] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdIDNumber || '',
  );
  const [mbsdBirthPlace, setBirthPlace] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdBirthPlace || '',
  );
  const [mbsdBloodType, setBloodType] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdBloodType || '',
  );
  const [mbsdNationality, setNationality] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdNationality || '',
  );
  const [mbsdCountry, setCountry] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdCountry || '',
  );
  const [mbsdAddress, setAddress] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdAddress || '',
  );
  const [mbsdCity, setCity] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdCity || '',
  );
  const [mbsdProvinces, setProvinces] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdProvinces || '',
  );

  const setProfile = async () => {
    setIsLoading(true);
    const payload = {
      mbsdIDNumber,
      mbsdBirthDate: birthDate ? birthDate.toJSON().slice(0, 10) : undefined,
      mbsdBirthPlace,
      mbsdBloodType,
      mbsdNationality,
      mbsdCountry,
      mbsdCity,
      mbsdProvinces,
      mbsdAddress,
      mbsdRawAddress: '-',
      mbsdIDNumberType,
      mbsdFile: 'thomas.jpg',
      mmedEducation: '-',
      mmedOccupation: '-',
      mmedIncome: '-',
    };
    let valid = true;
    if (!mbsdIDNumber) {
      valid = false;
    }
    if (!birthDate) {
      valid = false;
    }
    if (!mbsdBirthPlace) {
      valid = false;
    }
    if (!mbsdBloodType) {
      valid = false;
    }
    if (!mbsdNationality) {
      valid = false;
    }
    if (!mbsdCountry) {
      valid = false;
    }
    if (!mbsdCity) {
      valid = false;
    }
    if (!mbsdProvinces) {
      valid = false;
    }
    if (!mbsdAddress) {
      valid = false;
    }
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
    const res = await AuthService.setprofile(payload);
    console.info('Setprofile result: ', res);

    if (user?.linked.zmemAuusId[0].auusPhone !== phoneNumber) {
      const sendOtpRes = await AuthService.sendOTP({phoneNumber});
      console.info('SendOTP result: ', sendOtpRes);
      navigation.navigate('PhoneNumberValidation', {
        phoneNumber,
        onSuccess: async () => {
          try {
            setIsLoading(true);
            await AuthService.setprofile(payload);
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
      <Header title={I18n.t('profile.title')} left="back" />
      <ScrollView>
        <VStack space="4" mb="5">
          <TouchableOpacity onPress={() => {}}>
            <HStack
              space={2}
              paddingLeft={3}
              paddingRight={3}
              alignItems="center">
              <Avatar
                size="lg"
                source={{
                  // uri: 'https://robohash.org/bormar?set=set4',
                  uri:
                    user?.linked?.mbsdZmemId?.[0]?.mbsdFile &&
                    user?.linked.mbsdZmemId[0].mbsdFile !== '0'
                      ? 'https://facepool.oss-ap-southeast-5.aliyuncs.com/' +
                        user?.linked.mbsdZmemId[0].mbsdFile
                      : 'https://robohash.org/bormar?set=set4',
                }}>
                {getShortCodeName(user?.data[0].zmemFullName || 'Unknown Name')}
              </Avatar>
              <VStack paddingLeft={2}>
                <Text fontSize="md">Choose profile picture</Text>
              </VStack>
            </HStack>
          </TouchableOpacity>

          <VStack space="2.5" px="4">
            <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
              {I18n.t('label.accountInformation')}
            </Text>
            <VStack space="1.5">
              <TextInput
                placeholder="Enter your name"
                label="Name"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                placeholder="Enter your email"
                label="Email"
                _inputProps={{
                  isDisabled: true,
                }}
                value={email}
                // onChangeText={setEmail}
                // helperText="We will send verification code to this number for validation"
              />
              <TextInput
                placeholder="Enter your phone number"
                label="Phone number"
                helperText="We will send verification code to this number for validation"
                onChangeText={setPhoneNumber}
                value={phoneNumber}
              />
            </VStack>
          </VStack>
          <VStack space="2.5" px="4">
            <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
              Personal Data
            </Text>
            <VStack space="1.5">
              <SelectInput
                items={[
                  {
                    label: 'KTP',
                    value: '1',
                  },
                  {
                    label: 'SIM',
                    value: '2',
                  },
                  {
                    label: 'Passport',
                    value: '3',
                  },
                ]}
                placeholder="Choose identity type"
                label="Identity Type"
                onValueChange={setIDNumberType}
                value={mbsdIDNumberType}
              />
              <TextInput
                placeholder="Enter your identity number"
                label="Identity number"
                helperText="Enter your KTP/SIM/Passport ID number"
                onChangeText={setIDNumber}
              />
              <DateInput
                placeholder="DD MMM YYYY"
                label="Date of birth"
                date={birthDate}
                setDate={date => {
                  setBirthDate(date);
                }}
              />
              <TextInput
                placeholder="Enter your place of birth"
                label="Place of birth"
                onChangeText={setBirthPlace}
              />
              <SelectInput
                items={[
                  {
                    label: 'O',
                    value: '0',
                  },
                  {
                    label: 'O+',
                    value: '1',
                  },
                  {
                    label: 'O-',
                    value: '2',
                  },
                  {
                    label: 'A',
                    value: '3',
                  },
                  {
                    label: 'A+',
                    value: '4',
                  },
                  {
                    label: 'A-',
                    value: '5',
                  },
                  {
                    label: 'B',
                    value: '6',
                  },
                  {
                    label: 'B+',
                    value: '7',
                  },
                  {
                    label: 'B-',
                    value: '8',
                  },
                  {
                    label: 'AB',
                    value: '9',
                  },
                  {
                    label: 'AB+',
                    value: '10',
                  },
                  {
                    label: 'AB-',
                    value: '11',
                  },
                ]}
                placeholder="Choose blood type"
                label="Blood Type"
                onValueChange={setBloodType}
              />
              <SelectInput
                items={countries.map(({en_short_name}) => ({
                  label: en_short_name,
                  value: en_short_name,
                }))}
                placeholder="Choose country"
                label="Country"
                onValueChange={setCountry}
              />
              <SelectInput
                items={countries.map(({nationality}) => ({
                  label: nationality,
                  value: nationality,
                }))}
                placeholder="Choose nationality"
                label="Nationality"
                onValueChange={setNationality}
              />
            </VStack>
          </VStack>
          <VStack space="2.5" px="4">
            <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
              {I18n.t('label.addressInformation')}
            </Text>
            <VStack space="1.5">
              <TextInput
                placeholder="Enter province name"
                label="Province"
                onChangeText={setProvinces}
              />
              <TextInput
                placeholder="Enter city or district name"
                label="City/District"
                onChangeText={setCity}
              />
              <TextInput
                placeholder="Enter your address"
                label="Address"
                onChangeText={setAddress}
              />
            </VStack>
          </VStack>
          {/* <Box px="4">
            <Button h="12" onPress={setProfile} isLoading={isLoading}>
              {I18n.t('profile.buttonUpdate')}
            </Button>
          </Box> */}
        </VStack>
        <Box pb={100} />
      </ScrollView>
    </View>
  );
}
