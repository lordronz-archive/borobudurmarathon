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
import React, {useEffect} from 'react';
import {Heading} from '../../components/text/Heading';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useAuthUser} from '../../context/auth.context';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';
// import useuser from '../../hooks/useuser';
import useInit from '../../hooks/useInit';
import FastImage from 'react-native-fast-image';
import useGallery from '../../hooks/useGallery';

export default function WelcomeScreen() {
  const {user} = useAuthUser();
  const {getProfile} = useInit();
  const {galleries} = useGallery();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  // const [galleries, setGalleriesRandomized] = useState<string[]>([]);

  useEffect(() => {
    // fetchGallery();
    getProfile();
  }, []);

  // const fetchGallery = async () => {
  //   if (user?.data && user?.data.length > 0 && user?.data[0].zmemId) {
  //     WelcomeService.updateLatestView(user?.data[0].zmemId);
  //   }
  //   const galleriesRaw = [...(galleries || [])];
  //   const randomized =
  //     galleriesRaw && galleriesRaw?.length > 7 ? galleriesRaw : [];
  //   if (galleriesRaw && !randomized.length) {
  //     for (let i = 0; i < 8; ++i) {
  //       const temp =
  //         galleriesRaw[Math.floor(Math.random() * galleriesRaw.length)];
  //       randomized.push(temp);
  //     }
  //   }
  //   setGalleriesRandomized(randomized);
  // };

  if (!user) {
    return (
      <Box flex={1}>
        <LoadingBlock text="Waiting user data..." />
      </Box>
    );
  }

  return (
    <AppContainer>
      <VStack px="2" flex="1">
        <HStack flex="9" space={10.51} py="3">
          <VStack flex="1" space="2">
            <FastImage
              defaultSource={require('../../assets/images/no-image.png')}
              style={{flex: 2, borderRadius: 8}}
              source={
                galleries[0]
                  ? {
                      uri: galleries[0],
                      priority: FastImage.priority.normal,
                    }
                  : require('../../assets/images/no-image.png')
              }
              resizeMode={FastImage.resizeMode.cover}
              fallback={require('../../assets/images/no-image.png')}
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
                  galleries[1]
                    ? {
                        uri: galleries[1],
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
                      {t('welcomeTo') + '\n'}Borobudur Marathon
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
            <FastImage
              defaultSource={require('../../assets/images/no-image.png')}
              style={{flex: 1.5, borderRadius: 8}}
              source={
                galleries[1]
                  ? {
                      uri: galleries[1],
                      priority: FastImage.priority.normal,
                    }
                  : require('../../assets/images/no-image.png')
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            {/* <Image
              flex="1.5"
              borderRadius={8}
              source={
                galleries[2]
                  ? {
                      uri: galleries[2],
                    }
                  : require('../../assets/images/no-image.png')
              }
              fallbackSource={require('../../assets/images/no-image.png')}
              alt="Welcome Image"
            /> */}
          </VStack>
          <VStack flex="1" space="2">
            <HStack space={10.51} flex="1.5">
              <FastImage
                defaultSource={require('../../assets/images/no-image.png')}
                style={{flex: 1.5, borderRadius: 8}}
                source={
                  galleries[2]
                    ? {
                        uri: galleries[2],
                        priority: FastImage.priority.normal,
                      }
                    : require('../../assets/images/no-image.png')
                }
                resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                defaultSource={require('../../assets/images/no-image.png')}
                style={{flex: 2.4, borderRadius: 8}}
                source={
                  galleries[3]
                    ? {
                        uri: galleries[3],
                        priority: FastImage.priority.normal,
                      }
                    : require('../../assets/images/no-image.png')
                }
                resizeMode={FastImage.resizeMode.cover}
              />
            </HStack>
            <FastImage
              defaultSource={require('../../assets/images/no-image.png')}
              style={{flex: 1.5, borderRadius: 8}}
              source={
                galleries[4]
                  ? {
                      uri: galleries[4],
                      priority: FastImage.priority.normal,
                    }
                  : require('../../assets/images/no-image.png')
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <FastImage
              defaultSource={require('../../assets/images/no-image.png')}
              style={{flex: 2.4, borderRadius: 8}}
              source={
                galleries[5]
                  ? {
                      uri: galleries[5],
                      priority: FastImage.priority.normal,
                    }
                  : require('../../assets/images/no-image.png')
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <FastImage
              defaultSource={require('../../assets/images/no-image.png')}
              style={{flex: 3, borderRadius: 8}}
              source={
                galleries[6]
                  ? {
                      uri: galleries[6],
                      priority: FastImage.priority.normal,
                    }
                  : require('../../assets/images/no-image.png')
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <FastImage
              defaultSource={require('../../assets/images/no-image.png')}
              style={{flex: 1.5, borderRadius: 8}}
              source={
                galleries[7]
                  ? {
                      uri: galleries[7],
                      priority: FastImage.priority.normal,
                    }
                  : require('../../assets/images/no-image.png')
              }
              resizeMode={FastImage.resizeMode.cover}
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
