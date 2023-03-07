import React from 'react';
import {Box, useTheme, ScrollView, Image, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';

export default function AboutUsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();

  return (
    <ScrollView backgroundColor={colors.white}>
      <Header title="About Us" left="back" />
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
            Stronger to Victory
          </Text>
          <Text
            fontWeight={400}
            fontSize="12px"
            textAlign={'center'}
            color="white"
            mb="12px">
            Our resilience has been tested by going through challenging years.
            The challenges we have faced introduce us to stronger versions of
            ourselves.
          </Text>
          <Text
            fontWeight={400}
            fontSize="12px"
            textAlign={'center'}
            color="white">
            Borobudur Marathon 2-22 Powered by Bank Jateng welcomes back runners
            to spread the spirit of stronger to victory with the people of
            Magelang. This year, together we sahre the journey to victory
          </Text>
        </Box>
        <Box w="full" px="25px" py="32px">
          <Text
            fontWeight={600}
            fontSize="25px"
            textAlign={'center'}
            color="#EB1C23"
            mb="12px">
            Lelampah Pinuju Menang
          </Text>
          <Text fontWeight={400} fontSize="12px" textAlign={'center'} mb="12px">
            Our resilience has been tested by going through challenging years.
            The challenges we have faced introduce us to stronger versions of
            ourselves.
          </Text>
          <Text fontWeight={400} fontSize="12px" textAlign={'center'}>
            Borobudur Marathon 2-22 Powered by Bank Jateng welcomes back runners
            to spread the spirit of stronger to victory with the people of
            Magelang. This year, together we sahre the journey to victory
          </Text>
        </Box>
        <Box alignItems={'center'} py="42px">
          <Text fontWeight={400} fontSize="12px" textAlign={'center'} mb="21px">
            Member of
          </Text>
          <Image
            source={require('../../assets/images/member_of.png')}
            alt="Welcome Image"
          />
        </Box>
      </Box>
    </ScrollView>
  );
}
