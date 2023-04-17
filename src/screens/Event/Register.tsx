/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Box,
  Checkbox,
  Text,
  VStack,
  Divider,
  useToast,
  HStack,
  WarningOutlineIcon,
} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from '../../components/header/Header';
import RegistrationForm from './components/RegistrationForm';
import {EventFieldsEntity, EVENT_TYPES} from '../../types/event.type';
import {EventService} from '../../api/event.service';
import Congratulation from '../../components/modal/Congratulation';
import EventRegistrationCard from '../../components/card/EventRegistrationCard';
import datetime, {getAge, toAcceptableApiFormat} from '../../helpers/datetime';
import {useAuthUser} from '../../context/auth.context';
import {useTranslation} from 'react-i18next';
import ViewProfile from '../InputProfile/components/ViewProfile';
import httpRequest from '../../helpers/httpRequest';
import {DocumentPickerResponse} from 'react-native-document-picker';
import ImageView from 'react-native-image-viewing';
import {Platform, TouchableOpacity, View} from 'react-native';
import {
  parseStringToObject,
  parseUnknownDataToArray,
} from '../../helpers/parser';
import AppContainer from '../../layout/AppContainer';
import {
  isSubField,
  REGISTER_EVENT_CONDITIONS,
} from '../../helpers/registerEvent';
import {EvhfName} from '../../types/registerEvent.type';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {handleErrorMessage} from '../../helpers/apiErrors';
import Button from '../../components/buttons/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getTextBasedOnLanguage} from '../../helpers/text';

type Price = {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  finalPrice: number;
  benefits: string[];
};

const bannedField = [
  'evpaName',
  'evpaPhone',
  'evpaEmail',
  'evpaAddress',
  'evpaCity',
  'evpaProvinces',
  'evpaProvinsi',
  'evpaNationality',
  'evpaBirthPlace',
  'evpaBirthDate',
  'evpaCountry',
  'evpaGender',
  'evpaIDNumberType',
  'evpaIDNumber',
  'evpaBloodType',
];

export default function EventRegisterScreen() {
  const ref = React.useRef(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [openJersey, setOpenJersey] = useState(false);

  const {user} = useAuthUser();

  const toast = useToast();
  const {t} = useTranslation();

  const route = useRoute();
  const params = route.params as RootStackParamList['EventRegister'];
  const [showFields, setShowFields] = useState<EvhfName[]>([]);
  const [errors, setErrors] = useState<any>({});

  // const [fields, setFields] = useState<EventFieldsEntity[]>([]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [fieldsData, setFieldsData] = React.useState<any>({});

  const fields = useMemo<EventFieldsEntity[]>(() => {
    const fieldResult =
      params.event.fields && Array.isArray(params.event.fields)
        ? params.event.fields
        : params.event.fields && typeof params.event.fields === 'object'
        ? (Object.values(params.event.fields) as EventFieldsEntity[])
        : ([] as EventFieldsEntity[]);

    bannedField.forEach(bF => {
      let findIndex = fieldResult.findIndex(f => f.evhfName === bF);
      if (findIndex !== -1) {
        fieldResult[findIndex].static = true;
      }
    });
    const jerseyIndex = fieldResult.findIndex(f =>
      f.evhfName.toLowerCase().includes('jersey'),
    );
    if (jerseyIndex !== -1) {
      fieldResult[jerseyIndex].helperText = params.event.data.evnhSizeChart ? (
        <Text fontSize="xs">
          {t('event.forMoreInformationAboutSize')},{' '}
          <Text
            textDecorationLine={'underline'}
            color="primary.900"
            onPress={() => {
              if (event.data.evnhSizeChart) {
                setOpenJersey(true);
              } else {
                toast.show({
                  description: t('error.jerseySizeChartNotFound'),
                });
              }
            }}>
            {t('event.seeJerseyChart')}
          </Text>
        </Text>
      ) : null;
    }

    const fieldTop = fieldResult.filter(item => item.static);
    const fieldBottom = fieldResult.filter(item => !item.static);

    // fieldResult.sort((x, y) => {
    //   // true values first
    //   return x.static === y.static ? 0 : x ? -1 : 1;
    // });

    let newFields = [...fieldTop, ...fieldBottom];
    newFields = newFields.map(item => {
      delete item.static;
      return item;
    });

    const fieldNames = newFields
      .filter(item => !isSubField(item.evhfName))
      .map(item => item.evhfName);

    setShowFields([...fieldNames]);

    return [...newFields];
  }, [params.event.fields]);

  // useEffect(() => {
  //   generateFields();
  // }, [params.event.fields]);

  // useEffect(() => {
  //   if (Object.keys(REGISTER_EVENT_CONDITIONS).includes()) {

  //   }
  //   generateFields();
  // }, [fieldsData]);

  // const generateFields = () => {
  //   const fieldResult =
  //     params.event.fields && Array.isArray(params.event.fields)
  //       ? params.event.fields
  //       : params.event.fields && typeof params.event.fields === 'object'
  //       ? (Object.values(params.event.fields) as EventFieldsEntity[])
  //       : ([] as EventFieldsEntity[]);

  //   bannedField.forEach(bF => {
  //     let findIndex = fieldResult.findIndex(f => f.evhfName === bF);
  //     if (findIndex !== -1) {
  //       fieldResult[findIndex].static = true;
  //     }
  //   });
  //   const jerseyIndex = fieldResult.findIndex(f =>
  //     f.evhfName.toLowerCase().includes('jersey'),
  //   );
  //   if (jerseyIndex !== -1) {
  //     fieldResult[jerseyIndex].helperText = (
  //       <Text>
  //         For more information about size,{' '}
  //         <Text
  //           textDecorationLine={'underline'}
  //           color="primary.900"
  //           onPress={() => setOpenJersey(true)}>
  //           See jersey size chart
  //         </Text>
  //       </Text>
  //     );
  //   }

  //   const fieldTop = fieldResult.filter(item => item.static);
  //   const fieldBottom = fieldResult.filter(item => !item.static);

  //   // fieldResult.sort((x, y) => {
  //   //   // true values first
  //   //   return x.static === y.static ? 0 : x ? -1 : 1;
  //   // });

  //   // return [...fieldTop, ...fieldBottom];
  //   setFields([...fieldTop, ...fieldBottom]);
  // };

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [checkbox, setCheckbox] = useState<string[]>([]);

  const [files, setFiles] = useState<{[key: string]: DocumentPickerResponse}>();

  const validate = (payload: any) => {
    let objErrors = {};
    let newPayload = {};
    let toastDescription = '';
    for (const f of fields) {
      if (showFields.includes(f.evhfName)) {
        if (f.evhfIsRequired.toString() === '1') {
          if (
            payload[f.evhfName] === undefined ||
            payload[f.evhfName] === null
          ) {
            console.info('INVALID: ', f);

            if (!toastDescription) {
              toastDescription = `${t('error.Field')} "${getTextBasedOnLanguage(
                f.evhfLabel,
              )}" ${t('error.isRequired')}`;
            }
            objErrors = {
              ...objErrors,
              [f.evhfName]: 'required',
            };
          }
        }
      } else {
        // jika field itu tidak di show, biasanya ini sub fields yg NO, jadi harusnya memang tidak akan pernah diisi
        if (f.evhfIsRequired.toString() === '1') {
          // ini mau diapain?
          newPayload = {
            ...newPayload,
            [f.evhfName]: '-',
          };
        }
      }
    }

    console.info('objErrors', objErrors);
    if (newPayload && Object.keys(newPayload).length > 0) {
      register(newPayload);
    } else if (Object.keys(objErrors).length > 0) {
      toast.show({
        title: t('error.failedToRegisterEvent'),
        description: toastDescription,
      });
      if (ref && ref.current) {
        (ref.current as any).scrollTo({x: 0, y: 900, animated: true});
      }
      setErrors({...objErrors});
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  const register = async (newPayload?: any) => {
    setIsLoading(true);

    let payload = {};
    if (newPayload) {
      payload = {...newPayload};
    } else {
      payload = {
        ...fieldsData,
        evpaEvnhId: params.event.data.evnhId,
        evpaEvncId: params.selectedCategoryId,
        evpaName:
          user?.data && user?.data.length > 0
            ? user?.data[0].zmemFullName
            : null,
        evpaEmail: user?.linked.zmemAuusId[0].auusEmail,
        evpaPhone: user?.linked?.zmemAuusId?.[0]?.auusPhone,
        evpaAddress: user?.linked?.mbsdZmemId?.[0]?.mbsdAddress,
        evpaCity: user?.linked?.mbsdZmemId?.[0]?.mbsdCity,
        evpaProvinces: user?.linked?.mbsdZmemId?.[0]?.mbsdProvinces,
        evpaProvinsi: user?.linked?.mbsdZmemId?.[0]?.mbsdProvinces,
        evpaNationality: user?.linked?.mbsdZmemId?.[0]?.mbsdNationality,
        evpaBirthPlace: user?.linked?.mbsdZmemId?.[0]?.mbsdBirthPlace,
        evpaBirthDate: toAcceptableApiFormat(
          user?.linked.mbsdZmemId?.[0]?.mbsdBirthDate,
        ),
        evpaCountry: user?.linked.mbsdZmemId?.[0]?.mbsdCountry,
        evpaGender: user?.linked.mbsdZmemId?.[0]?.mbsdGender,
        evpaIDNumberType: user?.linked.mbsdZmemId?.[0]?.mbsdIDNumberType,
        evpaIDNumber: user?.linked.mbsdZmemId?.[0]?.mbsdIDNumber,
        evpaBloodType: user?.linked.mbsdZmemId?.[0]?.mbsdBloodType,
      };
    }

    const isValid = validate(payload);
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    if (files) {
      for (const entry of Object.entries(files)) {
        let formData = new FormData();
        formData.append('fileType', 'identity');
        let uri =
          Platform.OS === 'android'
            ? entry[1].uri
            : entry[1].uri.replace('file://', '');
        formData.append('file', {
          name: entry[1].name,
          type: entry[1].type,
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
          console.log(res.data.fileId, 'fileId');
        }
        payload = {...payload, [entry[0]]: res.data.fileId};
      }
    }

    try {
      let res: any;
      // if (
      //   Number(params.event.data.evnhType) === 7 ||
      //   Number(params.event.data.evnhType) === 1
      // ) {
      console.log('registerEvent', JSON.stringify(payload));
      res = await EventService.registerEvent(payload);
      // } else {
      //   console.log('registerVREvent', JSON.stringify(payload));
      //   res = await EventService.registerVREvent(payload);
      // }
      console.info(JSON.stringify(res.data));
      setIsOpen(true);
    } catch (error) {
      handleErrorMessage(error, t('error.failedToRegisterEvent'));
    } finally {
      setIsLoading(false);
    }
  };

  const event = params.event;
  const prices: Price[] = useMemo(
    () =>
      (event?.categories || [])
        .filter(cat => cat.evncId === params.selectedCategoryId)
        .map(cat => {
          const earlyBirdPrice = (event?.prices || []).find(
            price => price.evcpEvncId === cat.evncId,
          );
          return {
            id: cat.evncId,
            name: cat.evncName,
            description: cat.evncDesc
              ? cat.evncDesc
              : [
                  // cat.evncVrReps,
                  'Quota: ' +
                    (Number(cat.evncQuotaRegistration) -
                      Number(cat.evncUseQuota) !==
                    Number(cat.evncQuotaRegistration)
                      ? (
                          Number(cat.evncQuotaRegistration) -
                          Number(cat.evncUseQuota)
                        ).toLocaleString('id-ID') +
                        '/' +
                        Number(cat.evncQuotaRegistration).toLocaleString(
                          'id-ID',
                        )
                      : Number(cat.evncQuotaRegistration).toLocaleString(
                          'id-ID',
                        )),
                  datetime.getDateRangeString(
                    cat.evncStartDate,
                    cat.evncVrEndDate || undefined,
                    'short',
                    'short',
                  ),
                  cat.evncMaxDistance
                    ? 'Distance: ' + cat.evncMaxDistance + ' km'
                    : undefined,
                  cat.evncMaxDistancePoint
                    ? cat.evncMaxDistancePoint + ' point'
                    : undefined,
                ]
                  .filter(item => item)
                  .join(', '),
            originalPrice: Number(cat.evncPrice),
            finalPrice: earlyBirdPrice
              ? Number(earlyBirdPrice.evcpPrice)
              : Number(cat.evncPrice),
            benefits: parseUnknownDataToArray(cat.evncBenefit).map(
              item => item.label,
            ),
          };
        }),
    [],
  );

  const guardianFields = [
    'evpaGuardianName',
    'evpaGuardianCardIDNumber',
    'evpaGuardianPhoneNumber',
    'evpaGuardianEmail',
  ];
  const displayedFields = useMemo(() => {
    const res = fields
      .filter(f => f.evhfName !== 'evpaEvnhId' && f.evhfName !== 'evpaEvncId')
      .filter(f => !bannedField.includes(f.evhfName))
      .filter(f => showFields.includes(f.evhfName));
    if (
      getAge(
        user?.linked?.mbsdZmemId?.[0]?.mbsdBirthDate,
        event?.data.evnhStartDate,
      ) >= 17
    ) {
      return res.filter(f => !guardianFields.includes(f.evhfName));
    }
    return res;
  }, [fields, bannedField, showFields, user]);

  // const isRequiredFilled = useCallback(() => {
  //   for (let i = 0, j = fields.length; i < j; ++i) {
  //     if (fields[i].evhfIsRequired.toString() === '1') {
  //       if (
  //         fieldsData[fields[i].evhfName] == null ||
  //         fieldsData[fields[i].evhfName] === ''
  //       ) {
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // }, [fields, fieldsData]);

  // const originalPrice = prices[0].originalPrice;
  // const finalPrice = prices[0].finalPrice;
  // let textOriginalPrice;
  // let textFinalPrice;

  // if (originalPrice === finalPrice) {
  //   textOriginalPrice;
  // } else if (finalPrice < originalPrice) {
  //   // discount
  //   textOriginalPrice = originalPrice.toLocaleString('id-ID');
  // }
  // textFinalPrice = finalPrice.toLocaleString('id-ID');

  const [textOriginalPrice, textFinalPrice] = useMemo(() => {
    const originalPrice = prices?.[0]?.originalPrice || 0;
    const finalPrice = prices?.[0]?.finalPrice || 0;
    let textOriginalPriceReturn;
    let textFinalPriceReturn;
    if (finalPrice < originalPrice) {
      textOriginalPriceReturn = originalPrice.toLocaleString('id-ID');
    }
    textFinalPriceReturn = finalPrice.toLocaleString('id-ID');
    return [textOriginalPriceReturn, textFinalPriceReturn];
  }, []);

  console.info(
    'fields --->',
    JSON.stringify(
      fields.map(item => ({
        evhfName: item.evhfName,
        evhfLabel: item.evhfLabel,
      })),
    ),
  );
  console.info('showFields --->', JSON.stringify(showFields));

  return (
    <AppContainer>
      <KeyboardAwareScrollView>
        <Header title={t('event.registrationForm')} left="back" />
        <VStack space="4">
          <EventRegistrationCard
            imgSrc={
              event?.data.evnhThumbnail
                ? {uri: event?.data.evnhThumbnail}
                : require('../../assets/images/no-image.png')
            }
            runningDate={datetime.getDateRangeString(
              event?.data.evnhStartDate,
              event?.data.evnhEndDate,
              'short',
              'short',
            )}
            registrationDate={datetime.getDateRangeString(
              event?.data.evnhRegistrationStart,
              event?.data.evnhRegistrationEnd,
              'short',
              'short',
            )}
            title={event?.data?.evnhName}
            category={
              (event?.categories || []).find(
                cat => cat.evncId === params.selectedCategoryId,
              )?.evncName
            }
            eventType={(event?.data.evnhType
              ? EVENT_TYPES[event?.data.evnhType as any].value || 'OTHER'
              : 'OTHER'
            ).toUpperCase()}
          />
          <Divider
            height="8px"
            _light={{
              bg: '#E8ECF3',
            }}
            _dark={{
              bg: 'muted.50',
            }}
          />
          <ViewProfile
            fetchProfile={false}
            fields={bannedField}
            withoutMarginBottom
          />

          <VStack space="2.5" px="4" mt="0">
            <Text bold fontSize="lg">
              {t('additionalInformation')}
            </Text>
            {/* <Text>{JSON.stringify(showFields)}</Text> */}
            <VStack space="1.5">
              {displayedFields.map(field => (
                <View
                  key={field.evhfId}
                  style={
                    isSubField(field.evhfName)
                      ? {
                          borderLeftColor: '#f2f2f2',
                          borderLeftWidth: 10,
                          borderRadius: 10,
                        }
                      : undefined
                  }>
                  <RegistrationForm
                    key={field.evhfId}
                    {...field}
                    onValueChange={val => {
                      setFieldsData({...fieldsData, [field.evhfName]: val});
                      if (REGISTER_EVENT_CONDITIONS[field.evhfName]) {
                        console.info(
                          'REGISTER_EVENT_CONDITIONS[field.evhfName]',
                          REGISTER_EVENT_CONDITIONS[field.evhfName],
                        );
                        if (
                          (REGISTER_EVENT_CONDITIONS as any)[field.evhfName][
                            val
                          ]
                        ) {
                          console.info(
                            '(REGISTER_EVENT_CONDITIONS as any)[field.evhfName][val]',
                            (REGISTER_EVENT_CONDITIONS as any)[field.evhfName][
                              val
                            ],
                          );
                          if (
                            (REGISTER_EVENT_CONDITIONS as any)[field.evhfName][
                              val
                            ].show
                          ) {
                            console.info(
                              '(REGISTER_EVENT_CONDITIONS as any)[field.evhfName][val].show',
                            );
                            console.info(
                              (REGISTER_EVENT_CONDITIONS as any)[
                                field.evhfName
                              ][val].show,
                            );
                            setShowFields([
                              ...showFields,
                              ...((REGISTER_EVENT_CONDITIONS as any)[
                                field.evhfName
                              ][val].show || []),
                            ]);
                          } else if (
                            (REGISTER_EVENT_CONDITIONS as any)[field.evhfName][
                              val
                            ].hide
                          ) {
                            console.info(
                              '(REGISTER_EVENT_CONDITIONS as any)[field.evhfName][val].hide',
                            );
                            console.info(
                              (REGISTER_EVENT_CONDITIONS as any)[
                                field.evhfName
                              ][val].hide,
                            );

                            const newFields = [...showFields].filter(
                              item =>
                                !(
                                  (REGISTER_EVENT_CONDITIONS as any)[
                                    field.evhfName
                                  ][val].hide || []
                                ).includes(item),
                            );
                            setShowFields([...newFields]);
                          }
                        } else {
                          console.info(
                            'ELSEEEE - (REGISTER_EVENT_CONDITIONS as any)[field.evhfName][val]',
                            (REGISTER_EVENT_CONDITIONS as any)[field.evhfName][
                              val
                            ],
                          );
                        }
                      } else {
                        console.info(
                          'ELSE -- REGISTER_EVENT_CONDITIONS[field.evhfName]',
                          REGISTER_EVENT_CONDITIONS[field.evhfName],
                        );
                      }
                    }}
                    value={fieldsData[field.evhfName]}
                    helperText={field.helperText}
                    required={
                      field.evhfIsRequired.toString() === '1' ||
                      field.evhfIsRequired.toString() === 'true'
                    }
                    setFileResponse={
                      field.evhfType === 'File'
                        ? a => setFiles({...files, [field.evhfName]: a})
                        : undefined
                    }
                    file={files ? files[field.evhfName] : undefined}
                  />
                  {errors[field.evhfName] === 'required' && (
                    <View
                      style={{
                        position: 'absolute',
                        right: -10,
                        paddingRight: 20,
                        top: 10,
                      }}>
                      <WarningOutlineIcon color="red.600" size="sm" />
                    </View>
                  )}
                </View>
              ))}
            </VStack>
          </VStack>
          <HStack
            backgroundColor={'#F4F6F9'}
            py="3"
            px="4"
            pr="8"
            alignItems="center">
            <Checkbox.Group
              onChange={val => {
                console.info('checkbox val', val);
                setCheckbox(val);
              }}
              value={checkbox}
              accessibilityLabel="Agree to terms"
              mr="2">
              <Checkbox
                value="agreed"
                _text={{fontSize: 12}}
                isDisabled={isLoading}
              />
            </Checkbox.Group>
            <TouchableOpacity
              style={{width: '95%'}}
              onPress={() => {
                if (checkbox.includes('agreed')) {
                  setCheckbox([]);
                } else {
                  setCheckbox(['agreed']);
                }
              }}>
              <Text fontSize="xs">
                {t('termsAndConditionsAgreementPart1')}{' '}
                <Text
                  onPress={() => {
                    navigation.navigate('TNC');
                  }}
                  fontSize="xs"
                  color="primary.900"
                  bold>
                  {t('info.termsAndConditions').toLowerCase()}{' '}
                </Text>
                {t('termsAndConditionsAgreementPart2')}
              </Text>
            </TouchableOpacity>
          </HStack>

          {/* <TouchableOpacity
          style={{paddingHorizontal: 20, paddingVertical: 5}}
          onPress={async () => {
            let obj: any = {};
            for (const field of fields) {
              if (field.evhfType === 'Date') {
                obj[field.evhfName] = new Date().toDateString();
              } else if (field.evhfType === 'Email') {
                obj[field.evhfName] = 'example@example.com';
              } else if (field.evhfType === 'Number') {
                obj[field.evhfName] = 12345;
              } else if (field.evhfType === 'Phone') {
                obj[field.evhfName] = '081212121212';
              } else if (field.evhfType === 'Option') {
                const options = await getOptions(field);
                obj[field.evhfName] =
                  options && options.length > 0 ? options[0].id : '-';
              } else {
                obj[field.evhfName] = 'ini text';
              }
            }
            console.info('obj', obj);
            setFieldsData({...obj});
          }}>
          <Center>
            <Text color="primary.900">Set Dummy Data</Text>
          </Center>
        </TouchableOpacity> */}

          <HStack px="4" justifyContent={'space-between'} alignItems={'center'}>
            <Text>{t('event.totalPayment')}</Text>
            {/* <Text fontSize={18} fontWeight={700}>{`IDR ${Number(
            prices[0].finalPrice || 0,
          )?.toLocaleString('id-ID')}`}</Text> */}

            <VStack>
              {!!textOriginalPrice && (
                <Text
                  color={'#768499'}
                  fontSize="sm"
                  fontWeight={400}
                  strikeThrough>
                  IDR {textOriginalPrice}
                </Text>
              )}
              <Text color={'black'} fontSize="lg" fontWeight={700}>
                IDR {textFinalPrice}
              </Text>
            </VStack>
          </HStack>
          <Box px="4">
            <Button
              isLoading={isLoading}
              // isDisabled={checkbox[0] !== 'agreed' || !isRequiredFilled()}
              // isDisabled={checkbox[0] !== 'agreed' || !isRequiredFilled()}
              onPress={() => {
                if (checkbox[0] !== 'agreed') {
                  toast.show({
                    title: t('error.failedToRegisterEvent'),
                    description: 'Please agree to terms and service',
                  });
                  return;
                }
                register();
              }}>
              {t('event.registerNow')}
            </Button>
          </Box>
          <Congratulation
            cancelRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}
            onPress={() => {
              setIsOpen(false);
              navigation.replace('Main', {screen: t('tab.myEvents')});
            }}
            title={t('registration.registrationSuccess')}
            content={t('registration.registrationSuccessDesc')}
            buttonContent={t('registration.checkEventBtn')}
          />
        </VStack>
        {event.data.evnhSizeChart && (
          <ImageView
            images={[{uri: event.data.evnhSizeChart}]}
            imageIndex={0}
            visible={openJersey}
            onRequestClose={() => setOpenJersey(false)}
          />
        )}
      </KeyboardAwareScrollView>
      {isLoading && <LoadingBlock style={{opacity: 0.7}} />}
    </AppContainer>
  );
}
