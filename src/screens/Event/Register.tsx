import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Box,
  Checkbox,
  Text,
  VStack,
  ScrollView,
  Divider,
  useToast,
} from 'native-base';
import React, {useState} from 'react';
import BMButton from '../../components/buttons/Button';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from '../../components/header/Header';
import RegistrationForm from './components/RegistrationForm';
import {EventFieldsEntity} from '../../types/event.type';
import {EventService} from '../../api/event.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import Congratulation from '../../components/modal/Congratulation';

export default function EventRegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const toast = useToast();

  const route = useRoute();
  const params = route.params as RootStackParamList['EventRegister'];

  const fields =
    params.event.fields && Array.isArray(params.event.fields)
      ? params.event.fields
      : params.event.fields && typeof params.event.fields === 'object'
      ? (Object.values(params.event.fields) as any[])
      : [];
  console.info('fields', fields);

  const [isOpen, setIsOpen] = React.useState(false);
  const [fieldsData, setFieldsData] = React.useState<any>({});

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  const [checkbox, setCheckbox] = useState<string[]>([]);

  const register = async () => {
    let valid = true;

    fields.forEach((f: EventFieldsEntity) => {
      if (f.evhfIsRequired.toString() === '1' && !(f.evhfName in fieldsData)) {
        valid = false;
      }
    });

    if (!valid) {
      return;
    }
    const payload = {
      ...fieldsData,
      evpaEvnhId: params.event.data.evnhId,
      evpaEvncId: params.selectedCategoryId,
    };
    try {
      const res: any = await EventService.registerEvent(payload);
      console.info(res.data);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
      toast.show({
        title: 'Failed to register event',
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <ScrollView>
      <Header title="Form Registration" left="back" />
      <VStack space="4" pb="3">
        <Divider
          my="2"
          _light={{
            bg: 'muted.800',
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
              .filter(f => f.evhfIsAttribute === '1')
              .map(field => (
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
        <Box px="4">
          <BMButton
            h="12"
            onPress={() => {
              register();
            }}>
            Register Now
          </BMButton>
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
