import {View} from 'native-base';
import React from 'react';
import Section from '../../../components/section/Section';
import {Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {ChartData} from 'react-native-chart-kit/dist/HelperTypes';

const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(118, 132, 153, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 1,
  yAxisInterval: 0.5,
  yAxisSuffix: ' h',
  useShadowColorFromDataset: false,
  barColors: '#EB1C23',
};

export default function Statistic() {
  const screenWidth = Dimensions.get('window').width * 0.9;
  const datasetsData = [20, 45, 28, 80, 99, 43];
  const data: ChartData = {
    labels: ['2017', '2018', '2019', '2020', '2021', '2022'],
    datasets: [
      {
        data: datasetsData,
        colors: datasetsData.map(() => () => '#EB1C23'),
        strokeWidth: 1,
      },
    ],
  };
  return (
    <View px="4">
      <Section title="Statistic" subtitle="My running progress">
        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          flatColor
          withCustomBarColorFromData
          showBarTops={false}
        />
      </Section>
    </View>
  );
}
