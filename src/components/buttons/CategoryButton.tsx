import React from 'react';
import {Box, FlatList, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';

type CategoryButtonType = {
  categories: string[];
};

export default function CategoryButton({categories}: CategoryButtonType) {
  return (
    <FlatList
      horizontal
      data={categories}
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity>
            <Box
              bg="rgba(235, 28, 35, 0.08)"
              borderColor={'red.400'}
              borderWidth={1}
              px={4}
              py={2}
              borderRadius={7}
              mr={2}>
              <Text color="black">{item}</Text>
            </Box>
          </TouchableOpacity>
        );
      }}
    />
  );
}
