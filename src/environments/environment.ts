// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    // projectId: 'foodvilla-d992a',
    // appId: '1:352719262980:web:68774fb454ff9db29b6c51',
    // storageBucket: 'foodvilla-d992a.appspot.com',
    // locationId: 'asia-southeast1',
    // apiKey: 'AIzaSyAHcCQ90nKCxtEtJVZprmQF7l8-9ACMg8c',
    // authDomain: 'foodvilla-d992a.firebaseapp.com',
    // messagingSenderId: '352719262980',
    // measurementId: 'G-T3XYTC8NVY',
    apiKey: "AIzaSyCfZd6VvGaHl6acfUul25DfuoamJIIeD20",
    authDomain: "foodvilla-app-b4a0d.firebaseapp.com",
    projectId: "foodvilla-app-b4a0d",
    storageBucket: "foodvilla-app-b4a0d.appspot.com",
    messagingSenderId: "812819731470",
    ppId: "1:812819731470:web:28cd6e7f3fb2ff81f2d85f",
  },
  production: false,
  // defaultauth: "fakebackend",
  defaultauth: "firebase",
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
