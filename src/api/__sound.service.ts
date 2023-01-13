// const SOUND_MAP = {
//   "iOS": {
//     "LONG_PRESS_ACTIVATE": 1113,
//     "LONG_PRESS_CANCEL": 1075,
//     "ADD_GEOFENCE": 1114,
//     "BUTTON_CLICK": 1104,
//     "MESSAGE_SENT": 1303,
//     "ERROR": 1006,
//     "OPEN": 1502,
//     "CLOSE": 1503,
//     "FLOURISH": 1509,
//     "TEST_MODE_CLICK": 1130,
//     "TEST_MODE_SUCCESS": 1114
//   },
//   "Android": {
//     "LONG_PRESS_ACTIVATE": "DOT_START",
//     "LONG_PRESS_CANCEL": "DOT_STOP",
//     "ADD_GEOFENCE": "DOT_SUCCESS",
//     "BUTTON_CLICK": "BUTTON_CLICK",
//     "MESSAGE_SENT": "WHOO_SEND_SHARE",
//     "ERROR": "ERROR",
//     "OPEN": "OPEN",
//     "CLOSE": "CLOSE",
//     "FLOURISH": "POP_OPEN",
//     "TEST_MODE_CLICK": "POP",
//     "TEST_MODE_SUCCESS": "BEEP_ON"
//   },
//   "browser": {
//     "LONG_PRESS_ACTIVATE": 1,
//     "LONG_PRESS_CANCEL": 1,
//     "ADD_GEOFENCE": 1,
//     "BUTTON_CLICK": 1,
//     "MESSAGE_SENT": 1,
//     "ERROR": 1,
//     "OPEN": 1,
//     "CLOSE": 1,
//     "FLOURISH": 1
//   }
// };

// import BackgroundGeolocation from "@transistorsoft/capacitor-background-geolocation";

// const SoundService = {
//   async playSound(name) {
//     let soundId = 0;
//     const deviceInfo = await BackgroundGeolocation.getDeviceInfo();
//     if (typeof(name) === 'string') {
//       soundId = SOUND_MAP[deviceInfo.platform][name];
//     } else if (typeof(name) === 'number') {
//       soundId = name;
//     }
//     if (!soundId) {
//       alert('Invalid sound id provided to BGService#playSound' + name);
//       return;
//     }
//     BackgroundGeolocation.playSound(soundId);
//   }
// };

// export { SoundService };