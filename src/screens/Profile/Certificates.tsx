import {Box, Button, ScrollView, Text, View, VStack} from 'native-base';
import React from 'react';
import Header from '../../components/header/Header';
import {useAuthUser} from '../../context/auth.context';
import Pdf from 'react-native-pdf';
import {FlatList, StyleProp, ViewStyle} from 'react-native';
import IconDownload from '../../assets/icons/IconDownload';
import {useTranslation} from 'react-i18next';
import config from '../../config';

const PDF_STYLE: StyleProp<ViewStyle> = {
  width: '100%',
  height: '100%',
};

export default function CertificatesScreen() {
  const {user} = useAuthUser();
  const {t} = useTranslation();

  // const source = {
  //   uri: 'https://my.borobudurmarathon.com/dev.titudev.com/api//e-certificate/MTEzMDAxNzAtMzMyLTEyNjM=',
  //   cache: true,
  // };

  return (
    <View>
      <Header title={t('certificates')} left="back" />
      <FlatList
        data={user?.linked.mregZmemId}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <VStack px="4" space="4">
            <Box h="300px">
              <Pdf
                trustAllCerts={false}
                source={{
                  uri:
                    config.files.href +
                    config.files.apis.certificate.path +
                    item.mregId,
                  cache: true,
                }}
                style={PDF_STYLE}
                onError={error => {
                  console.log(error);
                }}
                onPressLink={uri => {
                  console.log(`Link pressed: ${uri}`);
                }}
              />
            </Box>
            <Button
              endIcon={<IconDownload />}
              variant="ghost"
              colorScheme="secondary"
              bgColor={'transparent'}
              _stack={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                fontWeight={600}
                fontFamily="Poppins-Medium"
                fontSize="14px">
                Download Certificate
              </Text>
            </Button>
          </VStack>
        )}
      />
    </View>
  );
}
