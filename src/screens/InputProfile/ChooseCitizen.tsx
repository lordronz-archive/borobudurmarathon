import {useNavigation} from '@react-navigation/native';
import {
  Actionsheet,
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
import {BLOOD_OPTIONS} from '../../assets/data/blood';
import {cleanPhoneNumber, countryPhoneCodes} from '../../helpers/phoneNumber';
import Button from '../../components/buttons/Button';
import {useDemo} from '../../context/demo.context';
import {getIDNumberType} from '../../assets/data/ktpPassport';
import {getGenderOptions} from '../../assets/data/gender';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import useInit from '../../hooks/useInit';
import {getApiErrors, handleErrorMessage} from '../../helpers/apiErrors';
import {t} from 'i18next';
import crashlytics from '@react-native-firebase/crashlytics';
import OtpWhatsapp from '../../components/modal/OtpWhatsapp';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CountryCodeInput from '../Profile/components/CountryCodeInput';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';
import {detectLocationFromGoogleAutocomplete} from '../../helpers/detectLocation';
import FormGoogleAutoComplete from './components/FormGoogleAutoComplete';

const MAX_VALIDATION_TRY_PROCESSING = 5;
const MIN_VALIDATION_TRY_INVALID = 3;
type Props = NativeStackScreenProps<RootStackParamList, 'ChooseCitizen'>;

const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 853.3;

export const truncate = (input: string) => {
  if (input.length > 6) {
    return input.substring(0, 6) + '..';
  }
  return input;
};

export default function ChooseCitizenScreen({route}: Props) {
  const PROCESSING_MESSAGES = [
    {
      title: t('idProcessing.title1'),
      content: t('idProcessing.description1'),
    },
    {
      title: t('idProcessing.title2'),
      content: t('idProcessing.description2'),
    },
    {
      title: t('idProcessing.title3'),
      content: t('idProcessing.description3'),
    },
  ];

  const {user} = useAuthUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {demoKTPVerification} = useDemo();
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
  const [isShowInfoVerifyLater, setIsShowInfoVerifyLater] = useState(false);
  const [isShowVerifyLater, setIsShowVerifyLater] = useState(false);
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
  const [isPhoneEditable, setIsPhoneEditable] = React.useState(false);
  const [countryCode, setCountryCode] = useState<string>('62');
  const [openOtpWhatsapp, setOpenOtpWhatsapp] = useState(false);
  const [openCountryCodeSheet, setOpenCountryCodeSheet] = useState(false);

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
    crashlytics().log('ChooseCitizen, user: ' + JSON.stringify(user));
    let phoneNumber;
    if (user?.linked?.zmemAuusId?.[0]?.auusPhone) {
      setIsPhoneEditable(false);
      phoneNumber = user?.linked?.zmemAuusId?.[0]?.auusPhone;
    } else if (user?.linked?.mbsdZmemId?.[0]?.mbsdPhone) {
      setIsPhoneEditable(false);
      phoneNumber = user?.linked?.mbsdZmemId?.[0]?.mbsdPhone;
    } else {
      setIsPhoneEditable(true);
    }
    setAccountInformation({
      name:
        user?.linked.mbsdZmemId?.[0]?.mbsdFullName ||
        user?.data?.[0]?.zmemFullName ||
        '',
      phoneNumber: cleanPhoneNumber(phoneNumber) || '',
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
      title:
        citizen === 'WNI'
          ? t('auth.uploadIdTitle')
          : t('auth.uploadIdTitleWNA'),
      subtitle:
        citizen === 'WNI'
          ? t('auth.uploadIdSubtitle')
          : t('auth.uploadIdSubtitleWNA'),
    },
    {
      note: t('step') + ' 1 ' + t('auth.of3Step'),
      title: t('account'),
      subtitle: t('auth.accountFormDesc'),
    },
    {
      note: t('step') + ' 2 ' + t('auth.of3Step'),
      title: t('label.personalData'),
      subtitle: t('auth.accountFormDesc'),
    },
    {
      note: t('step') + ' 3 ' + t('auth.of3Step'),
      title: t('label.addressInformation'),
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
      handleErrorMessage(error, t('error.failedToUpload'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (nTry?: {processing?: number}) => {
    if (nTry && nTry.processing) {
      setIsOpen(false);
    } else {
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
        const currentTry = nTry && nTry.processing ? nTry.processing : 0;
        console.info(
          'resValidation.data.isProcessing TRUE',
          JSON.stringify(resValidation.data),
        );
        console.info('currentTry', currentTry);
        // toast.show({
        //   title: 'Processing',
        //   description: 'Your ID still in processing to validate.',
        // });
        setIsOpen(false);
        setIsOpenProcessing(true);

        if (currentTry >= MAX_VALIDATION_TRY_PROCESSING) {
          console.info('currentTry >= 5', currentTry);
          setIsShowVerifyLater(true);
        } else {
          console.info('currentTry < 5', currentTry);
          setValidationTryProcessing(currentTry + 1);
          setTimeout(() => {
            handleConfirm({processing: currentTry + 1});
          }, 3000);
        }
      } else if (
        (resValidation && resValidation.data && resValidation.data.isValid) ||
        isVerifyLater
      ) {
        if (isPhoneEditable) {
          try {
            const finalCountryCode = countryCode ? +countryCode : 62;
            const service =
              finalCountryCode === 62
                ? AuthService.sendOTP
                : AuthService.sendOTPWhatsApp;
            const sendOtpRes = await service({
              phoneNumber: cleanPhoneNumber(accountInformation.phoneNumber),
              countryCode: countryCode ? +countryCode : undefined,
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
              title: t('error.failedToSendOTP'),
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
          title: t('error.invalidID'),
          description:
            resValidation.data.message || t('error.pleaseRecheckYourID'),
        });
        setIsOpenNotReadable(true);
        setValidationTry(v => v + 1);
        setIsOpen(false);
      } else {
        toast.show({
          title: t('error.invalidID'),
          description: t('error.pleaseRecheckYourID'),
        });
        setIsOpenNotReadable(true);
        setValidationTry(v => v + 1);
        setIsOpen(false);
      }
    } catch (err: any) {
      if (err.status === 400) {
        toast.show({
          title: t('error.invalidID'),
          description: getErrorMessage(err) || t('error.pleaseRecheckYourID'),
        });
        setIsOpenNotReadable(true);
      } else {
        toast.show({
          title: t('error.failed'),
          description: t('error.tryAgainLater'),
        });
        console.info(
          err,
          getErrorMessage(err),
          t('error.failedToConfirmProfile'),
        );
      }
      if (validationTry >= MIN_VALIDATION_TRY_INVALID) {
        setIsShowVerifyLater(true);
      }
      setValidationTry(v => v + 1);
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

  // const openCamera = () => {
  //   ImageCropPicker.openCamera({
  //     width: IMAGE_WIDTH,
  //     height: IMAGE_HEIGHT,
  //     cropping: true,
  //     freeStyleCropEnabled: true,
  //     mediaType: 'photo',
  //     useIsFocused: false,
  //   })
  //     .then(image => {
  //       console.info('openCamera image result', image);
  //       onChangeFile(image);
  //       setVisible(false);
  //     })
  //     .catch(err => {
  //       toast.show({
  //         description: getErrorMessage(err),
  //       });
  //       console.log('ERROR OPEN CAMERA =>>> ', err);
  //       if (getErrorMessage(err).includes('simulator')) {
  //         setVisible(true);
  //       }
  //     });
  // };

  // const onChangeFile = (image: ImageOrVideo) => {
  //   if (image.size <= 5 * 1e6) {
  //     handleChangeIdentityFile(image);
  //   } else {
  //     toast.show({
  //       id: 'id-image-too-big',
  //       description: 'ID Image is too big, maximum file size is 5 MB',
  //     });
  //   }
  // };

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
        return (
          !profile.mbsdCountry ||
          !profile.mbsdProvinces ||
          !profile.mbsdCity ||
          !profile.mbsdAddress ||
          !isAgreeTermsAndCondition
        );
      } else {
        return false;
      }
    } else if (step === 'choose-citizen') {
      return !citizen;
    } else if (step === 'upload-id') {
      return !identityImage || (identityImage && !identityImage.data);
    }
  };

  return (
    <GestureHandlerRootView style={{backgroundColor: 'white', height: '100%'}}>
      <VStack px="4" flex="1">
        <VStack>
          <Breadcrumbs
            titles={[
              t('stepTitle.Citizen'),
              t('stepTitle.UploadID'),
              t('stepTitle.Profile'),
            ]}
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
        <ScrollView flex={1} keyboardShouldPersistTaps="always">
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
                  // openCamera();
                  setVisible(true);
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
                title={t('stepTitle.UploadID')}
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
                <VStack my="3" space="2" h="100%">
                  <TextInput
                    placeholder={t('auth.placeholderFullName') || ''}
                    label={t('fullName') || ''}
                    helperText={t('auth.helperFullName')}
                    value={accountInformation.name}
                    onChangeText={val =>
                      setAccountInformation(oldVal => ({
                        ...oldVal,
                        name: val,
                      }))
                    }
                  />
                  <HStack space="1.5" width="100%">
                    <SelectInput
                      label={t('countryCode') || ''}
                      placeholder="62"
                      items={countryPhoneCodes.map(v => ({
                        label: `${v.code} ${v.country}`,
                        value: v.code,
                      }))}
                      width={'30%'}
                      onValueChange={v => setCountryCode(v)}
                      value={countryCode}
                      useSheet
                      onPress={() => setOpenCountryCodeSheet(ss => !ss)}
                    />
                    <TextInput
                      placeholder={t('auth.placeholderPhone') || ''}
                      label={t('phoneNumber') || ''}
                      helperText={t('auth.willSendToPhone')}
                      value={accountInformation.phoneNumber}
                      keyboardType="numeric"
                      width="68%"
                      height={25}
                      _inputProps={{editable: isPhoneEditable}}
                      onChangeText={val => {
                        if (val.length > 14) {
                          return;
                        }
                        setAccountInformation(oldVal => ({
                          ...oldVal,
                          phoneNumber: val,
                        }));
                      }}
                    />
                  </HStack>
                </VStack>
              )}
              {stepCount === 3 && profileStep === 2 && (
                <VStack my="3" space="2">
                  <TextInput
                    placeholder={t('auth.placeholderIdentityNumber') || ''}
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
                    keyboardType={citizen === 'WNI' ? 'numeric' : 'default'}
                  />
                  <SelectInput
                    items={getGenderOptions(
                      t('gender.male'),
                      t('gender.female'),
                    )}
                    placeholder={t('chooseOne') || ''}
                    label={t('profile.gender') || ''}
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
                    label={t('profile.dob') || 'Date of birth'}
                  />
                  <TextInput
                    placeholder={t('auth.placeholderPob') || ''}
                    label={t('profile.pob') || 'Place of birth'}
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
                    placeholder={t('auth.placeholderBloodType') || ''}
                    label={t('profile.bloodType') || 'Blood Type'}
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
                        items={countries
                          .filter(item => item.en_short_name !== 'Indonesia')
                          .map(({en_short_name}) => ({
                            label: en_short_name,
                            value: en_short_name,
                          }))}
                        value={profile.mbsdCountry}
                        placeholder={t('auth.placeholderCountry') || ''}
                        label={t('profile.country') || ''}
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
                        placeholder={t('auth.placeholderNationality') || ''}
                        label={t('profile.nationality') || ''}
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
                          : t('auth.chooseAddress')}
                      </Button>
                    </Box>
                  ) : (
                    // <>
                    //   <GooglePlacesAutocomplete
                    //     placeholder={t('auth.placeholderAddress') || ''}
                    //     onPress={(data, details = null) => {
                    //       // 'details' is provided when fetchDetails = true
                    //       // const city = details?.address_components.filter(
                    //       //   f =>
                    //       //     JSON.stringify(f.types) ===
                    //       //     JSON.stringify(['locality', 'political']),
                    //       // )[0].short_name;
                    //       // const state = details?.address_components.filter(
                    //       //   f =>
                    //       //     JSON.stringify(f.types) ===
                    //       //     JSON.stringify([
                    //       //       'administrative_area_level_1',
                    //       //       'political',
                    //       //     ]),
                    //       // )[0].short_name;
                    //       console.log(
                    //         'GooglePlacesAutocomplete data',
                    //         JSON.stringify(data),
                    //       );
                    //       console.log(
                    //         'GooglePlacesAutocomplete details?.address_components',
                    //         JSON.stringify(details?.address_components),
                    //       );
                    //       // const findDisplayCity =
                    //       //   details?.address_components.filter(
                    //       //     f =>
                    //       //       JSON.stringify(f.types) ===
                    //       //         JSON.stringify(['locality', 'political']) ||
                    //       //       JSON.stringify(f.types) ===
                    //       //         JSON.stringify([
                    //       //           'administrative_area_level_2',
                    //       //           'political',
                    //       //         ]) ||
                    //       //       JSON.stringify(f.types) ===
                    //       //         JSON.stringify(['postal_town']),
                    //       //   );

                    //       const {
                    //         description,
                    //         city: displayCity,
                    //         province,
                    //         country,
                    //       } = detectLocationFromGoogleAutocomplete(
                    //         data,
                    //         details,
                    //       );
                    //       // const displayState =
                    //       //   details?.address_components.filter(
                    //       //     f =>
                    //       //       JSON.stringify(f.types) ===
                    //       //       JSON.stringify([
                    //       //         'administrative_area_level_1',
                    //       //         'political',
                    //       //       ]),
                    //       //   )[0].long_name;
                    //       setProfile(oldVal => ({
                    //         ...oldVal,
                    //         mbsdAddress: description,
                    //         mbsdRawAddress: description,
                    //         mbsdCity: displayCity || description,
                    //         mbsdProvinces: province || '',
                    //         mbsdCountry: country || '',
                    //       }));
                    //       console.log(profile.mbsdAddress);
                    //       console.log(displayCity);
                    //     }}
                    //     query={{
                    //       key: Config.MAPS_API_KEY,
                    //       language: 'en',
                    //     }}
                    //     fetchDetails
                    //     styles={{
                    //       textInput: {
                    //         height: 50,
                    //         color: '#5d5d5d',
                    //         fontSize: 16,
                    //         borderRadius: 6,
                    //         borderColor: '#C5CDDB',
                    //         borderWidth: 1,
                    //       },
                    //       predefinedPlacesDescription: {
                    //         color: '#1faadb',
                    //       },
                    //     }}
                    //     disableScroll={false}
                    //     textInputProps={{
                    //       // InputComp: TextInput,
                    //       // placeholder: t('auth.placeholderAddress') || '',
                    //       // label: t('profile.address') || '',
                    //       // value: profile.mbsdAddress,
                    //       onChangeText: val =>
                    //         setProfile(oldVal => ({
                    //           ...oldVal,
                    //           mbsdAddress: val,
                    //           mbsdRawAddress: val,
                    //           mbsdCity: oldVal.mbsdCity ?? '',
                    //         })),
                    //       // width: '100%',
                    //     }}
                    //   />
                    // </>
                    <FormGoogleAutoComplete
                      hideLabel
                      onChange={val => {
                        setProfile(oldVal => ({
                          ...oldVal,
                          mbsdAddress: val.mdupAddress,
                          mbsdRawAddress: val.mdupAddress,
                          mbsdCity: val.mdupCity,
                          mbsdProvinces: val.mdupProvinces,
                          mbsdCountry: val.mdupCountry,
                        }));
                      }}
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
            {isShowVerifyLater && (
              <Checkbox
                mt={'20px'}
                value={isVerifyLater.toString()}
                onChange={val => {
                  setIsVerifyLater(val);
                  setIsShowInfoVerifyLater(val);
                }}
                isDisabled={isLoading}>
                <HStack flex={1}>
                  <VStack ml={'10px'} flex={1}>
                    <HStack justifyContent="space-between">
                      <Text fontSize={'12px'} fontWeight={600}>
                        {t('profile.verifyProfileDataLater')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setIsShowInfoVerifyLater(true)}>
                        <Text fontSize={'11px'} fontWeight={600} underline>
                          {t('seeMoreInfo')}
                        </Text>
                      </TouchableOpacity>
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
            <Actionsheet
              isOpen={isShowInfoVerifyLater}
              onClose={() => setIsShowInfoVerifyLater(false)}>
              <Actionsheet.Content>
                <Box w="100%" px={4} justifyContent="center">
                  <Text fontSize="16" bold mb="3">
                    Verify Later
                  </Text>
                  <Text fontWeight={400} fontSize="12px" mb="12px">
                    {t('profile.verifyProfileLaterInfo')}
                  </Text>
                </Box>
                <Box h="8" />
                {/* <Actionsheet.Item>Delete</Actionsheet.Item>
                <Actionsheet.Item isDisabled>Share</Actionsheet.Item>
                <Actionsheet.Item>Play</Actionsheet.Item>
                <Actionsheet.Item>Favourite</Actionsheet.Item> */}
                {/* <Actionsheet.Item>OK</Actionsheet.Item> */}
              </Actionsheet.Content>
            </Actionsheet>
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
                    if (countryCode && countryCode !== '62') {
                      setOpenOtpWhatsapp(true);
                    } else {
                      setProfileStep(v => v + 1);
                    }
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
                    if (
                      citizen === 'WNI' &&
                      profile.mbsdIDNumber.toString().length !== 16
                    ) {
                      Toast.show({
                        title: t('auth.invalidKtpInput'),
                        description: t('auth.invalidKtpInputDesc'),
                      });
                      return;
                    }
                    const minimumAge = 10;
                    const inputDate = new Date(profile.mbsdBirthDate);
                    if (
                      inputDate >
                      new Date(
                        new Date().setFullYear(
                          new Date().getFullYear() - minimumAge,
                        ),
                      )
                    ) {
                      Toast.show({
                        title: 'Invalid Input',
                        description: 'Please provide a valid birth date.',
                      });
                    } else {
                      setProfileStep(v => v + 1);
                    }
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
          title={t('auth.verifyId')}
          content={t('auth.waitVerifyId')}
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
          title={t('auth.idNotReadable')}
          content={t('auth.idNotReadableDesc')}
          buttonContent={t('close')}
        />

        <VerifyID
          cancelRef={cancelRefProcessing}
          isOpen={isOpenProcessing}
          isLoading
          title={
            PROCESSING_MESSAGES[validationTryProcessing % 3].title ||
            'We still check your ID'
          }
          content={
            (PROCESSING_MESSAGES[validationTryProcessing % 3].content ||
              'Your ID still in processing to validate') +
            ` (${validationTryProcessing})`
          }
          buttonContent={t('close')}
        />

        {isOpenProcessing && isShowVerifyLater ? (
          <VerifyID
            cancelRef={cancelRefProcessing}
            isOpen={isOpenProcessing}
            isLoading
            title={
              PROCESSING_MESSAGES[validationTryProcessing % 3].title ||
              'We still check your ID'
            }
            content={
              (PROCESSING_MESSAGES[validationTryProcessing % 3].content ||
                'Your ID still in processing to validate') +
              '. You can continue by choosing verify later.'
            }
            onPress={() => {
              setIsOpenProcessing(false);
            }}
            onClose={() => {
              setIsOpenProcessing(false);
            }}
            buttonContent={t('close')}
          />
        ) : (
          <VerifyID
            cancelRef={cancelRefProcessing}
            isOpen={isOpenProcessing}
            isLoading
            title={
              PROCESSING_MESSAGES[validationTryProcessing % 3].title ||
              'We still check your ID'
            }
            content={
              (PROCESSING_MESSAGES[validationTryProcessing % 3].content ||
                'Your ID still in processing to validate') +
              ` (${validationTryProcessing})`
            }
            buttonContent={t('close')}
          />
        )}
        {
          <OtpWhatsapp
            cancelRef={cancelRef}
            isOpen={openOtpWhatsapp}
            onClose={setOpenOtpWhatsapp}
            onPress={() => {
              setOpenOtpWhatsapp(false);
              setProfileStep(v => v + 1);
            }}
            title={'WhatsApp OTP'}
            content={t('auth.otpWhatsappDesc')}
            buttonContent={t('next')}
          />
        }

        {openCountryCodeSheet && (
          <CountryCodeInput
            setCountryCode={s => setCountryCode(s.toString())}
            items={[]}
            open={openCountryCodeSheet}
            setOpen={setOpenCountryCodeSheet}
          />
        )}
      </VStack>
    </GestureHandlerRootView>
  );
}
