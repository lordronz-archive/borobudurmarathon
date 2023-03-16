import { Toast } from 'native-base';
import {useState} from 'react';
import {createGlobalState} from 'react-hooks-global-state';
import {EventService} from '../api/event.service';
import {getErrorMessage} from '../helpers/errorHandler';
import {GetEventsResponse} from '../types/event.type';

type IStateEvent = {
  resEvents?: GetEventsResponse;
};

const initialState: IStateEvent = {
  resEvents: undefined,
};
const {useGlobalState} = createGlobalState(initialState);

export default function useEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [resEvents, setResEvent] = useGlobalState('resEvents');

  const fetchList = () => {
    setIsLoading(true);
    EventService.getEvents()
      .then(res => {
        console.info('res getEvents', JSON.stringify(res));
        if (res.data) {
          setResEvent(res);
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

  return {
    isLoading,
    resEvents,
    events: resEvents && resEvents.data ? resEvents.data : [],
    setResEvent,
    fetchList,
  };
}
