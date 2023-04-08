import {useState} from 'react';
import {createGlobalState} from 'react-hooks-global-state';
import FastImage from 'react-native-fast-image';
import {EventService} from '../api/event.service';
import {handleErrorMessage} from '../helpers/apiErrors';
const defaultImage = require('../assets/images/no-image.png');

type IStateEvent = {
  galleries: string[];
};

const initialState: IStateEvent = {
  galleries: [],
};
const {useGlobalState} = createGlobalState(initialState);

export default function useGallery() {
  const [isLoading, setIsLoading] = useState(false);
  const [galleries, setGalleries] = useGlobalState('galleries');

  const fetchGalleries = async () => {
    try {
      setIsLoading(true);
      const {data} = await EventService.getGallery();
      console.log('GALLERY', JSON.stringify(data));

      if (data && data.data) {
        let galleriesRaw = data.data.map(v => v.mgalUrl);
        if (galleriesRaw.length < 10) {
          for (let i = 0; i < 10; ++i) {
            const temp =
              galleriesRaw[Math.floor(Math.random() * galleriesRaw.length)];
            galleriesRaw.push(temp);
          }
        }

        if (galleriesRaw.length > 0) {
          FastImage.preload(
            galleriesRaw
              .map(uri => ({uri, priority: FastImage.priority.high}))
              .filter(uri => uri),
          );
        }

        if (galleriesRaw.length === 0) {
          galleriesRaw = [
            defaultImage,
            defaultImage,
            defaultImage,
            defaultImage,
            defaultImage,
            defaultImage,
            defaultImage,
            defaultImage,
          ];
        }

        console.info('galleriesRaw before sort random', galleriesRaw);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        galleriesRaw.sort((a, b) => 0.5 - Math.random());
        console.info('galleriesRaw after sort random', galleriesRaw);
        setGalleries([...galleriesRaw]);

        // const randomized =
        //   galleriesRaw && galleriesRaw?.length > 7 ? galleriesRaw : [];
        // if (galleriesRaw && !randomized.length) {
        //   for (let i = 0; i < 8; ++i) {
        //     const temp =
        //       galleriesRaw[Math.floor(Math.random() * galleriesRaw.length)];
        //     randomized.push(temp);
        //   }
        // }
        setIsLoading(false);
        return galleriesRaw;
      } else {
        setIsLoading(false);
        return [];
      }
    } catch (err) {
      handleErrorMessage(err);
      setIsLoading(false);
      return [];
    }
  };

  return {
    isLoading,
    galleries,
    fetchGalleries,
  };
}
