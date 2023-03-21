import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Button,
  ChevronRightIcon,
  HStack,
  Image,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Heading} from '../../components/text/Heading';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useAuthUser} from '../../context/auth.context';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {EventService} from '../../api/event.service';
import {GetGalleryResponse} from '../../types/gallery.type';
import {useTranslation} from 'react-i18next';
// import useuser from '../../hooks/useuser';

export default function WelcomeScreen() {
  const {user} = useAuthUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const [galleries, setGalleries] = useState<GetGalleryResponse>();

  // const user = useuser();
  useEffect(() => {
    (async () => {
      const {data} = await EventService.getGallery();
      console.log('GALLERY', JSON.stringify(data));
      setGalleries(data);
    })();
  }, []);

  if (!user) {
    return (
      <Box flex={1}>
        <LoadingBlock text="Waiting user data..." />
      </Box>
    );
  }

  return (
    <VStack px="2" flex="1">
      <HStack flex="9" space={10.51} py="3">
        <VStack flex="1" space="2">
          <Image
            flex="2"
            borderRadius={8}
            source={{
              uri:
                galleries?.data[0]?.mgalUrl ||
                'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt="Welcome Image"
          />
          <Box
            flex="3"
            borderWidth={1}
            borderColor="#E8ECF3"
            borderRadius={8}
            overflow="hidden">
            <Image
              borderRadius={8}
              source={require('../../assets/images/welcome-card-img.png')}
              alt="Welcome Image"
              top="0"
              right="0"
              position="absolute"
            />
            <Box flex="1" justifyContent={'space-between'} px="4">
              <Box py="8">
                <Text mb={6} color="#EB1C23" fontWeight={600}>
                  {t('hi')},{' '}
                  {!user.data[0].zmemFullName
                    .split(' ')[0]
                    .match(/^m[uo]c?hamm?[ae]d$/im) ||
                  !user.data[0].zmemFullName.split(' ')[1]
                    ? user.data[0].zmemFullName.split(' ')[0]
                    : user.data[0].zmemFullName.split(' ')[1]}
                </Text>
                <Heading fontWeight={600} fontSize={20}>
                  {t('welcomeTo') + '\n'} Borobudur Marathon
                </Heading>
              </Box>
              <Text py="4" fontSize={10}>
                {t('partOf')} Borobudur Marathon!
              </Text>
            </Box>
            <Box backgroundColor={'#EB1C23'} height={2} />
          </Box>
          <Image
            flex="1.5"
            borderRadius={8}
            source={{
              uri:
                galleries?.data[1]?.mgalUrl ||
                galleries?.data[0]?.mgalUrl ||
                'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt="Welcome Image"
          />
        </VStack>
        <VStack flex="1" space="2">
          <HStack space={10.51} flex="1.5">
            <Image
              flex="1"
              borderRadius={8}
              source={{
                uri:
                  galleries?.data[2]?.mgalUrl ||
                  galleries?.data[0]?.mgalUrl ||
                  'https://wallpaperaccess.com/full/317501.jpg',
              }}
              alt="Welcome Image"
            />
            <Image
              flex="1"
              borderRadius={8}
              source={{
                uri:
                  galleries?.data[3]?.mgalUrl ||
                  galleries?.data[0]?.mgalUrl ||
                  'https://wallpaperaccess.com/full/317501.jpg',
              }}
              alt="Welcome Image"
            />
          </HStack>
          <Image
            flex="1.5"
            borderRadius={8}
            source={{
              uri:
                galleries?.data[4]?.mgalUrl ||
                galleries?.data[0]?.mgalUrl ||
                'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt="Welcome Image"
          />
          <Image
            flex="2.4"
            borderRadius={8}
            source={{
              uri:
                galleries?.data[5]?.mgalUrl ||
                galleries?.data[0]?.mgalUrl ||
                'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt="Welcome Image"
          />
          <Image
            flex="3"
            borderRadius={8}
            source={{
              uri:
                galleries?.data[6]?.mgalUrl ||
                galleries?.data[0]?.mgalUrl ||
                'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt="Welcome Image"
          />
          <Image
            flex="1.5"
            borderRadius={8}
            source={{
              uri:
                galleries?.data[7]?.mgalUrl ||
                galleries?.data[0]?.mgalUrl ||
                'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt="Welcome Image"
          />
        </VStack>
      </HStack>
      <Button
        h="12"
        mb="3"
        backgroundColor={'#1E1E1E'}
        borderRadius={8}
        onPress={() => navigation.replace('Main', {screen: t('tab.home')})}
        rightIcon={<ChevronRightIcon />}
        _stack={{flex: '1', justifyContent: 'space-between', px: '4'}}>
        {t('journey')}
      </Button>
    </VStack>
  );
}
