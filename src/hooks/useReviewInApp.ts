import AsyncStorage from '@react-native-async-storage/async-storage';
import InAppReview from 'react-native-in-app-review';
import crashlytics from '@react-native-firebase/crashlytics';

type IReviewInAppLog = {
  [key: string]: {
    createdAt: string;
  };
};

export default function useReviewInApp() {
  const initReviewInApp = async (eventId?: number | number[]) => {
    const reviewLog = await getReviewLog();

    if (!InAppReview.isAvailable()) {
      return;
    }

    if (eventId && Array.isArray(eventId)) {
      if (eventId.length > 0) {
        const isAlreadyReview = eventId.find(
          item => !!reviewLog['event_' + item],
        );

        if (isAlreadyReview) {
          return;
        }
      } else {
        return;
      }
    } else if (eventId && reviewLog['event_' + eventId]) {
      return;
    } else if (reviewLog.latest) {
      const now = new Date();
      const latestReviewAt = new Date(reviewLog.latest.createdAt);
      if (now.getTime() - latestReviewAt.getTime() <= 300000) {
        // jika kurang dari 5 menit, jangan tampilkan lagi
        return;
      }
    }

    InAppReview.RequestInAppReview()
      .then(hasFlowFinishedSuccessfully => {
        // when return true in android it means user finished or close review flow
        console.log('InAppReview in android', hasFlowFinishedSuccessfully);

        // when return true in ios it means review flow lanuched to user.
        console.log(
          'InAppReview in ios has launched successfully',
          hasFlowFinishedSuccessfully,
        );

        // 1- you have option to do something ex: (navigate Home page) (in android).
        // 2- you have option to do something,
        // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

        // 3- another option:
        if (hasFlowFinishedSuccessfully) {
          console.info('hasFlowFinishedSuccessfully TRUE');
          if (eventId) {
            const newLog = {
              ...reviewLog,
              ['event_' + eventId]: {
                createdAt: new Date().toISOString(),
              },
            };
            saveReviewLog({...newLog});
          } else {
            const newLog = {
              ...reviewLog,
              latest: {
                createdAt: new Date().toISOString(),
              },
            };
            saveReviewLog({...newLog});
          }
          // do something for ios
          // do something for android
        } else {
          console.info('hasFlowFinishedSuccessfully FALSE');
        }

        // for android:
        // The flow has finished. The API does not indicate whether the user
        // reviewed or not, or even whether the review dialog was shown. Thus, no
        // matter the result, we continue our app flow.

        // for ios
        // the flow lanuched successfully, The API does not indicate whether the user
        // reviewed or not, or he/she closed flow yet as android, Thus, no
        // matter the result, we continue our app flow.
      })
      .catch(error => {
        //we continue our app flow.
        // we have some error could happen while lanuching InAppReview,
        // Check table for errors and code number that can return in catch.
        console.log(error);
        crashlytics().recordError(error);
      });
  };

  return {
    initReviewInApp,
  };
}

const REVIEW_LOG = 'REVIEW_LOG';

async function saveReviewLog(newLog: IReviewInAppLog) {
  AsyncStorage.setItem(REVIEW_LOG, JSON.stringify(newLog));
}
async function getReviewLog() {
  const res = await AsyncStorage.getItem(REVIEW_LOG);
  if (res) {
    try {
      const parsed = JSON.parse(res);
      return parsed;
    } catch (err) {
      return null;
    }
  } else {
    return null;
  }
}
