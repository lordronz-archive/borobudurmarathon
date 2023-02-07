import {Box, Button, ScrollView, Text, View, VStack} from 'native-base';
import React from 'react';
import Header from '../../components/header/Header';
import I18n from '../../lib/i18n';
import {useAuthUser} from '../../context/auth.context';
import Pdf from 'react-native-pdf';
import {Dimensions} from 'react-native';
import IconDownload from '../../assets/icons/IconDownload';

export default function CertificatesScreen() {
  const {user} = useAuthUser();
  const source = {
    uri: 'https://my.borobudurmarathon.com/dev.titudev.com/api//e-certificate/MTEzMDAxNzAtMzMyLTEyNjM=',
    cache: true,
  };

  return (
    <View>
      <Header title={I18n.t('certificates')} left="back" />
      <ScrollView>
        <VStack px="4" space="4">
          <Box h="300px">
            <Pdf
              trustAllCerts={false}
              source={source}
              style={{
                width: '100%',
                height: '100%',
              }}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
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
            colorScheme="secondary">
            <Text fontWeight={600} fontFamily="Poppins-Medium" fontSize="14px">
              Download Certificate
            </Text>
          </Button>
        </VStack>
      </ScrollView>
    </View>
  );
}
