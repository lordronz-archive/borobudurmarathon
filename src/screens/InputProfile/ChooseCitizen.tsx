import {useNavigation} from '@react-navigation/native';
import {
  ArrowBackIcon,
  Box,
  Button,
  Checkbox,
  HStack,
  Image,
  ScrollView,
  Text,
  Toast,
  useToast,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Heading} from '../../components/text/Heading';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Breadcrumbs from '../../components/header/Breadcrumbs';
import {Alert, BackHandler, Platform, TouchableOpacity} from 'react-native';
import IconIndonesia from '../../assets/icons/IconIndonesia';
import IconWNA from '../../assets/icons/IconWNA';
import useProfileStepper from '../../hooks/useProfileStepper';
import ImagePicker from '../../components/modal/ImagePicker';
import IconUpload from '../../assets/icons/IconUpload';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import DateInput from '../../components/form/DateInput';
import countries from '../../helpers/countries';
import VerifyID from '../../components/modal/VerifyID';
import httpRequest from '../../helpers/httpRequest';
import IconLocation from '../../assets/icons/IconLocation';
import {getErrorMessage} from '../../helpers/errorHandler';
import {AuthService} from '../../api/auth.service';
import {useAuthUser} from '../../context/auth.context';
import I18n from '../../lib/i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseCitizen'>;

export default function ChooseCitizenScreen({route}: Props) {
  const {user} = useAuthUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    step,
    setStep,
    citizen,
    setCitizen,
    identityImage,
    setIdentityImage,
    profile,
    setProfile,
    accountInformation,
    setAccountInformation,
    nextStep,
    prevStep,
    resetStepper,
  } = useProfileStepper();

  const [isLoading, setIsLoading] = useState(false);
  const [validationTry, setValidationTry] = useState(1);
  const [stepCount, setStepCount] = useState(1);
  const [profileStep, setProfileStep] = useState(1);
  const [visible, setVisible] = useState(false);
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenNotReadable, setIsOpenNotReadable] = React.useState(false);
  const [isAgreeTermsAndCondition, setIsAgreeTermsAndCondition] =
    React.useState<boolean>(false);
  const [isVerifyLater, setIsVerifyLater] = React.useState<boolean>(false);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const stepProperties = [
    {
      title: I18n.t('auth.chooseCitizenTitle'),
      subtitle: I18n.t('auth.chooseCitizenSubtitle'),
    },
    {
      title:
        citizen === 'WNI' ? I18n.t('auth.uploadIdTitle') : 'Upload Passport',
      subtitle:
        citizen === 'WNI'
          ? I18n.t('auth.uploadIdSubtitle')
          : 'Upload your Passport and please make sure still readable',
    },
    {
      note: I18n.t('step') + ' 1 ' + I18n.t('auth.of3Step'),
      title: I18n.t('account'),
      subtitle: I18n.t('auth.accountFormDesc'),
    },
    {
      note: I18n.t('step') + ' 2 ' + I18n.t('auth.of3Step'),
      title: 'Personal Data',
      subtitle: I18n.t('auth.accountFormDesc'),
    },
    {
      note: I18n.t('step') + ' 3 ' + I18n.t('auth.of3Step'),
      title: 'Address Information',
      subtitle: I18n.t('auth.accountFormDesc'),
    },
  ];

  function handleChangeProfilePic(image: any) {
    setIdentityImage(oldVal => ({
      ...oldVal,
      data: {
        mime: image.mime,
        path: image.path,
        modificationDate: image.modificationDate,
      },
    }));
  }

  const handleUpdatePhotoProfile = async () => {
    setIsLoading(true);
    if (!identityImage || !identityImage.data) {
      Toast.show({
        title: 'Please upload your ID',
      });
      setIsLoading(false);
      return;
    }

    try {
      let uri =
        Platform.OS === 'android'
          ? identityImage.data.path
          : identityImage.data.path.replace('file://', '');
      let uriSplit = uri.split('/');
      let name = uriSplit[uriSplit.length - 1];

      let formData = new FormData();
      formData.append('fileType', 'identity');
      formData.append('file', {
        name,
        type: identityImage.data.mime,
        uri,
      });

      const res = await httpRequest({
        url: 'https://repository.race.id/private',
        method: 'POST',
        headers: {
          Authorization: 'Api-Key=C00l&@lm!ghTyyA4pp',
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });

      console.log(res, 'upload ID');
      if (res && res.data && res.data.fileId) {
        Toast.show({title: 'Uploud ID Success'});
        console.log(res.data.fileId, 'fileId');

        setIdentityImage(oldVal => ({
          ...oldVal,
          fileId: res.data.fileId,
        }));
        nextStep();
        setStepCount(v => v + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsOpen(true);

    try {
      let resValidation;
      if (!isVerifyLater) {
        resValidation = await httpRequest({
          url: 'https://repository.race.id/validator',
          method: 'POST',
          headers: {
            Authorization: 'Api-Key=C00l&@lm!ghTyyA4pp',
            'Content-Type': 'application/json',
          },
          data: {
            fileId: identityImage.fileId,
            fileType: citizen === 'WNI' ? 'ktp' : 'passport',
            dataToValidate: {
              idNumber: profile.mbsdIDNumber,
              name: accountInformation.name,
              birthDate: '1999-06-07',
              birthPlace: profile.mbsdBirthPlace,
            },
          },
        });
      }

      console.log('resValidation', resValidation);

      if (
        (resValidation && resValidation.data && resValidation.data.isValid) ||
        isVerifyLater
      ) {
        if (
          '0' + user?.linked?.mbspZmemId?.[0]?.mbspNumber !==
          accountInformation.phoneNumber
        ) {
          const sendOtpRes = await AuthService.sendOTP({
            phoneNumber: accountInformation.phoneNumber,
          });
          console.info('SendOTP result: ', sendOtpRes);
          navigation.navigate('PhoneNumberValidation', {
            phoneNumber: accountInformation.phoneNumber,
            onSuccess: () => {
              setProfileAfterVerifyPhoneSuccess();
            },
          });
        } else {
          setProfileAfterVerifyPhoneSuccess();
        }
      } else {
        setIsOpenNotReadable(true);
        setValidationTry(v => v + 1);
      }
    } catch (err) {
      console.info(err, getErrorMessage(err), 'Failed confirm profile');
    } finally {
      setIsOpen(false);
    }
  };

  const setProfileAfterVerifyPhoneSuccess = async () => {
    try {
      setIsLoading(true);
      const profileData =
        citizen === 'WNI'
          ? {
              ...profile,
              mbsdNationality: 'Indonesian',
              mbsdCountry: 'Indonesia',
            }
          : profile;
      const res = await AuthService.setprofile(profileData);
      console.info('Setprofile result: ', res);

      navigation.navigate('Welcome');
    } catch (err) {
      Toast.show({
        title: 'Failed to save',
        description: getErrorMessage(err),
      });
    } finally {
      setIsLoading(false);
      resetStepper();
      setStepCount(1);
      setProfileStep(1);
    }
  };

  console.log(isAgreeTermsAndCondition);

  return (
    <VStack px="4" flex="1">
      <VStack>
        <Breadcrumbs
          titles={['Citizen', 'Upload ID', 'Profile']}
          step={stepCount + 1}
        />
        <VStack space="1" mt={'12px'}>
          {stepCount === 3 && (
            <Text fontWeight={400} color="#9FACBF" fontSize={12}>
              {stepProperties[stepCount - 1 + profileStep - 1].note}
            </Text>
          )}
          <Heading>
            {stepProperties[stepCount - 1 + profileStep - 1]?.title}
          </Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            {stepProperties[stepCount - 1 + profileStep - 1].subtitle}
          </Text>
        </VStack>
      </VStack>
      <ScrollView flex={1}>
        {step === 'choose-citizen' && (
          <VStack my="3" space="2">
            <TouchableOpacity
              style={{width: '100%', height: 200}}
              onPress={() => setCitizen('WNI')}>
              <Box
                w="full"
                h="full"
                justifyContent="center"
                alignItems={'center'}
                borderColor={citizen === 'WNI' ? 'primary.900' : '#C5CDDB'}
                borderWidth="2"
                borderRadius="10px">
                <IconIndonesia />
                <Text>{I18n.t('auth.selectCitizenCard')}</Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: '100%', height: 200}}
              onPress={() => setCitizen('WNA')}>
              <Box
                w="full"
                h="full"
                justifyContent="center"
                alignItems={'center'}
                borderColor={citizen === 'WNA' ? 'primary.900' : '#C5CDDB'}
                borderWidth="2"
                borderRadius="10px">
                <IconWNA />
                <Text>{I18n.t('auth.selectCitizenCardWna')}</Text>
              </Box>
            </TouchableOpacity>
          </VStack>
        )}
        {step === 'upload-id' && (
          <VStack my="3" space="2">
            <TouchableOpacity
              style={{width: '100%', height: 200}}
              onPress={() => setVisible(true)}>
              {identityImage && identityImage.data ? (
                <Box
                  p="1"
                  justifyContent="center"
                  alignItems={'center'}
                  borderColor={'primary.900'}
                  borderWidth="1"
                  borderRadius="10px"
                  borderStyle={'dashed'}>
                  <Image
                    source={{
                      uri: identityImage.data.path,
                    }}
                    resizeMode={'cover'}
                    size={'full'}
                    alt="ID Image"
                  />
                </Box>
              ) : (
                <Box
                  w="full"
                  h="full"
                  justifyContent="center"
                  alignItems={'center'}
                  borderColor={'#C5CDDB'}
                  borderWidth="1"
                  borderRadius="10px"
                  borderStyle={'dashed'}>
                  <IconUpload />
                  <Text>{I18n.t('auth.uploadId')}</Text>
                </Box>
              )}
            </TouchableOpacity>
            <Text color="#768499" fontSize={10}>
              {I18n.t('auth.maxIdSize')}
            </Text>
            <ImagePicker
              setVisible={setVisible}
              visible={visible}
              onChange={image => {
                if (image.size <= 5 * 1e6) {
                  handleChangeProfilePic(image);
                } else {
                  toast.show({
                    id: 'id-image-too-big',
                    description:
                      'ID Image is too big, maximum file size is 5 MB',
                  });
                }
              }}
            />
          </VStack>
        )}
        {step === 'profile' && (
          <>
            {stepCount === 3 && profileStep === 1 && (
              <VStack my="3" space="2">
                <TextInput
                  placeholder="Enter your name"
                  label="Name"
                  helperText="Name as stated on your official ID document"
                  value={accountInformation.name}
                  onChangeText={val =>
                    setAccountInformation(oldVal => ({
                      ...oldVal,
                      name: val,
                    }))
                  }
                />
                <TextInput
                  placeholder="Enter your phone number"
                  label="Phone number"
                  helperText={I18n.t('auth.willSendToPhone')}
                  value={accountInformation.phoneNumber}
                  onChangeText={val =>
                    setAccountInformation(oldVal => ({
                      ...oldVal,
                      phoneNumber: val,
                    }))
                  }
                />
              </VStack>
            )}
            {stepCount === 3 && profileStep === 2 && (
              <VStack my="3" space="2">
                <TextInput
                  placeholder="Enter your identity number"
                  label="Identity Number"
                  helperText={`Enter your ${
                    citizen === 'WNI' ? 'KTP' : 'Passport'
                  } ID number`}
                  value={profile.mbsdIDNumber}
                  onChangeText={val =>
                    setProfile(oldVal => ({
                      ...oldVal,
                      mbsdIDNumber: val,
                      mbsdIDNumberType: citizen === 'WNA' ? 1 : 3,
                    }))
                  }
                />
                <SelectInput
                  items={[
                    {
                      label: 'Male',
                      value: '1',
                    },
                    {
                      label: 'Female',
                      value: '2',
                    },
                  ]}
                  placeholder="Choose gender"
                  label="Gender"
                  value={profile.mbsdGender}
                  onValueChange={val =>
                    setProfile(oldVal => ({
                      ...oldVal,
                      mbsdGender: val,
                    }))
                  }
                />
                <DateInput
                  date={accountInformation.birthdate}
                  setDate={date => {
                    setAccountInformation(oldVal => ({
                      ...oldVal,
                      birthdate: date,
                    }));
                    setProfile(oldVal => ({
                      ...oldVal,
                      mbsdBirthDate: date.toJSON().slice(0, 10),
                    }));
                  }}
                  placeholder="DD MMM YYYY"
                  label="Date of birth"
                />
                <TextInput
                  placeholder="Enter your place of birth"
                  label="Place of birth"
                  value={profile.mbsdBirthPlace}
                  onChangeText={val =>
                    setProfile(oldVal => ({
                      ...oldVal,
                      mbsdBirthPlace: val,
                    }))
                  }
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
                  value={profile.mbsdBloodType?.toString()}
                  placeholder="Choose blood type"
                  label="Blood Type"
                  onValueChange={val =>
                    setProfile(oldVal => ({
                      ...oldVal,
                      mbsdBloodType: Number(val),
                    }))
                  }
                />
                {citizen === 'WNA' && (
                  <>
                    <SelectInput
                      items={countries.map(({en_short_name}) => ({
                        label: en_short_name,
                        value: en_short_name,
                      }))}
                      value={profile.mbsdCountry}
                      placeholder="Choose your country"
                      label="Country"
                      onValueChange={val =>
                        setProfile(oldVal => ({
                          ...oldVal,
                          mbsdCountry: val,
                        }))
                      }
                    />
                    <SelectInput
                      items={countries.map(({nationality}) => ({
                        label: nationality,
                        value: nationality,
                      }))}
                      value={profile.mbsdNationality}
                      placeholder="Choose your nationality"
                      label="Nationality"
                      onValueChange={val =>
                        setProfile(oldVal => ({
                          ...oldVal,
                          mbsdNationality: val,
                        }))
                      }
                    />
                  </>
                )}
              </VStack>
            )}
            {stepCount === 3 && profileStep === 3 && (
              <VStack my="3" space="2">
                {citizen === 'WNI' ? (
                  <Box
                    p={'16px'}
                    borderStyle={'solid'}
                    borderWidth={1}
                    borderRadius={3}
                    borderColor={'#E8ECF3'}>
                    <Box
                      mb={'16px'}
                      flexDirection={'row'}
                      alignItems={'center'}>
                      <IconLocation />
                      <VStack marginLeft={'16px'}>
                        {profile.mbsdCity &&
                        profile.mbsdProvinces &&
                        profile.mbsdAddress ? (
                          <>
                            <Text
                              fontSize={'14px'}
                              fontWeight={600}
                              color={'#1E1E1E'}>
                              {profile.mbsdCity}
                            </Text>
                            <Text
                              fontSize={'10px'}
                              fontWeight={400}
                              color={'#768499'}>
                              {profile.mbsdAddress}
                            </Text>
                          </>
                        ) : (
                          <Text
                            fontSize={'14px'}
                            fontWeight={400}
                            color={'#768499;'}>
                            No Address Yet...
                          </Text>
                        )}
                      </VStack>
                    </Box>
                    <Button
                      bgColor={'#fff'}
                      borderStyle={'solid'}
                      borderWidth={1}
                      borderRadius={8}
                      borderColor={'#EB1C23'}
                      color={'#EB1C23'}
                      onPress={() => navigation.navigate('SearchLocation')}>
                      <Text color={'#EB1C23'}>
                        {profile.mbsdCity &&
                        profile.mbsdProvinces &&
                        profile.mbsdAddress
                          ? 'Edit'
                          : 'Choose your address'}
                      </Text>
                    </Button>
                  </Box>
                ) : (
                  <TextInput
                    placeholder="Enter your address"
                    label="Address"
                    value={profile.mbsdAddress}
                    onChangeText={val =>
                      setProfile(oldVal => ({
                        ...oldVal,
                        mbsdAddress: val,
                      }))
                    }
                  />
                )}
              </VStack>
            )}
          </>
        )}
      </ScrollView>
      {stepCount === 3 && profileStep === 3 && (
        <Box backgroundColor={'#F4F6F9'} py="3" px="4" pr="8">
          <Checkbox
            value={isAgreeTermsAndCondition.toString()}
            onChange={setIsAgreeTermsAndCondition}
            isDisabled={isLoading}>
            <Text fontSize={'12px'} fontWeight={600} ml={'10px'} flex={1}>
              By continuing I understand, know, and am willing to comply with
              all the terms & conditions of the borobudur marathon.
            </Text>
          </Checkbox>
          {validationTry >= 3 && (
            <Checkbox
              mt={'20px'}
              value={isVerifyLater.toString()}
              onChange={setIsVerifyLater}
              isDisabled={isLoading}>
              <HStack flex={1}>
                <VStack ml={'10px'} flex={1}>
                  <Text fontSize={'12px'} fontWeight={600}>
                    Verify profile data later?
                  </Text>
                  <Text fontSize={'10px'} fontWeight={400}>
                    If your profile data isn’t validated you can’t register for
                    competition event.
                  </Text>
                </VStack>
                <Text fontSize={'12px'} fontWeight={600} underline>
                  See more info
                </Text>
              </HStack>
            </Checkbox>
          )}
        </Box>
      )}
      <HStack my={3} space={'10px'}>
        {stepCount > 1 && (
          <Button
            h="12"
            backgroundColor={'#E7F3FC'}
            borderRadius={'8px'}
            onPress={() => {
              if (profileStep > 1) {
                setProfileStep(v => (v > 1 ? v - 1 : v));
              } else {
                prevStep();
                setStepCount(v => (v > 1 ? v - 1 : v));
              }
            }}
            isLoading={isLoading}>
            <ArrowBackIcon color={'#1E1E1E'} />
          </Button>
        )}
        <Button
          flex={1}
          h="12"
          borderRadius={'8px'}
          onPress={async () => {
            if (stepCount === 3) {
              if (profileStep === 1) {
                if (accountInformation.name && accountInformation.phoneNumber) {
                  setProfileStep(v => v + 1);
                } else {
                  Toast.show({
                    title: 'Not Completed',
                    description: 'Please complete the required data.',
                  });
                }
              }
              if (profileStep === 2) {
                if (
                  profile.mbsdIDNumber &&
                  profile.mbsdGender &&
                  profile.mbsdBirthDate &&
                  profile.mbsdBirthPlace &&
                  profile.mbsdBloodType
                ) {
                  setProfileStep(v => v + 1);
                } else {
                  Toast.show({
                    title: 'Not Completed',
                    description: 'Please complete the required data.',
                  });
                }
              }
              if (profileStep === 3) {
                if (profile.mbsdAddress && isAgreeTermsAndCondition) {
                  handleConfirm();
                } else {
                  Toast.show({
                    title: 'Not Completed',
                    description: 'Please complete the required data.',
                  });
                }
              }
            } else {
              if (step === 'choose-citizen') {
                if (citizen) {
                  nextStep();
                  setStepCount(v => v + 1);
                } else {
                  Toast.show({
                    title: 'Please choose your citizen',
                  });
                }
              }
              if (step === 'upload-id') {
                await handleUpdatePhotoProfile();
              }
            }
          }}
          isLoading={isLoading}>
          {profileStep === 3 ? I18n.t('confirm') : I18n.t('next')}
        </Button>
      </HStack>
      <VerifyID
        cancelRef={cancelRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPress={() => {
          setIsOpen(false);
        }}
        isLoading
        title={'Verify your ID'}
        content={'Please wait a moment while we try to verify your ID'}
        buttonContent={'Check My Event'}
      />
      <VerifyID
        cancelRef={cancelRef}
        isOpen={isOpenNotReadable}
        onClose={() => {
          setIsOpenNotReadable(false);
          nextStep();
          setStepCount(v => v + 1);
        }}
        onPress={() => {
          setIsOpenNotReadable(false);
          nextStep();
          setStepCount(v => v + 1);
        }}
        title={'Your ID is not readable'}
        content={
          "Sorry we can't verify your ID please re-upload your ID or select Verify ID later"
        }
        buttonContent={'Close'}
      />
    </VStack>
  );
}
