import {Toast} from 'native-base';
import {useState} from 'react';
import {createGlobalState} from 'react-hooks-global-state';
import {EventService} from '../api/event.service';
import {getErrorMessage} from '../helpers/errorHandler';
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
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const [resEvents, setResEvents] = useGlobalState('resEvents');
  const [resFeaturedEvents, setResFeaturedEvents] =
    useGlobalState('resFeaturedEvents');

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
        }
        setIsLoading(false);
      })
      .catch(err => {
        Toast.show({
          title: 'Failed to get events',
          description: getErrorMessage(err),
        });
        setIsLoading(false);
      });
  };

  // const fetchListFeaturedEvents = () => {
  //   setIsLoadingFeatured(true);
  //   EventService.getEvents(true)
  //     .then(res => {
  //       // console.info('res getEvents', JSON.stringify(res));
  //       if (res) {
  //         res.data = (res.data || []).map(item => ({
  //           ...item,
  //           eimgEvnhId: res.linked.eimgEvnhId?.filter(
  //             img => img.eimgEvnhId === item.evnhId,
  //           ),
  //         }));
  //         setResFeaturedEvents(res);
  //       }
  //       setIsLoadingFeatured(false);
  //     })
  //     .catch(err => {
  //       console.info('error fetch featured events', err);
  //       // Toast.show({
  //       //   title: 'Failed to get featured events',
  //       //   description: getErrorMessage(err),
  //       // });
  //       setIsLoadingFeatured(false);
  //     });
  // };

  return {
    isLoading,
    resEvents,
    events: resEvents && resEvents.data ? resEvents.data : [],
    isLoadingFeatured,
    featuredEvents:
      resEvents && resEvents.data
        ? resEvents.data.filter(event => event.evnhFeatured)
        : [],
    // resFeaturedEvents,
    // featuredEvents:
    //   resFeaturedEvents && resFeaturedEvents.data ? resFeaturedEvents.data : [],
    // featuredEvents: (resEvents?.linked.eimgEvnhId || []).map(image => {
    //   const findEvent = (resEvents?.data || []).find(
    //     event => event.evnhId === image.eimgEvnhId,
    //   );
    //   if (findEvent) {
    //     image = {
    //       ...image,
    //       event: {...findEvent},
    //     };
    //   }
    //   return image;
    // }),
    // setResEvents,
    fetchList,
    // fetchListFeaturedEvents,
  };
}
