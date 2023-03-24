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
import {WelcomeService} from '../../api/welcome.service';
import AppContainer from '../../layout/AppContainer';
// import useuser from '../../hooks/useuser';
import useInit from '../../hooks/useInit';

export default function WelcomeScreen() {
  const {user} = useAuthUser();
  const {getProfile} = useInit();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const [galleries, setGalleries] = useState<GetGalleryResponse>();

  // const user = useuser();
  useEffect(() => {
    if (user?.data && user?.data.length > 0 && user?.data[0].zmemId) {
      WelcomeService.updateLatestView(user?.data[0].zmemId);
    }
    (async () => {
      const {data} = await EventService.getGallery();
      console.log('GALLERY', JSON.stringify(data));
      setGalleries(data);
    })();

    getProfile();
  }, []);

  if (!user) {
    return (
      <Box flex={1}>
        <LoadingBlock text="Waiting user data..." />
      </Box>
    );
  }

  const galleriesRaw = galleries?.data.map(v => v.mgalUrl);
  const galleriesRandomized =
    galleriesRaw && galleriesRaw?.length > 7 ? galleriesRaw : [];
  if (galleriesRaw && !galleriesRandomized.length) {
    for (let i = 0; i < 9; ++i) {
      const temp =
        galleriesRaw[Math.floor(Math.random() * galleriesRaw.length)];
      galleriesRandomized.push(temp);
    }
  }

  return (
    <AppContainer>
      <VStack px="2" flex="1">
        <HStack flex="9" space={10.51} py="3">
          <VStack flex="1" space="2">
            <Image
              flex="2"
              borderRadius={8}
              source={
                galleriesRandomized[0]
                  ? {
                      uri: galleriesRandomized[0],
                    }
                  : require('../../assets/images/no-image.png')
              }
              fallbackSource={require('../../assets/images/no-image.png')}
              alt="Welcome Image"
            />
            <Box
              flex="3"
              borderWidth={1}
              borderColor="#E8ECF3"
              borderRadius={8}
              overflow="hidden">
              {/* <Image
                flex="2"
                borderRadius={8}
                source={
                  galleriesRandomized[1]
                    ? {
                        uri: galleriesRandomized[1],
                      }
                    : require('../../assets/images/no-image.png')
                }
                fallbackSource={require('../../assets/images/no-image.png')}
                alt="Welcome Image"
              /> */}
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
              {/* <Box backgroundColor={'#EB1C23'} height={2} /> */}
            </Box>
            <Image
              flex="1.5"
              borderRadius={8}
              source={
                galleriesRandomized[2]
                  ? {
                      uri: galleriesRandomized[2],
                    }
                  : require('../../assets/images/no-image.png')
              }
              fallbackSource={require('../../assets/images/no-image.png')}
              alt="Welcome Image"
            />
          </VStack>
          <VStack flex="1" space="2">
            <HStack space={10.51} flex="1.5">
              <Image
                flex="1.5"
                borderRadius={8}
                source={
                  galleriesRandomized[3]
                    ? {
                        uri: galleriesRandomized[3],
                      }
                    : require('../../assets/images/no-image.png')
                }
                fallbackSource={require('../../assets/images/no-image.png')}
                alt="Welcome Image"
              />
              <Image
                flex="2.4"
                borderRadius={8}
                source={
                  galleriesRandomized[4]
                    ? {
                        uri: galleriesRandomized[4],
                      }
                    : require('../../assets/images/no-image.png')
                }
                fallbackSource={require('../../assets/images/no-image.png')}
                alt="Welcome Image"
              />
            </HStack>
            <Image
              flex="1.5"
              borderRadius={8}
              source={
                galleriesRandomized[5]
                  ? {
                      uri: galleriesRandomized[5],
                    }
                  : require('../../assets/images/no-image.png')
              }
              fallbackSource={require('../../assets/images/no-image.png')}
              alt="Welcome Image"
            />
            <Image
              flex="2.4"
              borderRadius={8}
              source={
                galleriesRandomized[6]
                  ? {
                      uri: galleriesRandomized[6],
                    }
                  : require('../../assets/images/no-image.png')
              }
              fallbackSource={require('../../assets/images/no-image.png')}
              alt="Welcome Image"
            />
            <Image
              flex="3"
              borderRadius={8}
              source={
                galleriesRandomized[7]
                  ? {
                      uri: galleriesRandomized[7],
                    }
                  : require('../../assets/images/no-image.png')
              }
              fallbackSource={require('../../assets/images/no-image.png')}
              alt="Welcome Image"
            />
            <Image
              flex="1.5"
              borderRadius={8}
              source={
                galleriesRandomized[8]
                  ? {
                      uri: galleriesRandomized[8],
                    }
                  : require('../../assets/images/no-image.png')
              }
              fallbackSource={require('../../assets/images/no-image.png')}
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
    </AppContainer>
  );
}
