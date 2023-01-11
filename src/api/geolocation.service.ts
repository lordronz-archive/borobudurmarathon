// import axios, { AxiosRequestConfig } from "axios";
import {store} from '@/store';
// import {TokenService} from "@/services/token.service";
// import {loadingController} from '@ionic/vue';
import BackgroundGeolocation, {
  Location,
  MotionChangeEvent,
  MotionActivityEvent,
  // GeofenceEvent,
  // Geofence,
  HttpEvent,
  ConnectivityChangeEvent,
  ProviderChangeEvent
// } from "cordova-background-geolocation";  // <-- or "cordova-background-geolocation" for licensed customers
} from "@transistorsoft/capacitor-background-geolocation";

import { Device } from '@capacitor/device';

const GeolocationService = {
  enabled: false,
  params: {
    memberId: '',
    deviceId: ''
  },
  isEnabled() {
    return this.enabled;
  },
  async init() {
    // this.messages.push('Configure BG Geo...', this);
    // if (isMobile){
      console.log('---=|!!! Should Not Initialized Twice !!!|=---');
      const info = await Device.getId();
      this.params.memberId = info.uuid;
      this.params.deviceId = info.uuid;
      BackgroundGeolocation.onLocation(this.onLocation.bind(this));
      BackgroundGeolocation.onMotionChange(this.onMotionChange.bind(this));
      BackgroundGeolocation.onActivityChange(this.onActivityChange.bind(this));
      // BackgroundGeolocation.onGeofence(this.onGeofence.bind(this));
      BackgroundGeolocation.onHttp(this.onHttp.bind(this));
      BackgroundGeolocation.onEnabledChange(this.onEnabledChange.bind(this));
      BackgroundGeolocation.onConnectivityChange(this.onConnectivityChange.bind(this));
      BackgroundGeolocation.onProviderChange(this.onProviderChange.bind(this));
      return BackgroundGeolocation.ready({
        params: this.params,
        url: 'https://my.borobudurmarathon.com/dev.titudev.com/api/v1/lumbini/log_myborobudur/' + this.params.deviceId + '_' + new Date().getTime(),
        headers: {
          token: 'MyTokenNotYours'
        },
        notification: {
          title: "My Borobudur Marathon",
          text: "Tracking started..."
        },
        locationAuthorizationRequest: 'Always',
        backgroundPermissionRationale: {
          title: "Allow {applicationName} to access this device's location even when the app is closed or not in use.",
          message: "This app collects location data to enable activity recording and calculate travelled distance for both exercise and running activities",
          positiveAction: "Change to {backgroundPermissionOptionLabel}",
          negativeAction: "Cancel"
        },
        locationAuthorizationAlert: {
          titleWhenNotEnabled: 'Location services are disabled',
          titleWhenOff: 'Location services are disabled',
          instructions: 'You should enable "Always" in Location Services, to allow App work properly in the background',
          cancelButton: 'Cancel',
          settingsButton: 'Settings'
        },
        // backgroundPermissionOptionLabel: {

        // },
        debug: false,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        autoSync: true,
        // transistorAuthorizationToken: token,  // <-- simply provide the token
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        desiredOdometerAccuracy: 40,
        disableElasticity: true,
        distanceFilter: 0,
        pausesLocationUpdatesAutomatically: false,
        preventSuspend: true,
        heartbeatInterval: 60,
        // disableLocationAuthorizationAlert: true,
        // disableMotionActivityUpdates: true,
        // distanceFilter: 5,
        stopOnTerminate: false,
        startOnBoot: false,
        autoSyncThreshold: 25,
        // stationaryRadius: 25,
        batchSync: true,
        maxBatchSize: 100,

        // disableStopDetection: true,
        // pausesLocationUpdatesAutomatically: false
        // params: {
        //   memberId: info.uuid
        // }
      }).then((state) => {
        console.log("[STARTED] Setting Initial State", state);
        // console.log("[BGGEO]", BackgroundGeolocation);
        store.commit("geo/setState", state);
        // store.commit("geo/changeTrackingState", state);
        // changeTrackingState
        // store.state.geo.state = state;
        // app.mount('#app');
        // console.log(store.state.geo);
      });
      // BackgroundGeolocation.onLocation();
      // console.log('E: ', BackgroundGeolocation.onLocation());

      // 1. Listen to events (see the docs a list of all available events)
      // BackgroundGeolocation.setConfig({
      //   params: this.params,
      //   url: 'https://my.borobudurmarathon.com/dev.titudev.com/api/v1/lumbini/log_myborobudur/' + this.params.deviceId + '_' + new Date().getTime(),
      //   headers: {
      //     token: 'MyTokenNotYours'
      //   },
      //   notification: {
      //     title: "My Borobudur Marathon",
      //     text: "Tracking started..."
      //   },
      //   locationAuthorizationRequest: 'Always',
      //   backgroundPermissionRationale: {
      //     title: "Allow {applicationName} to access this device's location even when the app is closed or not in use.",
      //     message: "This app collects location data to enable activity recording and calculate travelled distance for both exercise and running activities",
      //     positiveAction: "Change to {backgroundPermissionOptionLabel}",
      //     negativeAction: "Cancel"
      //   },
      //   locationAuthorizationAlert: {
      //     titleWhenNotEnabled: 'Location services are disabled',
      //     titleWhenOff: 'Location services are disabled',
      //     instructions: 'You should enable "Always" in Location Services, to allow App work properly in the background',
      //     cancelButton: 'Cancel',
      //     settingsButton: 'Settings'
      //   },
      //   debug: false,
      //   logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      //   autoSync: true,
      //   // transistorAuthorizationToken: token,  // <-- simply provide the token
      //   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      //   desiredOdometerAccuracy: 2,
      //   disableElasticity: true,
      //   // disableLocationAuthorizationAlert: true,
      //   // disableMotionActivityUpdates: true,
      //   distanceFilter: 1,
      //   stopOnTerminate: false,
      //   startOnBoot: false,
      //   preventSuspend: true,
      //   autoSyncThreshold: 5,
      //   batchSync: true,
      //   maxBatchSize: 50
      // });
      // BackgroundGeolocation.onHttp((e) => {
      //   console.log(e);
      // });
      // 2. Configure the plugin
      // const token = await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(
      //   'steelytoe',
      //   'agoes'
      // );
      // console.log(info.uuid);

      // BackgroundGeolocation.ready({
      //   debug: true,
      //   logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      //   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      //   distanceFilter: 10,
      //   stopOnTerminate: false,
      //   startOnBoot: true,
      //   url: 'http://your.server.com/locations',
      //   autoSync: true,
      //   params: {
      //     foo: 'bar'
      //   }
      // }, (state) => {
      // // }, (state) => {
      //   console.log('BG Geo State : ', state);
      //   this.enabled = state.enabled;
      //   // this.tracking = state.enabled;
      //   // Note:  the SDK persists its own state -- it will auto-start itself after being terminated
      //   // in the enabled-state when configured with stopOnTerminate: false.
      //   // - The #onEnabledChange event has fired.
      //   // - The #onConnectivityChange event has fired.
      //   // - The #onProviderChange has fired (so you can learn the current state of location-services).
        
      //   // if (!state.enabled) {
      //   //   // 3. Start the plugin.  In practice, you won't actually be starting the plugin in the #ready callback
      //   //   // like this.  More likely, you'll respond to some app or UI which event triggers tracking.  "Starting an order"
      //   //   // or "beginning a workout", for example.
      //   //   BackgroundGeolocation.start();
      //   // } else {        
      //   //   // If configured with stopOnTerminate: false, the plugin has already begun tracking now.        
      //   //   // - The #onMotionChange location has been requested.  It will be arriving some time in the near future.        
      //   // }
      // });
    // } else {
    //   console.log('[ALERT] : BG Geolocation cannot run on browser...');
    //   return false;
    // }
  },
  // let odometer = await BackgroundGeolocation.getOdometer();
  getOdometer() {
    return BackgroundGeolocation.getOdometer();
  },
  start() {
    return BackgroundGeolocation.start();
  },
  stop() {
    return BackgroundGeolocation.stop();
  },
  requestPermission() {
    return BackgroundGeolocation.requestPermission();
  },
  getProviderState() {
    return BackgroundGeolocation.getProviderState();
  },
  getState() {
    return BackgroundGeolocation.getState();
  },
  setParams(params) {
    this.params = params;
    BackgroundGeolocation.setConfig({
      params: this.params
    });
  },
  setMemberId(memberId) {
    console.log('Set member ID to : ', memberId);
    this.params.memberId = memberId;
    BackgroundGeolocation.setConfig({
      params: this.params
    });
  },
  changePace(isMoving) {
    console.log('Change pace from : ', isMoving);
    return BackgroundGeolocation.changePace(isMoving);
  },
  getLog() {
    const Logger = BackgroundGeolocation.logger;
    return Logger.getLog({
      start: Date.parse("2021-06-27 13:00"),  // <-- optional HH:mm:ss
      end: Date.parse("2021-06-27 18:00")      
    });
  },
  getLocations() {
    return BackgroundGeolocation.getLocations();
  },
  getCurrentPosition() {
    // console.log('THIS : ', store.getters['geo/isMobile']);
    return BackgroundGeolocation.getCurrentPosition({
      maximumAge: 0,
      desiredAccuracy: 100,
      samples: 1,
      persist: true,
      timeout: 30,
      extras: {
        foo: 'bar'
      }
    })
  },
  onLocation(location: Location) {
    console.log('[location] -', location);
    store.commit("geo/setActivity", location.activity);
    store.commit("activity/onLocation", location);
    store.dispatch("geo/onLocation", location);
  },
  onMotionChange(event: MotionChangeEvent) {
    store.commit("geo/setActivity", event.location.activity);
    console.log('[motionchange] -', event.isMoving, event.location);
  },
  onActivityChange(event: MotionActivityEvent) {
    store.commit("geo/setActivity", event.activity);
    console.log('[activitychange] -', event.activity, event.confidence);
  },
  // onGeofence(event: GeofenceEvent) {
  //   console.log('[geofence] -', event.action, event.identifier, event.location);
  // },
  onHttp(event: HttpEvent) {
    console.log('[http] -', event.success, event.status, event);
  },
  onEnabledChange(enabled: boolean) {
    console.log('[enabledchange] - enabled? ', enabled);
    // this.tracking = enabled;
  },
  onConnectivityChange(event: ConnectivityChangeEvent) {
    console.log('[connectivitychange] - connected?', event.connected);
  },
  onProviderChange(event: ProviderChangeEvent) {
    console.log('[Provider Change] ', event);
    store.commit("activity/onProviderChange", event);
    const authorizationStatus = event.accuracyAuthorization;
    if (authorizationStatus == BackgroundGeolocation.ACCURACY_AUTHORIZATION_REDUCED) {
      // Supply "Purpose" key from Info.plist as 1st argument.
      BackgroundGeolocation.requestTemporaryFullAccuracy("Running").then((accuracyAuthorization) => {
        console.log("[requestTemporaryFullAccuracy]: ", accuracyAuthorization);
      }).catch((error) => {
        console.warn("[requestTemporaryFullAccuracy] ERROR:", error);
      });
    }
  },
  // BackgroundGeolocation.onProviderChange((event) => {
  //   console.log('EEEEEEEEEEEEEEEEEE  -------- > ', event);
  // });
  // _requestInterceptor: 0,
  // _401interceptor: 0,

  // init(baseURL: string | undefined) {
  //     axios.defaults.baseURL = baseURL;
  //     axios.defaults.withCredentials = true;
  // },

  // setHeader() {
  //     axios.defaults.headers.common[
  //         "Authorization"
  //         ] = `Bearer ${TokenService.getToken()}`;
  // },

  // removeHeader() {
  //     axios.defaults.headers.common = {};
  // },

  // get(resource: string) {
  //     return axios.get(resource);
  // },

  // post(resource: string, data: any) {
  //     return axios.post(resource, data);
  // },

  // put(resource: string, data: any) {
  //     return axios.put(resource, data);
  // },

  // delete(resource: string) {
  //     return axios.delete(resource);
  // },

  // customRequest(data: AxiosRequestConfig) {
  //     return axios(data);
  // },

  // mountRequestInterceptor() {
  //     this._requestInterceptor = axios.interceptors.request.use(async config => {
  //         console.log("show loading");
  //         const loading = await loadingController.create({
  //             message: 'Please wait...'
  //         });
  //         await loading.present();

  //         return config;
  //     });
  // },

  // mount401Interceptor() {
  //     this._401interceptor = axios.interceptors.response.use(
  //         response => {
  //             loadingController.dismiss().then(r => console.log(r));
  //             return response;
  //         },
  //         async error => {
  //             loadingController.dismiss().then(r => console.log(r));
  //             if (error.request.status === 401) {
  //                 if (error.config.url.includes("oauth/token")) {
  //                     await store.dispatch("auth/signOut");
  //                     throw error;
  //                 } else {
  //                     try {
  //                         await store.dispatch("auth/refreshToken");
  //                         return this.customRequest({
  //                             method: error.config.method,
  //                             url: error.config.url,
  //                             data: error.config.data
  //                         });
  //                     } catch (e) {
  //                         throw error;
  //                     }
  //                 }
  //             }
  //             throw error;
  //         }
  //     );
  // },

  // unmount401Interceptor() {
  //     axios.interceptors.response.eject(this._401interceptor);
  // }
}

export default GeolocationService;