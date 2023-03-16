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
import React, {useEffect, useMemo, useState} from 'react';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from '../../components/header/Header';
import RegistrationForm, {getOptions} from './components/RegistrationForm';
import {EventFieldsEntity} from '../../types/event.type';
import {EventService} from '../../api/event.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import Congratulation from '../../components/modal/Congratulation';
import EventRegistrationCard from '../../components/card/EventRegistrationCard';
import datetime, {toAcceptableApiFormat} from '../../helpers/datetime';
import {useAuthUser} from '../../context/auth.context';
import {useTranslation} from 'react-i18next';

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

  const {user} = useAuthUser();

  const toast = useToast();
  const {t} = useTranslation();

  const route = useRoute();
  const params = route.params as RootStackParamList['EventRegister'];

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
      fieldResult[jerseyIndex].helperText = (
        <Text>
          For more information about size,{' '}
          <Text textDecorationLine={'underline'} color="primary.900">
            See jersey size chart
          </Text>
        </Text>
      );
    }

    const fieldTop = fieldResult.filter(item => item.static);
    const fieldBottom = fieldResult.filter(item => !item.static);

    // fieldResult.sort((x, y) => {
    //   // true values first
    //   return x.static === y.static ? 0 : x ? -1 : 1;
    // });

    return [...fieldTop, ...fieldBottom];
  }, [params.event.fields]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [fieldsData, setFieldsData] = React.useState<any>({});

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [checkbox, setCheckbox] = useState<string[]>([]);

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

    const payload = {
      ...fieldsData,
      evpaEvnhId: params.event.data.evnhId,
      evpaEvncId: params.selectedCategoryId,
      evpaName: user?.data[0].zmemFullName,
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
      evpaGender: user?.linked.mbsdZmemId[0].mbsdGender,
      evpaIDNumberType: user?.linked.mbsdZmemId[0].mbsdIDNumberType,
      evpaIDNumber: user?.linked.mbsdZmemId[0].mbsdIDNumber,
      evpaBloodType: user?.linked.mbsdZmemId[0].mbsdBloodType,
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

    try {
      let res: any;
      if (
        params.event.data.evnhType.toString() === '7' ||
        params.event.data.evnhType.toString() === '1'
      ) {
        res = await EventService.registerEvent(payload);
      } else {
        res = await EventService.registerVREvent(payload);
      }
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
  const prices: Price[] = (event?.categories || [])
    .map(cat => ({
      id: cat.evncId,
      name: cat.evncName,
      description: [
        cat.evncMaxDistance,
        cat.evncMaxDistancePoint
          ? cat.evncMaxDistancePoint + ' point'
          : undefined,
        cat.evncVrReps,
        'Sisa Kuota: ' +
          (Number(cat.evncQuotaRegistration) - Number(cat.evncUseQuota) !==
          Number(cat.evncQuotaRegistration)
            ? (
                Number(cat.evncQuotaRegistration) - Number(cat.evncUseQuota)
              ).toLocaleString('id-ID') +
              '/' +
              Number(cat.evncQuotaRegistration).toLocaleString('id-ID')
            : Number(cat.evncQuotaRegistration).toLocaleString('id-ID')),
        datetime.getDateRangeString(
          cat.evncStartDate,
          cat.evncVrEndDate || undefined,
          'short',
          'short',
        ),
      ]
        .filter(item => item)
        .join(', '),
      originalPrice: Number(cat.evncPrice),
      finalPrice: Number(cat.evncPrice),
      benefits: [
        'Medal',
        'Jersey (Merchandise)',
        'Local UMKM Merchandise',
        'Free Ongkir',
        'This is Dummy Data',
      ],
    }))
    .filter(cat => cat.id === params.selectedCategoryId);

  const isRequiredFilled = () => {
    const requiredFields = fields
      .filter(v => v.evhfIsRequired.toString() === '1')
      .map(v => v.evhfName);
    return requiredFields.every(v => v in fieldsData && !!fieldsData[v]);
  };

  return (
    <ScrollView>
      <Header title="Form Registration" left="back" />
      <VStack space="4" pb="3">
        <EventRegistrationCard
          imgSrc={
            event?.data.evnhThumbnail
              ? {uri: event?.data.evnhThumbnail}
              : require('../../assets/images/FeaturedEventImage.png')
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
          mb="2"
          height="8px"
          _light={{
            bg: '#E8ECF3',
          }}
          _dark={{
            bg: 'muted.50',
          }}
        />
        <VStack space="2.5" px="4">
          <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
            Registration Information
          </Text>
          <VStack space="1.5">
            {fields
              .filter(
                f => f.evhfName !== 'evpaEvnhId' && f.evhfName !== 'evpaEvncId',
              )
              .map(field => (
                <RegistrationForm
                  key={field.evhfId}
                  {...field}
                  onValueChange={val => {
                    setFieldsData({...fieldsData, [field.evhfName]: val});
                  }}
                  value={fieldsData[field.evhfName]}
                  helperText={field.helperText}
                  required={
                    field.evhfIsRequired.toString() === '1' ||
                    field.evhfIsRequired.toString() === 'true'
                  }
                />
              ))}
          </VStack>
        </VStack>
        <Box backgroundColor={'#F4F6F9'} py="3" px="4" pr="8">
          <Checkbox.Group
            onChange={setCheckbox}
            value={checkbox}
            accessibilityLabel="Agree to terms">
            <Checkbox
              value="agreed"
              _text={{fontSize: 12, flexWrap: 'wrap'}}
              isDisabled={isLoading}>
              Dengan melanjutkan saya mengerti, mengetahui, dan bersedia tunduk
              untuk segala persyaratan & ketentuan event borobudur marathon.
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
          <Text>Total Payment</Text>
          <Text fontSize={18} fontWeight={700}>{`IDR ${Number(
            prices[0].finalPrice || 0,
          )?.toLocaleString('id-ID')}`}</Text>
        </HStack>
        <Box px="4">
          <Button
            h="12"
            isLoading={isLoading}
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
            Register Now
          </Button>
        </Box>
        <Congratulation
          cancelRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
          onPress={() => {
            setIsOpen(false);
            navigation.navigate('Main', {screen: 'My Events'});
          }}
          title={t('registration.registrationSuccess')}
          content={t('registration.registrationSuccessDesc')}
          buttonContent={t('registration.checkEventBtn')}
        />
      </VStack>
      {isLoading && (
        <Box
          position="absolute"
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          flex={1}>
          <Box
            bg="gray.300"
            opacity="0.9"
            width="100%"
            height="100%"
            position="absolute"
          />
          <Center>
            <Spinner size="lg" />
          </Center>
        </Box>
      )}
    </ScrollView>
  );
}
