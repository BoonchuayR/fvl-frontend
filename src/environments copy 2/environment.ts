// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: "foodvilla-1fe60",
    appId: "1:428569454146:web:a4fdd59b8ff3411ac6afdb",
    storageBucket: "foodvilla-1fe60.firebasestorage.app",
    apiKey: "AIzaSyA1xF4sfiDPLIO47g94Bf3JImYYVCtUPAk",
    authDomain: "foodvilla-1fe60.firebaseapp.com",
    messagingSenderId: "G-5QB12K6DBH",
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
  apiUrl: "https://us-central1-foodvilla-1fe60.cloudfunctions.net/api",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
