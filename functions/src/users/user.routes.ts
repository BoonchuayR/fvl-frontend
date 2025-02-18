import {Application} from "express";
import {all, create, get, patch, remove} from "./user.controller";
import {isAuthenticated} from "../auth/authenticated";
import {isAuthorized} from "../auth/authorized";

/**
 * User routes
 * @param {Application} app application.
 */
export function userRoutes(app: Application) {
  app.post("/users",
    isAuthenticated,
    isAuthorized({hasRole: ["admin"]}),
    create
  );

  // lists all users
  app.get("/users", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin"]}),
    all,
  ]);

  // get :id user
  app.get("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin"], allowSameUser: true}),
    get,
  ]);

  // updates :id user
  app.patch("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin"], allowSameUser: true}),
    patch,
  ]);

  // deletes :id user
  app.delete("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin"]}),
    remove,
  ]);
}
