import {useNavigation} from '@react-navigation/native';
import {
  ArrowBackIcon,
  Box,
  Checkbox,
  HStack,
  Image,
  ScrollView,
  Spinner,
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
import {
  Alert,
  BackHandler,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {useTranslation} from 'react-i18next';
import {BLOOD_OPTIONS} from '../../assets/data/blood';
import {cleanPhoneNumber} from '../../helpers/phoneNumber';
import Button from '../../components/buttons/Button';
import {useDemo} from '../../context/demo.context';
import {getIDNumberType} from '../../assets/data/ktpPassport';
import {GENDER_OPTIONS} from '../../assets/data/gender';
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import useInit from '../../hooks/useInit';
import AppContainer from '../../layout/AppContainer';
import {getApiErrors} from '../../helpers/apiErrors';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseCitizen'>;

const PROCESSING_MESSAGES = [
  {
    title: 'Processing...',
    content: 'Your ID still in processing to validate.',
  },
  {
    title: 'We still check your ID',
    content: 'Please wait... Your ID still in processing to validate.',
  },
  {
    title: 'Please wait...',
    content: 'We still processing to validate.',
  },
];

const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 640;

export default function ChooseCitizenScreen({route}: Props) {
  const {user} = useAuthUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {demoKTPVerification} = useDemo();
  const {t} = useTranslation();
  const {getProfile} = useInit();

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
  const [validationTryProcessing, setValidationTryProcessing] = useState(1);
  const [stepCount, setStepCount] = useState(1);
  const [profileStep, setProfileStep] = useState(1);
  const [visible, setVisible] = useState(false);
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const cancelRefInvalid = React.useRef(null);
  const cancelRefProcessing = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenNotReadable, setIsOpenNotReadable] = React.useState(false);
  const [isOpenProcessing, setIsOpenProcessing] = useState(false);
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

  useEffect(() => {
    setAccountInformation({
      name:
        user?.linked.mbsdZmemId?.[0]?.mbsdFullName ||
        user?.data?.[0]?.zmemFullName ||
        '',
      phoneNumber:
        cleanPhoneNumber(user?.linked.zmemAuusId[0]?.auusPhone) || '',
      birthdate: user?.linked.mbsdZmemId?.[0]?.mbsdBirthDate
        ? new Date(user?.linked.mbsdZmemId?.[0]?.mbsdBirthDate)
        : undefined,
    });
    setProfile({
      mbsdIDNumber: user?.linked.mbsdZmemId?.[0]?.mbsdIDNumber || '',
      mbsdBirthDate: user?.linked.mbsdZmemId?.[0]?.mbsdBirthDate || '',
      mbsdBirthPlace: user?.linked.mbsdZmemId?.[0]?.mbsdBirthPlace || '',
      mbsdGender: user?.linked?.mbsdZmemId?.[0]?.mbsdGender
        ? String(user?.linked?.mbsdZmemId?.[0]?.mbsdGender)
        : user?.data && user?.data.length > 0 && user?.data[0].zmemGender
        ? String(user?.data[0].zmemGender)
        : '0',
      mbsdBloodType: user?.linked.mbsdZmemId?.[0]?.mbsdBloodType
        ? Number(user?.linked.mbsdZmemId?.[0]?.mbsdBloodType)
        : 0,
      mbsdNationality: user?.linked.mbsdZmemId?.[0]?.mbsdNationality || '',
      mbsdCountry: user?.linked.mbsdZmemId?.[0]?.mbsdCountry || '',
      mbsdCity: user?.linked.mbsdZmemId?.[0]?.mbsdCity || '',
      mbsdProvinces: user?.linked.mbsdZmemId?.[0]?.mbsdProvinces || '',
      mbsdAddress: user?.linked.mbsdZmemId?.[0]?.mbsdAddress || '',
      mbsdRawAddress: user?.linked.mbsdZmemId?.[0]?.mbsdAddress || '',
      mbsdIDNumberType: user?.linked.mbsdZmemId?.[0]?.mbsdIDNumberType
        ? Number(user?.linked.mbsdZmemId?.[0]?.mbsdIDNumberType)
        : 0,
      mbsdFile: user?.linked.mbsdZmemId?.[0]?.mbsdFile
        ? Number(user?.linked.mbsdZmemId?.[0]?.mbsdFile)
        : 0,
      mmedEducation: user?.linked.mmedZmemId?.[0]?.mmedEducation || '-',
      mmedOccupation: user?.linked.mmedZmemId?.[0]?.mmedOccupation || '-',
      mmedIncome: user?.linked.mmedZmemId?.[0]?.mmedIncome || '-',
    });
    setCitizen(
      user?.linked.mbsdZmemId?.[0]?.mbsdNationality === 'Indonesian' ||
        Number(user?.linked.mbsdZmemId?.[0]?.mbsdIDNumberType) === 1
        ? 'WNI'
        : 'WNA',
    );
  }, []);

  const stepProperties = [
    {
      title: t('auth.chooseCitizenTitle'),
      subtitle: t('auth.chooseCitizenSubtitle'),
    },
    {
      title: citizen === 'WNI' ? t('auth.uploadIdTitle') : 'Upload Passport',
      subtitle:
        citizen === 'WNI'
          ? t('auth.uploadIdSubtitle')
          : 'Upload your Passport and please make sure still readable',
    },
    {
      note: t('step') + ' 1 ' + t('auth.of3Step'),
      title: t('account'),
      subtitle: t('auth.accountFormDesc'),
    },
    {
      note: t('step') + ' 2 ' + t('auth.of3Step'),
      title: 'Personal Data',
      subtitle: t('auth.accountFormDesc'),
    },
    {
      note: t('step') + ' 3 ' + t('auth.of3Step'),
      title: 'Address Information',
      subtitle: t('auth.accountFormDesc'),
    },
  ];

  function handleChangeIdentityFile(image: ImageOrVideo) {
    setIdentityImage(oldVal => ({
      ...oldVal,
      data: {
        mime: image.mime,
        path: image.path,
        modificationDate: image.modificationDate,
      },
      rawFile: image,
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
        Toast.show({title: 'Upload ID Success'});
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
    if (!isOpenProcessing) {
      setIsOpen(true);
    }

    if (demoKTPVerification === 'processing') {
      identityImage.fileId = 'NjabOxzEq8AQJTFvSCy1JqHXIro50kxe';
    } else if (demoKTPVerification === 'invalid') {
      identityImage.fileId = '7Gu3xhcXkjUHBf3HOPRemqLAY7VyImTG';
    }
    // ini contoh yg masih processing NjabOxzEq8AQJTFvSCy1JqHXIro50kxe
    // ini yg error 7Gu3xhcXkjUHBf3HOPRemqLAY7VyImTG

    try {
      let resValidation;
      console.info('profile', profile);
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
              birthDate: profile.mbsdBirthDate,
              birthPlace: profile.mbsdBirthPlace,
            },
          },
        });
      }

      console.log('resValidation', resValidation);

      if (
        resValidation &&
        resValidation.data &&
        resValidation.data.isProcessing
      ) {
        console.info(
          'resValidation.data.isProcessing TRUE',
          JSON.stringify(resValidation.data),
        );
        console.info('validationTryProcessing', validationTryProcessing);
        // toast.show({
        //   title: 'Processing',
        //   description: 'Your ID still in processing to validate.',
        // });
        setIsOpen(false);
        setIsOpenProcessing(true);
        setValidationTryProcessing(validationTryProcessing + 1);

        if (validationTryProcessing >= 5) {
          console.info('validationTryProcessing >= 5', validationTryProcessing);
          setIsVerifyLater(true);
        } else {
          console.info('validationTryProcessing', validationTryProcessing);
          setTimeout(() => {
            handleConfirm();
          }, 3000);
        }
      } else if (
        (resValidation && resValidation.data && resValidation.data.isValid) ||
        isVerifyLater
      ) {
        console.info(
          'user?.linked?.zmemAuusId?.[0]?.auusPhone',
          user?.linked?.zmemAuusId?.[0]?.auusPhone,
        );
        console.info(
          'accountInformation.phoneNumber',
          accountInformation.phoneNumber,
        );
        if (
          cleanPhoneNumber(user?.linked?.zmemAuusId?.[0]?.auusPhone) !==
          cleanPhoneNumber(accountInformation.phoneNumber)
        ) {
          try {
            const sendOtpRes = await AuthService.sendOTP({
              phoneNumber: cleanPhoneNumber(accountInformation.phoneNumber),
            });
            console.info('SendOTP result: ', sendOtpRes);
            navigation.navigate('PhoneNumberValidation', {
              phoneNumber:
                cleanPhoneNumber(accountInformation.phoneNumber) || '',
              onSuccess: () => {
                setProfileAfterVerifyPhoneSuccess();
              },
            });
          } catch (err) {
            toast.show({
              title: 'Failed to send otp',
              description: getErrorMessage(err),
            });
            setProfileStep(1);
          }
        } else {
          setProfileAfterVerifyPhoneSuccess();
        }
        setIsOpen(false);
      } else if (
        resValidation &&
        resValidation.data &&
        !resValidation.data.isValid
      ) {
        toast.show({
          title: 'Invalid ID',
          description:
            resValidation.data.message || 'Please check your ID and try again',
        });
        setIsOpenNotReadable(true);
        setValidationTry(v => v + 1);
        setIsOpen(false);
      } else {
        toast.show({
          title: 'Invalid ID',
          description: 'Please recheck your ID and try again',
        });
        setIsOpenNotReadable(true);
        setValidationTry(v => v + 1);
        setIsOpen(false);
      }
    } catch (err: any) {
      if (err.status === 400) {
        toast.show({
          title: 'Invalid ID',
          description:
            getErrorMessage(err) || 'Please check your ID and try again',
        });
        setIsOpenNotReadable(true);
        setValidationTry(v => v + 1);
      } else {
        toast.show({
          title: 'Failed',
          description: 'Please try again later',
        });
        console.info(err, getErrorMessage(err), 'Failed confirm profile');
        setValidationTry(v => v + 1);
      }
      setIsOpen(false);
    }
  };

  const setProfileAfterVerifyPhoneSuccess = async () => {
    try {
      setIsLoading(true);
      let profileData: any =
        citizen === 'WNI'
          ? {
              ...profile,
              mbsdFile: identityImage.fileId,
              mbsdNationality: 'Indonesian',
              mbsdCountry: 'Indonesia',
              mbsdIDNumberType: getIDNumberType(citizen).value,
            }
          : {
              ...profile,
              mbsdFile: identityImage.fileId,
              mbsdIDNumberType: getIDNumberType(citizen).value,
            };
      if (accountInformation && accountInformation.name) {
        profileData = {
          ...profileData,
          mbsdFullName: accountInformation.name,
        };
      }
      console.info(
        'setProfileAfterVerifyPhoneSuccess-->profileData',
        JSON.stringify(profileData),
      );
      const res = await AuthService.setprofile(profileData);
      console.info('Setprofile result: ', res);
      getProfile();

      navigation.replace('Welcome');

      resetStepper();
      setStepCount(1);
      setProfileStep(1);
    } catch (err) {
      const objErrors = getApiErrors(err);
      console.info('objErrors', objErrors);
      if (objErrors) {
        Toast.show({
          title: 'Failed to save profile',
          description: Object.keys(objErrors)
            .map(field => `${objErrors[field]} [${field}]`)
            .join('. '),
        });
      } else {
        Toast.show({
          title: 'Failed to save',
          description: getErrorMessage(err),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      useIsFocused: false,
    })
      .then(image => {
        console.info('openCamera image result', image);
        onChangeFile(image);
        setVisible(false);
      })
      .catch(err => {
        toast.show({
          description: getErrorMessage(err),
        });
        console.log('ERROR OPEN CAMERA =>>> ', err);
        if (getErrorMessage(err).includes('simulator')) {
          setVisible(true);
        }
      });
  };

  const onChangeFile = (image: ImageOrVideo) => {
    if (image.size <= 5 * 1e6) {
      handleChangeIdentityFile(image);
    } else {
      toast.show({
        id: 'id-image-too-big',
        description: 'ID Image is too big, maximum file size is 5 MB',
      });
    }
  };

  const isDisabledButton = () => {
    if (step === 'profile') {
      if (profileStep === 1) {
        return !accountInformation.name || !accountInformation.phoneNumber;
      } else if (profileStep === 2) {
        return (
          !profile.mbsdIDNumber ||
          !profile.mbsdGender ||
          !profile.mbsdBirthDate ||
          !profile.mbsdBirthPlace ||
          !(
            profile.mbsdBloodType !== null ||
            profile.mbsdBloodType !== undefined
          )
        );
      } else if (profileStep === 3) {
        return !profile.mbsdAddress || !isAgreeTermsAndCondition;
      } else {
        return false;
      }
    } else if (step === 'choose-citizen') {
      return !citizen;
    } else if (step === 'upload-id') {
      return !identityImage || (identityImage && !identityImage.data);
    }
  };
  console.log(isAgreeTermsAndCondition);

  return (
    <AppContainer>
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
                  <Text>{t('auth.selectCitizenCard')}</Text>
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
                  <Text>{t('auth.selectCitizenCardWna')}</Text>
                </Box>
              </TouchableOpacity>
            </VStack>
          )}
          {step === 'upload-id' && (
            <VStack my="3" space="2">
              <TouchableOpacity
                style={{width: '100%', height: 200}}
                onPress={() => {
                  openCamera();
                }}>
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
                      resizeMode={'contain'}
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
                    <Text>{t('auth.uploadId')}</Text>
                  </Box>
                )}
              </TouchableOpacity>
              {isLoading && (
                <View
                  style={{
                    width: '100%',
                    height: 200,
                    position: 'absolute',
                    justifyContent: 'center',
                    backgroundColor: '#f2f2f2',
                    opacity: 0.5,
                  }}>
                  <Spinner />
                </View>
              )}
              <Text color="#768499" fontSize={10}>
                {t('auth.maxIdSize')}
              </Text>

              {identityImage.rawFile ? (
                <>
                  <Text color="#768499" fontSize={10}>
                    ~ {identityImage.rawFile.width}x
                    {identityImage.rawFile.height}
                    px
                    {/* ({identityImage.rawFile.mime}) */}
                  </Text>
                </>
              ) : (
                false
              )}

              <ImagePicker
                setVisible={setVisible}
                visible={visible}
                onChange={image => {
                  if (image.size <= 5 * 1e6) {
                    handleChangeIdentityFile(image);
                  } else {
                    toast.show({
                      id: 'id-image-too-big',
                      description:
                        'ID Image is too big, maximum file size is 5 MB',
                    });
                  }
                }}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
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
                    helperText={t('auth.willSendToPhone')}
                    value={accountInformation.phoneNumber}
                    keyboardType="numeric"
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
                    placeholder={'Enter your identity number'}
                    label={`Identity Number (${
                      getIDNumberType(citizen).label
                    })`}
                    helperText={`Enter your ${
                      citizen === 'WNI' ? 'KTP' : 'Passport'
                    } ID number`}
                    value={profile.mbsdIDNumber}
                    onChangeText={val =>
                      setProfile(oldVal => ({
                        ...oldVal,
                        mbsdIDNumber: val,
                        mbsdIDNumberType: getIDNumberType(citizen).id,
                      }))
                    }
                    keyboardType={'numeric'}
                  />
                  <SelectInput
                    items={GENDER_OPTIONS}
                    placeholder="Choose gender"
                    label="Gender"
                    hideSearch
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
                    items={BLOOD_OPTIONS}
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
                        onPress={() => navigation.navigate('SearchLocation')}>
                        {profile.mbsdCity &&
                        profile.mbsdProvinces &&
                        profile.mbsdAddress
                          ? 'Edit'
                          : 'Choose your address'}
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
                          mbsdRawAddress: val,
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
                {t('termsAndConditionsAgreement')}
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
                    <HStack justifyContent="space-between">
                      <Text fontSize={'12px'} fontWeight={600}>
                        {t('profile.verifyProfileDataLater')}
                      </Text>
                      <Text fontSize={'11px'} fontWeight={600} underline>
                        {t('seeMoreInfo')}
                      </Text>
                    </HStack>
                    <Text fontSize={'10px'} fontWeight={400}>
                      {t('profile.ifProfileNotValidated')}
                    </Text>
                  </VStack>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('InfoVerifyLater');
                    }}
                  />
                </HStack>
              </Checkbox>
            )}
          </Box>
        )}

        <HStack my={3} space={'10px'}>
          {stepCount > 1 && (
            <TouchableOpacity
              style={{
                width: '15%',
                backgroundColor: '#E7F3FC',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                if (profileStep > 1) {
                  setProfileStep(v => (v > 1 ? v - 1 : v));
                } else {
                  prevStep();
                  setStepCount(v => (v > 1 ? v - 1 : v));
                }
              }}>
              <ArrowBackIcon color={'#1E1E1E'} />
            </TouchableOpacity>
          )}

          <Button
            flex={1}
            h="12"
            borderRadius={'8px'}
            onPress={async () => {
              if (stepCount === 3) {
                if (profileStep === 1) {
                  if (
                    accountInformation.name &&
                    accountInformation.phoneNumber
                  ) {
                    setProfileStep(v => v + 1);
                  } else {
                    Toast.show({
                      title: 'Not Completed',
                      description: 'Please complete the required data.',
                    });
                  }
                } else if (profileStep === 2) {
                  if (
                    profile.mbsdIDNumber &&
                    profile.mbsdGender &&
                    profile.mbsdBirthDate &&
                    profile.mbsdBirthPlace &&
                    (profile.mbsdBloodType !== null ||
                      profile.mbsdBloodType !== undefined)
                  ) {
                    setProfileStep(v => v + 1);
                  } else {
                    Toast.show({
                      title: 'Not Completed',
                      description: 'Please complete the required data.',
                    });
                  }
                } else if (profileStep === 3) {
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
            isLoading={isLoading}
            disabled={isDisabledButton()}
            bg={isDisabledButton() ? 'gray.400' : undefined}>
            {profileStep === 3 ? t('confirm') : t('next')}
          </Button>
        </HStack>
        <VerifyID
          cancelRef={cancelRef}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          // onPress={() => {
          //   setIsOpen(false);
          // }}
          isLoading
          title={'Verify your ID'}
          content={'Please wait a moment while we try to verify your ID'}
          // buttonContent={'Check My Event'}
        />
        <VerifyID
          cancelRef={cancelRefInvalid}
          isOpen={isOpenNotReadable}
          onClose={() => {
            setIsOpenNotReadable(false);
            console.info('validationTry', validationTry);
            if (validationTry < 5) {
              setStep('upload-id');
              setStepCount(2);
              setProfileStep(1);
              setIdentityImage({
                fileId: '',
                data: undefined,
              });
            }
            // nextStep();
            // setStepCount(v => v + 1);
          }}
          onPress={() => {
            setIsOpenNotReadable(false);
            console.info('validationTry', validationTry);
            if (validationTry < 5) {
              setStep('upload-id');
              setStepCount(2);
              setProfileStep(1);
              setIdentityImage({
                fileId: '',
                data: undefined,
                rawFile: undefined,
              });
            }
            // nextStep();
            // setStepCount(v => v + 1);
          }}
          title={'Your ID is not readable'}
          content={
            "Sorry we can't verify your ID please re-upload your ID or select Verify ID later"
          }
          buttonContent={'Close'}
        />
        <VerifyID
          cancelRef={cancelRefProcessing}
          isOpen={isOpenProcessing}
          isLoading
          onClose={
            validationTryProcessing >= 3
              ? () => {
                  setIsOpenProcessing(false);
                }
              : undefined
          }
          onPress={
            validationTryProcessing >= 3
              ? () => {
                  setIsOpenProcessing(false);
                }
              : undefined
          }
          title={
            PROCESSING_MESSAGES[validationTryProcessing % 3].title ||
            'We still check your ID'
          }
          content={
            PROCESSING_MESSAGES[validationTryProcessing % 3].content ||
            'Your ID still in processing to validate.'
          }
          buttonContent={'Close'}
        />
      </VStack>
    </AppContainer>
  );
}
