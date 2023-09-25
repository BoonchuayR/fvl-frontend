import {Application} from "express";
import {all} from "./customer.controller";

/**
 * User routes
 * @param {Application} app application.
 */
export function customerRoutes(app: Application) {
//   app.post("/customers",
//     isAuthenticated,
//     isAuthorized({hasRole: ["admin"]}),
//     create
//   );

  // lists all users
  app.get("/customers", [
    // isAuthenticated,
    // isAuthorized({hasRole: ["admin"]}),
    all,
  ]);

  // get :id user
  //   app.get("/customers/:id", [
  //     isAuthenticated,
  //     isAuthorized({hasRole: ["admin"], allowSameUser: true}),
  //     get,
  //   ]);

  // updates :id user
  //   app.patch("/users/:id", [
  //     isAuthenticated,
  //     isAuthorized({hasRole: ["admin"], allowSameUser: true}),
  //     patch,
  //   ]);

  // deletes :id user
//   app.delete("/customers/:id", [
//     isAuthenticated,
//     isAuthorized({hasRole: ["admin"]}),
//     remove,
//   ]);
}
