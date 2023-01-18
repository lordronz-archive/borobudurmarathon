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
} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import BMButton from '../../components/buttons/Button';
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

export default function UpdateProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {user} = useAuthUser();

  const [fullName, setFullName] = useState<string>(
    user?.data[0].zmemFullName || '',
  );
  const [birthDate, setBirthDate] = useState<Date>(
    new Date(user?.linked.mbsdZmemId[0].mbsdBirthDate) || '',
  );
  const [email] = useState<string>(user?.linked.zmemAuusId[0].auusEmail || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(
    user?.linked.zmemAuusId[0].auusPhone || '',
  );
  const [mbsdIDNumber, setIDNumber] = useState<string>(
    user?.linked.mbsdZmemId[0].mbsdIDNumber || '',
  );
  const [mbsdBirthPlace, setBirthPlace] = useState<string>(
    user?.linked.mbsdZmemId[0].mbsdBirthPlace || '',
  );
  const [mbsdBloodType, setBloodType] = useState<string>();
  const [mbsdNationality, setNationality] = useState<string>();
  const [mbsdCountry, setCountry] = useState<string>();
  const [mbsdAddress, setAddress] = useState<string>();
  const [mbsdCity, setCity] = useState<string>();
  const [mbsdProvinces, setProvinces] = useState<string>();

  const setProfile = async () => {
    const payload = {
      mbsdIDNumber,
      mbsdBirthDate: birthDate,
      mbsdBirthPlace,
      mbsdBloodType,
      mbsdNationality,
      mbsdCountry,
      mbsdCity,
      mbsdProvinces,
      mbsdAddress,
      mbsdRawAddress: '-',
      mbsdIDNumberType: 0,
      mbsdFile: 0,
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
      return;
    }
    const res = await AuthService.setprofile(payload);
    const sendOtpRes = await AuthService.sendOTP({phoneNumber});
    console.info('Setprofile result: ', res);
    console.info('SendOTP result: ', sendOtpRes);
    navigation.navigate('PhoneNumberValidation', {
      phoneNumber,
    });
  };

  return (
    <View>
      <Header title="Edit Profile" left="back" />
      <ScrollView>
        <VStack space="4" mb="5">
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateProfile')}>
            <HStack
              space={2}
              paddingLeft={3}
              paddingRight={3}
              alignItems="center">
              <Avatar
                size="lg"
                source={{
                  // uri: 'https://robohash.org/bormar?set=set4',
                  uri: '',
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
                  setMbsdBirthDate(date.toJSON().slice(0, 10));
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
          <Box px="4">
            <BMButton h="12" onPress={setProfile}>
              Update Profile
            </BMButton>
          </Box>
        </VStack>
        <Box pb={100} />
      </ScrollView>
    </View>
  );
}
