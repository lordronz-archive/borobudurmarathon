import {store} from '@/store';

const timer = {
  _interval: 0,
  async startTimer() {
    console.log('Start timer...');
    if (this._interval !== 0){
      console.log('Timer already started..., clear first!');
      clearInterval(this._interval);
    }
    this._interval = setInterval(() => {
      // console.log('Ticking...', store.getters['geo/currentOdo']);
      if (!store.getters['activity/isPaused']){
        store.commit("activity/addElapsedCount");
      }
      if (store.getters['activity/isActive']){
        store.commit("activity/setCurrentOdo", store.getters['geo/currentOdo']);
      }
      // store.dispatch("geo/getOdometer").then((odometer)=>{
      //   console.log('Odo...', odometer);        
      // });
    }, 1000);
  }
};

export { timer };