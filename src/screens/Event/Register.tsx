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
import {TouchableOpacity} from 'react-native';
import EventRegistrationCard from '../../components/card/EventRegistrationCard';
import datetime from '../../helpers/datetime';
import {useAuthUser} from '../../context/auth.context';

export default function EventRegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [autofilled, setAutofilled] = useState(false);

  const {user} = useAuthUser();

  const toast = useToast();

  const route = useRoute();
  const params = route.params as RootStackParamList['EventRegister'];

  const fields = useMemo<EventFieldsEntity[]>(
    () =>
      params.event.fields && Array.isArray(params.event.fields)
        ? params.event.fields
        : params.event.fields && typeof params.event.fields === 'object'
        ? (Object.values(params.event.fields) as EventFieldsEntity[])
        : ([] as EventFieldsEntity[]),
    [params.event.fields],
  );

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
    if (fields.find(f => f.evhfName === 'evpaName')) {
      data.evpaName = user?.data[0].zmemFullName;
    }
    if (fields.find(f => f.evhfName === 'evpaPhone')) {
      data.evpaPhone = user?.linked?.zmemAuusId?.[0]?.auusPhone;
    }
    if (fields.find(f => f.evhfName === 'evpaEmail')) {
      data.evpaEmail = user?.linked?.zmemAuusId?.[0]?.auusEmail;
    }
    if (fields.find(f => f.evhfName === 'evpaAddress')) {
      data.evpaAddress = user?.linked?.mbsdZmemId?.[0]?.mbsdAddress;
    }
    if (fields.find(f => f.evhfName === 'evpaCity')) {
      data.evpaevpaCityName = user?.linked?.mbsdZmemId?.[0]?.mbsdCity;
    }
    if (fields.find(f => f.evhfName === 'evpaProvinces')) {
      data.evpaProvinces = user?.linked?.mbsdZmemId?.[0]?.mbsdProvinces;
    }
    if (fields.find(f => f.evhfName === 'evpaProvinsi')) {
      data.evpaProvinsi = user?.linked?.mbsdZmemId?.[0]?.mbsdProvinces;
    }
    console.info(fields);
    setFieldsData({...fieldsData, ...data});
    setAutofilled(true);
  }, [autofilled, fields, fieldsData, user]);

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
        params.event.data.evnhType === '7' ||
        params.event.data.evnhType === '1'
      ) {
        res = await EventService.registerEvent(payload);
      } else {
        res = await EventService.registerVREvent(payload);
      }
      console.info(res.data);
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

        <TouchableOpacity
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
        </TouchableOpacity>

        <Box px="4">
          <Button
            h="12"
            isLoading={isLoading}
            isDisabled={checkbox[0] !== 'agreed'}
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
          title={'Congratulation'}
          content={
            'Registrasi event sukses. Silahkan lihat detail event untuk melihat apakah Anda lolos tahap ballot'
          }
          buttonContent={'Check My Event'}
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
