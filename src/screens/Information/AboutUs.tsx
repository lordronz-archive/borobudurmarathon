import React from 'react';
import {Box, useTheme, ScrollView, Image, Text} from 'native-base';
import Header from '../../components/header/Header';
import AppContainer from '../../layout/AppContainer';
import {t} from 'i18next';

export default function AboutUsScreen() {
  const {colors} = useTheme();

  return (
    <AppContainer>
      <ScrollView backgroundColor={colors.white}>
        <Header title={t('info.aboutUs')} left="back" />
        <Box borderTopColor={colors.gray[500]} w="full">
          <Image
            w="full"
            h="200"
            source={{
              uri: 'https://borobudurmarathon.com/wp-content/uploads/2022/05/MENUMBUHKAN-BIBIT-SEMANGATREV-1536x1024.jpg',
            }}
            alt="Welcome Image"
          />
          <Box w="full" px="25px" py="32px" backgroundColor="#EB1C23">
            <Text
              fontWeight={600}
              fontSize="25px"
              textAlign={'center'}
              color="white"
              mb="12px">
              {t('aboutUsContent.title_1')}
            </Text>
            <Text
              fontWeight={400}
              fontSize="12px"
              textAlign={'center'}
              color="white"
              mb="12px">
              {t('aboutUsContent.description_1a')}
            </Text>
            <Text
              fontWeight={400}
              fontSize="12px"
              textAlign={'center'}
              color="white">
              {t('aboutUsContent.description_1b')}
            </Text>
          </Box>
          <Box w="full" px="25px" py="32px">
            <Text
              fontWeight={600}
              fontSize="25px"
              textAlign={'center'}
              color="#EB1C23"
              mb="12px">
              {t('aboutUsContent.title_2')}
            </Text>
            <Text
              fontWeight={400}
              fontSize="12px"
              textAlign={'center'}
              mb="12px">
              {t('aboutUsContent.description_2a')}
            </Text>
            <Text fontWeight={400} fontSize="12px" textAlign={'center'}>
              {t('aboutUsContent.description_2b')}
            </Text>
          </Box>
          <Box alignItems={'center'} py="42px">
            <Text
              fontWeight={400}
              fontSize="12px"
              textAlign={'center'}
              mb="21px">
              Member of
            </Text>
            <Image
              source={require('../../assets/images/member_of.png')}
              alt="Welcome Image"
            />
          </Box>
        </Box>
      </ScrollView>
    </AppContainer>
  );
}
