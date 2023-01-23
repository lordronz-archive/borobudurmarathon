import React from 'react';
import {Box, FlatList, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';

type CategoryButtonType = {
  categories: string[];
  selected: string;
};

export default function CategoryButton({
  categories,
  selected,
}: CategoryButtonType) {
  return (
    <FlatList
      horizontal
      data={categories}
      showsHorizontalScrollIndicator={false}
      _contentContainerStyle={{pr: '8'}}
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity>
            <Box bg="white" shadow="0.5" mr={2}>
              <Box
                {...(selected === item
                  ? {bg: '#FDEBEB', borderColor: 'red.400', borderWidth: 1}
                  : {borderColor: 'gray.300', borderWidth: 1})}
                px={4}
                py={1}
                borderRadius={7}>
                <Text color="black">{item}</Text>
              </Box>
            </Box>
          </TouchableOpacity>
        );
      }}
    />
  );
}
