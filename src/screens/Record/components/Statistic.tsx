import {Box, View} from 'native-base';
import React from 'react';
import Section from '../../../components/section/Section';
import {Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {ChartData} from 'react-native-chart-kit/dist/HelperTypes';
import useActivity from '../../../hooks/useActivities';
import EmptyMessage from '../../../components/EmptyMessage';

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

function calculateMinutes(str?: string) {
  if (!str) {
    str = '00:00';
  }
  const [minutes, seconds] = str.split(':');
  return Number(minutes) + Number(seconds) / 60;
}

const nowYear = new Date().getFullYear();
const years = Array.from({length: 5}, (v, i) => nowYear - i).reverse();

export default function Statistic() {
  const {activities} = useActivity();

  const screenWidth = Dimensions.get('window').width * 0.9;

  const groupByYear = activities.reduce((acc, curr) => {
    const year = new Date(curr.mmacCreatedTime).getFullYear();
    if (acc[year]) {
      acc[year].push(calculateMinutes(curr.averagePace));
    } else {
      acc[year] = [calculateMinutes(curr.averagePace)];
    }
    return acc;
  }, {} as {[key: string]: number[]});

  let averageByYear: {[key: string]: number} = {};
  for (const year of years) {
    if (groupByYear[year]) {
      averageByYear[year] =
        groupByYear[year].reduce((acc: any, curr: any) => acc + curr) /
        groupByYear[year].length;
    } else {
      averageByYear[year] = 0;
    }
  }

  if (Object.keys(averageByYear).length < 5) {
    averageByYear = {
      ...averageByYear,
      [String(Number(Object.keys(averageByYear)[0]) - 1)]: 0,
    };
  }

  const datasetsData = Object.values(averageByYear);
  //  [20, 45, 28, 80, 99, 43];
  const data: ChartData = {
    // labels: ['2017', '2018', '2019', '2020', '2021', '2022'],
    labels: Object.keys(averageByYear),
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
        {datasetsData.filter(item => item > 0).length === 0 && (
          <Box position="absolute" right="25%" top="20%">
            <EmptyMessage />
          </Box>
        )}
      </Section>
    </View>
  );
}
