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
} from 'native-base';
import React, {useState} from 'react';
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
import useProfile from '../../hooks/useProfile';

export default function EventRegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const profile = useProfile();

  const toast = useToast();

  const route = useRoute();
  const params = route.params as RootStackParamList['EventRegister'];

  const fields =
    params.event.fields && Array.isArray(params.event.fields)
      ? params.event.fields
      : params.event.fields && typeof params.event.fields === 'object'
      ? (Object.values(params.event.fields) as EventFieldsEntity[])
      : ([] as EventFieldsEntity[]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [fieldsData, setFieldsData] = React.useState<any>({});

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [checkbox, setCheckbox] = useState<string[]>([]);

  const register = async () => {
    setIsLoading(true);
    let valid = true;
    let toastDescription = '';

    const payload = {
      ...fieldsData,
      evpaEvnhId: params.event.data.evnhId,
      evpaEvncId: params.selectedCategoryId,
      evpaName: profile?.zmemFullName,
    };

    fields.forEach((f: EventFieldsEntity) => {
      if (f.evhfIsRequired.toString() === '1' && !(f.evhfName in payload)) {
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
      // const res: any = await EventService.registerEvent(payload);
      console.info(res.data);
      setIsOpen(true);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.show({
        title: 'Failed to register event',
        description: getErrorMessage(error),
      });
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
            {fields.map(field => (
              <RegistrationForm
                key={field.evhfId}
                {...field}
                onValueChange={val => {
                  setFieldsData({...fieldsData, [field.evhfName]: val});
                }}
              />
            ))}
          </VStack>
        </VStack>
        <Box backgroundColor={'#F4F6F9'} py="3" px="4" pr="8">
          <Checkbox.Group
            onChange={setCheckbox}
            value={checkbox}
            accessibilityLabel="Agree to terms">
            <Checkbox value="agreed" _text={{fontSize: 12, flexWrap: 'wrap'}}>
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
    </ScrollView>
  );
}
