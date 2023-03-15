import {
  Box,
  Text,
  VStack,
  ScrollView,
  View,
  HStack,
  Avatar,
  Button,
} from 'native-base';
import React, {useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import DateInput from '../../components/form/DateInput';
import countries from '../../helpers/countries';
import Header from '../../components/header/Header';
import {getShortCodeName} from '../../helpers/name';
import {useAuthUser} from '../../context/auth.context';
import ImagePicker from '../../components/modal/ImagePicker';
import httpRequest from '../../helpers/httpRequest';
import {ProfileService} from '../../api/profile.service';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

export default function UpdateProfileScreen() {
  const {user} = useAuthUser();
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [isShowImagePickerModal, setIsShowImagePickerModal] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<any>();

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
    '0' + user?.linked?.mbspZmemId?.[0]?.mbspNumber || '',
  );
  const [mbsdIDNumberType, setIDNumberType] = useState<string>(
    user?.linked?.mbsdZmemId?.[0]?.mbsdIDNumberType.toString() || '',
  );
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

  function handleChangeProfilePic(image: any) {
    console.log(image);
    setProfilePic({
      mime: image.mime,
      path: image.path,
      modificationDate: image.modificationDate,
    });
  }

  const handleUpdatePhotoProfile = async () => {
    setIsLoading(true);
    if (!profilePic) {
      return;
    }

    try {
      let uri =
        Platform.OS === 'android'
          ? profilePic.path
          : profilePic.path.replace('file://', '');
      let uriSplit = uri.split('/');
      let name = uriSplit[uriSplit.length - 1];

      let formData = new FormData();
      formData.append('fileType', 'avatar');
      formData.append('file', {
        name,
        type: profilePic.mime,
        uri,
      });

      const res = await httpRequest({
        url: 'https://repository.race.id/public',
        method: 'POST',
        headers: {
          Authorization: 'Api-Key=C00l&@lm!ghTyyA4pp',
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });

      console.log(res, 'save Image');

      if (res.data) {
        const result = await ProfileService.updatePhoto(res.data.fileId);
        console.log(result, 'save ID');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Header title={t('profile.title')} left="back" />
      <ScrollView>
        <VStack space="4" mb="5">
          <TouchableOpacity onPress={() => setIsShowImagePickerModal(true)}>
            <HStack
              space={2}
              paddingLeft={3}
              paddingRight={3}
              alignItems="center">
              <Avatar
                bg="gray.400"
                mx={2}
                source={{
                  uri:
                    profilePic?.path ||
                    `https://openpub.oss-ap-southeast-5.aliyuncs.com/${user?.data[0]?.zmemPhoto}` ||
                    '',
                }}>
                {getShortCodeName(user?.data[0].zmemFullName || '')}
              </Avatar>
              <VStack paddingLeft={2}>
                <Text fontSize="md">Choose profile picture</Text>
              </VStack>
            </HStack>
          </TouchableOpacity>

          <VStack space="2.5" px="4">
            <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
              {t('label.accountInformation')}
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
                _inputProps={{
                  keyboardType: 'numeric',
                }}
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
                  // {
                  //   label: 'SIM',
                  //   value: '2',
                  // },
                  // {
                  //   label: 'Passport',
                  //   value: '3',
                  // },
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
                value={mbsdIDNumber}
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
                value={mbsdBirthPlace}
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
                value={mbsdBloodType}
              />
              <SelectInput
                items={countries.map(({en_short_name}) => ({
                  label: en_short_name,
                  value: en_short_name,
                }))}
                placeholder="Choose country"
                label="Country"
                value={mbsdCountry}
                onValueChange={setCountry}
              />
              <SelectInput
                items={countries.map(({nationality}) => ({
                  label: nationality,
                  value: nationality,
                }))}
                value={mbsdNationality}
                placeholder="Choose nationality"
                label="Nationality"
                onValueChange={setNationality}
              />
            </VStack>
          </VStack>
          <VStack space="2.5" px="4">
            <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
              {t('label.addressInformation')}
            </Text>
            <VStack space="1.5">
              <TextInput
                placeholder="Enter province name"
                label="Province"
                value={mbsdProvinces}
                onChangeText={setProvinces}
              />
              <TextInput
                placeholder="Enter city or district name"
                label="City/District"
                onChangeText={setCity}
                value={mbsdCity}
              />
              <TextInput
                placeholder="Enter your address"
                label="Address"
                value={mbsdAddress}
                onChangeText={setAddress}
              />
            </VStack>
          </VStack>
          <VStack space="2.5" px="4">
            <Button isLoading={isLoading} onPress={handleUpdatePhotoProfile}>
              Update Photo Profile
            </Button>
          </VStack>
        </VStack>
        <Box pb={100} />
      </ScrollView>
      <ImagePicker
        visible={isShowImagePickerModal}
        setVisible={setIsShowImagePickerModal}
        onChange={image => handleChangeProfilePic(image)}
      />
    </View>
  );
}
