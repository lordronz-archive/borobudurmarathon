import {t} from 'i18next';
import {useState} from 'react';
import {createGlobalState} from 'react-hooks-global-state';
import FastImage from 'react-native-fast-image';
import {EventService} from '../api/event.service';
import {handleErrorMessage} from '../helpers/apiErrors';
import {GetEventsResponse} from '../types/event.type';

type IStateEvent = {
  resEvents?: GetEventsResponse;
  resFeaturedEvents?: GetEventsResponse;
};

const initialState: IStateEvent = {
  resEvents: undefined,
  resFeaturedEvents: undefined,
};
const {useGlobalState} = createGlobalState(initialState);

export default function useEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [resEvents, setResEvents] = useGlobalState('resEvents');

  const fetchList = () => {
    setIsLoading(true);
    EventService.getEvents()
      .then(res => {
        console.info('res getEvents', JSON.stringify(res));
        if (res) {
          // featured events
          res.data = (res.data || []).map(item => ({
            ...item,
            eimgEvnhId: res.linked.eimgEvnhId?.filter(
              img => img.eimgEvnhId === item.evnhId,
            ),
          }));
          setResEvents(res);
          FastImage.preload(
            res.data
              .filter(item => item.evnhThumbnail)
              .map(item => ({
                uri: item.evnhThumbnail || '',
                priority: FastImage.priority.high,
              })),
          );
        }
        setIsLoading(false);
      })
      .catch(err => {
        handleErrorMessage(err, t('error.failedToGetEvents'));
        setIsLoading(false);
      });
  };

  return {
    isLoading,
    resEvents,
    events: resEvents && resEvents.data ? resEvents.data : [],
    isLoadingFeatured: isLoading,
    featuredEvents:
      resEvents && resEvents.data
        ? resEvents.data.filter(event => event.evnhFeatured)
        : [],
    fetchList,
  };
}
