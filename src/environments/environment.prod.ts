// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'fvl-app',
    appId: '1:384786685934:web:00b416e2fd8b6ece3d38ff',
    storageBucket: 'fvl-app.appspot.com',
    apiKey: 'AIzaSyDQIPFCxtnVhfs5ADqJX6r7msaCNFn8lJs',
    authDomain: 'fvl-app.firebaseapp.com',
    messagingSenderId: '384786685934',
  },
  production: true,
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
  apiUrl: "https://us-central1-fvl-app.cloudfunctions.net/api"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
