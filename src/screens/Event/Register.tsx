/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Box,
  Checkbox,
  Text,
  VStack,
  ScrollView,
  Divider,
  useToast,
  Center,
  Button,
  Spinner,
  HStack,
} from 'native-base';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from '../../components/header/Header';
import RegistrationForm from './components/RegistrationForm';
import {EventFieldsEntity} from '../../types/event.type';
import {EventService} from '../../api/event.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import Congratulation from '../../components/modal/Congratulation';
import EventRegistrationCard from '../../components/card/EventRegistrationCard';
import datetime, {toAcceptableApiFormat} from '../../helpers/datetime';
import {useAuthUser} from '../../context/auth.context';
import {useTranslation} from 'react-i18next';
import ViewProfile from '../InputProfile/components/ViewProfile';
import httpRequest from '../../helpers/httpRequest';
import {DocumentPickerResponse} from 'react-native-document-picker';
import ImageView from 'react-native-image-viewing';
import {Platform, View} from 'react-native';
import {parseUnknownDataToArray} from '../../helpers/parser';
import AppContainer from '../../layout/AppContainer';
import {
  isSubField,
  REGISTER_EVENT_CONDITIONS,
} from '../../helpers/registerEvent';
import {EvhfName} from '../../types/registerEvent.type';
import LoadingBlock from '../../components/loading/LoadingBlock';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [autofilled, setAutofilled] = useState(false);
  const [openJersey, setOpenJersey] = useState(false);

  const {user} = useAuthUser();

  const toast = useToast();
  const {t} = useTranslation();

  const route = useRoute();
  const params = route.params as RootStackParamList['EventRegister'];
  const [showFields, setShowFields] = useState<EvhfName[]>([]);

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
          For more information about size,{' '}
          <Text
            textDecorationLine={'underline'}
            color="primary.900"
            onPress={() => {
              if (event.data.evnhSizeChart) {
                setOpenJersey(true);
              } else {
                toast.show({
                  description: 'Jersey Size chart not found',
                });
              }
            }}>
            See jersey size chart
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

    const newFields = [...fieldTop, ...fieldBottom];

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

  useEffect(() => {
    const data: {[key: string]: any} = {};
    if (!user || autofilled || fields.length < 1) {
      return;
    }
    console.info(fields);
    let findIndex = fields.findIndex(f => f.evhfName === 'evpaName');
    if (findIndex !== -1) {
      data.evpaName = user?.data[0].zmemFullName;
      data.static = true;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaPhone');
    if (findIndex !== -1) {
      data.evpaPhone = user?.linked?.zmemAuusId?.[0]?.auusPhone;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaEmail');
    if (findIndex !== -1) {
      data.evpaEmail = user?.linked?.zmemAuusId?.[0]?.auusEmail;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaAddress');
    if (findIndex !== -1) {
      data.evpaAddress = user?.linked?.mbsdZmemId?.[0]?.mbsdAddress;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaCity');
    if (findIndex !== -1) {
      data.evpaCity = user?.linked?.mbsdZmemId?.[0]?.mbsdCity;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaProvinces');
    if (findIndex !== -1) {
      data.evpaProvinces = user?.linked?.mbsdZmemId?.[0]?.mbsdProvinces;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaProvinsi');
    if (findIndex !== -1) {
      data.evpaProvinsi = user?.linked?.mbsdZmemId?.[0]?.mbsdProvinces;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaNationality');
    if (findIndex !== -1) {
      data.evpaNationality = user?.linked?.mbsdZmemId?.[0]?.mbsdNationality;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaBirthPlace');
    if (findIndex !== -1) {
      data.evpaBirthPlace = user?.linked?.mbsdZmemId?.[0]?.mbsdBirthPlace;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaBirthDate');
    if (findIndex !== -1) {
      data.evpaBirthDate = user?.linked?.mbsdZmemId?.[0]?.mbsdBirthDate;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaCountry');
    if (findIndex !== -1) {
      data.evpaCountry = user?.linked?.mbsdZmemId?.[0]?.mbsdCountry;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaGender');
    if (findIndex !== -1) {
      data.evpaGender = user?.linked?.mbsdZmemId?.[0]?.mbsdGender;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaIDNumberType');
    if (findIndex !== -1) {
      data.evpaIDNumberType = user?.linked?.mbsdZmemId?.[0]?.mbsdIDNumberType;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaIDNumber');
    if (findIndex !== -1) {
      data.evpaIDNumber = user?.linked?.mbsdZmemId?.[0]?.mbsdIDNumber;
    }
    findIndex = fields.findIndex(f => f.evhfName === 'evpaBloodType');
    if (findIndex !== -1) {
      data.evpaBloodType = user?.linked?.mbsdZmemId?.[0]?.mbsdBloodType;
    }
    data.evpaEvnhId = params.event.data.evnhId;
    data.evpaEvncId = params.selectedCategoryId;
    setFieldsData({...fieldsData, ...data});
    setAutofilled(true);
  }, [
    autofilled,
    fields,
    fieldsData,
    params.event.data.evnhId,
    params.selectedCategoryId,
    user,
  ]);

  const register = async () => {
    setIsLoading(true);
    let valid = true;
    let toastDescription = '';

    let payload = {
      ...fieldsData,
      evpaEvnhId: params.event.data.evnhId,
      evpaEvncId: params.selectedCategoryId,
      evpaName:
        user?.data && user?.data.length > 0 ? user?.data[0].zmemFullName : null,
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

    fields.forEach((f: EventFieldsEntity) => {
      if (
        f.evhfIsRequired.toString() === '1' &&
        (!(f.evhfName in payload) || !payload[f.evhfName])
      ) {
        valid = false;
        console.info('INVALID: ', f);
        toastDescription = `Field "${f.evhfLabel}" is required`;
      }
    });

    if (!valid) {
      setIsLoading(false);
      toast.show({
        title: 'Failed to register event',
        description: toastDescription,
      });
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
      toast.show({
        title: 'Failed to register event',
        description: getErrorMessage(error),
      });
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

  const displayedFields = useMemo(
    () =>
      fields
        .filter(f => f.evhfName !== 'evpaEvnhId' && f.evhfName !== 'evpaEvncId')
        .filter(f => !bannedField.includes(f.evhfName))
        .filter(f => showFields.includes(f.evhfName)),
    [fields, bannedField, showFields],
  );

  const isRequiredFilled = useCallback(() => {
    for (let i = 0, j = fields.length; i < j; ++i) {
      if (fields[i].evhfIsRequired.toString() === '1') {
        if (
          fieldsData[fields[i].evhfName] == null ||
          fieldsData[fields[i].evhfName] === ''
        ) {
          return false;
        }
      }
    }
    return true;
  }, [fields, fieldsData]);

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
    const originalPrice = prices[0].originalPrice;
    const finalPrice = prices[0].finalPrice;
    let textOriginalPriceReturn;
    let textFinalPriceReturn;
    if (finalPrice < originalPrice) {
      textOriginalPriceReturn = originalPrice.toLocaleString('id-ID');
    }
    textFinalPriceReturn = finalPrice.toLocaleString('id-ID');
    return [textOriginalPriceReturn, textFinalPriceReturn];
  }, []);

  // console.info(
  //   'fields --->',
  //   JSON.stringify(
  //     fields.map(item => ({
  //       evhfName: item.evhfName,
  //       evhfLabel: item.evhfLabel,
  //     })),
  //   ),
  // );
  // console.info('showFields --->', JSON.stringify(showFields));

  return (
    <AppContainer>
      <ScrollView>
        <Header title={t('event.registrationForm')} left="back" />
        <VStack space="4" pb="3">
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
          <ViewProfile fields={bannedField} withoutMarginBottom />

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
                </View>
              ))}
            </VStack>
          </VStack>
          <Box backgroundColor={'#F4F6F9'} py="3" px="4" pr="8">
            <Checkbox.Group
              onChange={setCheckbox}
              value={checkbox}
              accessibilityLabel="Agree to terms"
              mr="10">
              <Checkbox
                value="agreed"
                _text={{fontSize: 12}}
                isDisabled={isLoading}>
                {t('termsAndConditionsAgreement')}
              </Checkbox>
            </Checkbox.Group>
          </Box>

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
              h="12"
              isLoading={isLoading}
              // isDisabled={checkbox[0] !== 'agreed' || !isRequiredFilled()}
              isDisabled={checkbox[0] !== 'agreed' || !isRequiredFilled()}
              onPress={() => {
                if (checkbox[0] !== 'agreed') {
                  toast.show({
                    title: 'Failed to register event',
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
              navigation.navigate('Main', {screen: t('tab.myEvents')});
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
      </ScrollView>
      {isLoading && <LoadingBlock style={{opacity: 0.7}} />}
    </AppContainer>
  );
}
