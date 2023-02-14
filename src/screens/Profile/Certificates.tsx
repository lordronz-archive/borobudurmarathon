import {Box, Button, ScrollView, Text, View, VStack} from 'native-base';
import React from 'react';
import Header from '../../components/header/Header';
import I18n from '../../lib/i18n';
import {useAuthUser} from '../../context/auth.context';
import Pdf from 'react-native-pdf';
import {StyleProp, ViewStyle} from 'react-native';
import IconDownload from '../../assets/icons/IconDownload';

const PDF_STYLE: StyleProp<ViewStyle> = {
  width: '100%',
  height: '100%',
};

export default function CertificatesScreen() {
  const {user: _user} = useAuthUser();
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
            <Text fontWeight={600} fontFamily="Poppins-Medium" fontSize="14px">
              Download Certificate
            </Text>
          </Button>
        </VStack>
      </ScrollView>
    </View>
  );
}
