import {useState} from 'react';
import {createGlobalState} from 'react-hooks-global-state';
import {EventService} from '../api/event.service';
import {useAuthUser} from '../context/auth.context';
import {averagePace} from '../helpers/averagePace';
import {Activity, Datum} from '../types/activity.type';

type IStateActivity = {
  resActivity?: Activity;
  bestRecord?: Datum;
};

const initialState: IStateActivity = {
  resActivity: undefined,
  bestRecord: undefined,
};
const {useGlobalState} = createGlobalState(initialState);

export default function useActivity() {
  const {user} = useAuthUser();
  const [isLoading, setIsLoading] = useState(false);
  const [resActivity, setResActivity] = useGlobalState('resActivity');
  const [bestRecord, setBestRecord] = useGlobalState('bestRecord');

  const fetchList = async () => {
    try {
      // const memberId =
      //   user?.linked?.mrvrZmemId && user?.linked?.mrvrZmemId.length > 0
      //     ? String(user?.linked?.mrvrZmemId[0].mrvrZmemId)
      //     : '';
      const memberId =
        user?.data && user?.data.length > 0 ? user?.data[0].zmemId : '';
      setIsLoading(true);
      const res: any = await EventService.getGarminActivities(String(memberId));
      res.data.data = res.data.data.map((activity: Datum) => ({
        ...activity,
        averagePace: averagePace(
          activity.mmacTimeHour,
          activity.mmacTimeMinute,
          activity.mmacTimeSecond,
          activity.mmacDistance,
        ),
      }));
      console.info('res.data.dataaaaa', res.data.data);

      const copiedData = [...res.data.data];
      copiedData.sort((a: any, b: any) => {
        return b.averagePace?.localeCompare(a.averagePace || '');
      });

      if (copiedData.length > 0) {
        setBestRecord(copiedData[0]);
      }

      setResActivity(res.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    resActivity,
    activities: resActivity && resActivity.data ? resActivity.data : [],
    bestRecord,
    setResActivity,
    fetchList,
  };
}
