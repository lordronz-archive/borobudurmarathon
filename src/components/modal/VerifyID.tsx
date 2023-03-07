import {AlertDialog, Center, Spinner, Text} from 'native-base';
import React from 'react';
import IconCircleX from '../../assets/icons/IconCircleX';
import BMButton from '../../components/buttons/Button';

type VerifyIDProps = {
  cancelRef?: React.RefObject<any>;
  isOpen: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  buttonContent?: React.ReactNode;
  onClose: (a?: any) => any;
  onPress: (a?: any) => any;
  isLoading?: boolean;
};

const VerifyID = ({
  cancelRef,
  isOpen,
  onClose,
  onPress,
  title,
  buttonContent,
  content,
  isLoading = false,
}: VerifyIDProps) => {
  return (
    <AlertDialog
      leastDestructiveRef={cancelRef as React.RefObject<any>}
      isOpen={isOpen}
      onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.Body p="4">
          <Center>
            {isLoading ? (
              <Spinner color="primary.900" />
            ) : (
              <IconCircleX size={110} />
            )}
            <Center px="2" mb="4" mt="4">
              <Text fontWeight={600} fontSize={16} mb="4">
                {title ? title : 'VerifyID'}
              </Text>
              <Text fontWeight={400} color="#768499" fontSize={11}>
                {content}
              </Text>
            </Center>
            {!isLoading && (
              <BMButton h="12" width="full" onPress={onPress}>
                {buttonContent}
              </BMButton>
            )}
          </Center>
        </AlertDialog.Body>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default VerifyID;
