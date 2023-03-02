import React from 'react';
import {useTheme, ScrollView, Box, Image} from 'native-base';
import Header from '../../components/header/Header';
import ListSponsorCard from '../../components/card/ListSponsorCard';

export default function PartnerScreen() {
  const {colors} = useTheme();

  return (
    <ScrollView backgroundColor={colors.white}>
      <Header title="" left="back" />

      <ListSponsorCard
        title="Komite"
        priority="high"
        items={[
          {
            title: 'DIBERDAYAKAN OLEH',
            logo: (
              <Image
                source={require('../../assets/images/partners/bank-jateng.png')}
              />
            ),
            description:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            url: 'https://bankjateng.co.id',
          },
          {
            title: 'DIPRAKARSAI OLEH',
            logo: (
              <Image
                source={require('../../assets/images/partners/bormar.png')}
              />
            ),
            description:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            url: 'https://borobudurmarathon.com/',
          },
          {
            title: 'DISELENGGARAKAN OLEH',
            logo: (
              <Image
                source={require('../../assets/images/partners/kompas.png')}
              />
            ),
            description:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            url: 'https://kompas.id/',
          },
          {
            title: 'DIDUKUNG OLEH',
            logo: (
              <Image
                source={require('../../assets/images/partners/government.png')}
              />
            ),
            description:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            url: 'https://jatengprov.go.id/',
          },
        ]}
      />

      <ListSponsorCard
        title="Official"
        priority="medium"
        items={[
          {
            title: 'MITRA RESMI ISOTONIK',
            logo: (
              <Image
                source={require('../../assets/images/partners/isoplus.png')}
              />
            ),
          },
          {
            title: 'MITRA RESMI AIR MINUM',
            logo: (
              <Image
                source={require('../../assets/images/partners/aqua.png')}
              />
            ),
          },
          {
            title: 'MITRA RESMI ASURANSI',
            logo: (
              <Image
                source={require('../../assets/images/partners/generali.png')}
              />
            ),
          },
        ]}
      />

      <ListSponsorCard
        title="Co Sponsor"
        priority="low"
        items={[
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/counterpain.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/toyota.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/vaseline.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/vinilon.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/telkomsel.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/kahf.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/strive.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/santika.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/fitbar.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/new-balance.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/aspro.png')}
              />
            ),
          },
          {
            logo: (
              <Image
                source={require('../../assets/images/partners/siloam.png')}
              />
            ),
          },
        ]}
      />

      <Box height="50" />
    </ScrollView>
  );
}
