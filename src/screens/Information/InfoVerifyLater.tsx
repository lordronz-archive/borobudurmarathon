import React from 'react';
import {Box, useTheme, ScrollView, Image, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';

export default function InfoVerifyLaterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();

  return (
    <ScrollView backgroundColor={colors.white}>
      <Header title="Verify Profile Later Info" left="back" />
      <Box borderTopColor={colors.gray[500]} w="full">
        <Box w="full" px="25px" py="32px" backgroundColor="#EB1C23">
          <Text
            fontWeight={400}
            fontSize="12px"
            textAlign={'center'}
            color="white"
            mb="12px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            rutrum neque sed vestibulum sodales. Duis pellentesque et nunc at
            rhoncus. Cras at libero sodales, sollicitudin diam non, ultrices
            eros. Cras ultrices mauris et urna rhoncus ullamcorper. Proin
            fringilla non tortor vel pharetra. Nullam mollis volutpat leo vitae
            blandit. Orci varius natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus.
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
}
