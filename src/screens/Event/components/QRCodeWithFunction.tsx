import {t} from 'i18next';
import {Box, Center, Spinner, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {SvgXml} from 'react-native-svg';
import {EventService} from '../../../api/event.service';
import {handleErrorMessage} from '../../../helpers/apiErrors';

type Props = {
  trnsRefId: string;
  evpaBIBNo: string | number;
};
export default function QRCodeWithFunction(props: Props) {
  const [QR, setQR] = useState<any>();

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    try {
      const resQR = await EventService.generateQR(
        props.trnsRefId + '%' + props.evpaBIBNo,
      );
      console.log('resQR', resQR);

      if (resQR) {
        setQR(resQR);
      }
    } catch (err) {
      handleErrorMessage(err, t('error.failedToGenerateQR'));
    }
  };

  if (!QR) {
    return (
      <Center>
        <Box
          width="160"
          height="160"
          borderWidth="1"
          borderColor="gray.300"
          mb="2"
          justifyContent="center">
          <Spinner />
        </Box>
      </Center>
    );
  }

  return (
    <Center>
      <Box alignItems={'center'}>
        <SvgXml xml={QR} />
      </Box>
    </Center>
  );
}
